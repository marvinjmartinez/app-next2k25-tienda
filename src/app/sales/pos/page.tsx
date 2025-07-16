// src/app/sales/pos/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus, Trash2, User, DollarSign, X, CreditCard, Wallet, FileText, Truck, Building, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Product } from '@/lib/dummy-data';
import { getProducts, categories } from '@/lib/dummy-data';
import posCustomersData from '@/data/pos_customers.json';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/context/auth-context';
import { formatCurrency, getPriceForCustomer } from '@/lib/utils';
import { ProductCard } from '@/components/product-card';
import { ImageViewerDialog } from '@/components/image-viewer-dialog';

interface PosCartItem extends Product {
    quantity: number;
}

export interface PosSale {
    id: string;
    date: string;
    customer?: { id: string; name: string };
    items: PosCartItem[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    paymentMethod: 'Efectivo' | 'Tarjeta' | 'Crédito';
    status: 'Completada';
}

export interface PosCustomer {
    id: string;
    name: string;
    email?: string;
    type: 'natural' | 'empresa';
    role?: UserRole; // Role is optional for POS customers
    identification?: string;
    phone?: string;
    address?: string;
}

const POS_CUSTOMERS_KEY = 'pos_customers';
const SALES_STORAGE_KEY = 'pos_sales';

const loadUsers = (): PosCustomer[] => {
    if (typeof window === 'undefined') return [];
    try {
        const storedUsers = localStorage.getItem(POS_CUSTOMERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            localStorage.setItem(POS_CUSTOMERS_KEY, JSON.stringify(posCustomersData));
            return posCustomersData;
        }
    } catch (error) {
        console.error("Error loading POS customers:", error);
        return posCustomersData;
    }
};

export default function PosPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allCustomers, setAllCustomers] = useState<PosCustomer[]>([]);
    const [cart, setCart] = useState<PosCartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer | null>(null);
    const [shippingCost, setShippingCost] = useState<number | string>('');
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [customerSearch, setCustomerSearch] = useState('');
    const [amountReceived, setAmountReceived] = useState<number | string>('');
    const [paymentMethod, setPaymentMethod] = useState<PosSale['paymentMethod']>('Efectivo');
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState<string[]>([]);
    const [viewerProductName, setViewerProductName] = useState('');
    const [productDetail, setProductDetail] = useState<Product | null>(null);

    useEffect(() => {
        setAllProducts(getProducts());
        setAllCustomers(loadUsers());
    }, []);
    
    // Recalculate cart prices when customer changes
    useEffect(() => {
        if (cart.length === 0) return;

        setCart(prevCart => {
            return prevCart.map(item => {
                const productData = allProducts.find(p => p.id === item.id);
                if (productData) {
                    return {
                        ...item,
                        price: getPriceForCustomer(productData, selectedCustomer?.role || 'cliente')
                    };
                }
                return item;
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCustomer]);

    const handleOpenImageViewer = (product: Product) => {
        setViewerImages([product.image, ...(product.gallery || [])]);
        setViewerProductName(product.name);
        setIsViewerOpen(true);
    };

    const handleOpenProductDetail = (product: Product) => {
        setProductDetail(product);
    }

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  p.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, categoryFilter, allProducts]);
    
    const filteredCustomers = useMemo(() => {
        if (!customerSearch) return allCustomers;
        return allCustomers.filter(c => 
            c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            (c.identification && c.identification.toLowerCase().includes(customerSearch.toLowerCase()))
        );
    }, [customerSearch, allCustomers]);


    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const price = getPriceForCustomer(product, selectedCustomer?.role || 'cliente');
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1, price } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1, price }];
        });
        toast({
            title: "Producto agregado",
            description: `${product.name} añadido a la venta.`,
        })
    }, [toast, selectedCustomer]);

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            setCart(prev => prev.filter(item => item.id !== productId));
        } else {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
        }
    };
    
    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
    const tax = useMemo(() => subtotal * 0.16, [subtotal]);
    const numericShippingCost = useMemo(() => {
        const cost = typeof shippingCost === 'number' ? shippingCost : parseFloat(shippingCost);
        return isNaN(cost) ? 0 : cost;
    }, [shippingCost]);
    const total = useMemo(() => subtotal + tax + numericShippingCost, [subtotal, tax, numericShippingCost]);

    const change = useMemo(() => {
        if (paymentMethod !== 'Efectivo') return 0;
        const received = typeof amountReceived === 'number' ? amountReceived : parseFloat(amountReceived);
        if (isNaN(received)) return 0;
        return received >= total ? received - total : 0;
    }, [amountReceived, total, paymentMethod]);

    const handleConfirmSale = () => {
        const newSale: PosSale = {
            id: `VTA-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString(),
            customer: selectedCustomer ? { id: selectedCustomer.id, name: selectedCustomer.name } : undefined,
            items: cart,
            subtotal,
            tax,
            shippingCost: numericShippingCost,
            total,
            paymentMethod,
            status: 'Completada',
        };

        try {
            const existingSales: PosSale[] = JSON.parse(localStorage.getItem(SALES_STORAGE_KEY) || '[]');
            existingSales.unshift(newSale);
            localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(existingSales));
        } catch (error) {
            console.error('Error saving sale to localStorage', error);
        }

        toast({
            title: "Venta Completada",
            description: `Venta ${newSale.id} registrada exitosamente.`
        });

        // Reset state
        setCart([]);
        setSelectedCustomer(null);
        setCustomerSearch('');
        setShippingCost('');
        setAmountReceived('');
        setPaymentMethod('Efectivo');
        setPaymentModalOpen(false);

        // Redirect to detail page for printing
        router.push(`/sales/pos/history/${newSale.id}?print=true`);
    };

    return (
        <>
            <div className="grid md:grid-cols-3 lg:grid-cols-[1fr_400px] gap-8 items-start">
                {/* Center Column: Product Search and Results */}
                <div className="md:col-span-2 lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar producto..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full sm:w-[200px]">
                                        <SelectValue placeholder="Categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[65vh]">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-4">
                                    {filteredProducts.map(p => (
                                        <ProductCard 
                                            key={p.id}
                                            product={p}
                                            categoryName=""
                                            onAddToCart={addToCart}
                                            onImageClick={handleOpenImageViewer}
                                            onViewDetails={handleOpenProductDetail}
                                            className="w-full"
                                        />
                                    ))}
                                </div>
                                {filteredProducts.length === 0 && (
                                    <div className="text-center text-muted-foreground py-16">
                                        {searchQuery ? "No se encontraron productos." : "Empieza buscando un producto."}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Totals and Actions */}
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Resumen de Venta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                           <Button onClick={() => setCustomerModalOpen(true)} variant="outline" className="w-full justify-start text-left font-normal pr-8">
                               <User className="mr-2 h-4 w-4" />
                               <span className="truncate">{selectedCustomer ? selectedCustomer.name : "Cliente General"}</span>
                           </Button>
                           {selectedCustomer && (
                                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setSelectedCustomer(null)}>
                                    <X className="h-4 w-4"/>
                                    <span className="sr-only">Quitar cliente</span>
                                </Button>
                            )}
                        </div>
                        <Separator />
                        
                        <ScrollArea className="h-48">
                            <Table>
                                <TableBody>
                                    {cart.length > 0 ? cart.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="p-2">
                                                <p className="font-medium truncate w-32">{item.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-2 text-right align-top">
                                                {formatCurrency(item.price * item.quantity)}
                                            </TableCell>
                                            <TableCell className="p-1 align-top">
                                                <Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => updateQuantity(item.id, 0)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">Agrega productos</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                        <Separator />
                        
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">IVA (16%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <Label htmlFor="shipping" className="text-muted-foreground flex items-center gap-2"><Truck className="h-4 w-4" />Costo de Envío</Label>
                                <Input 
                                    id="shipping"
                                    type="number"
                                    className="w-24 h-8 text-right"
                                    placeholder="0.00"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                />
                            </div>
                            <Separator />
                            <div className="flex justify-between text-xl font-bold"><span >Total</span><span>{formatCurrency(total)}</span></div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg" disabled={cart.length === 0} onClick={() => setPaymentModalOpen(true)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Cobrar
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            
            <Dialog open={isPaymentModalOpen} onOpenChange={setPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Procesar Pago</DialogTitle>
                        <DialogDescription>Confirma los detalles de la venta.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="text-center">
                            <p className="text-muted-foreground">Total a Pagar</p>
                            <p className="text-4xl font-bold">{formatCurrency(total)}</p>
                        </div>
                        <RadioGroup defaultValue="Efectivo" className="grid grid-cols-3 gap-4" onValueChange={(value: PosSale['paymentMethod']) => setPaymentMethod(value)}>
                            <div>
                                <RadioGroupItem value="Efectivo" id="cash" className="peer sr-only" />
                                <Label htmlFor="cash" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <Wallet className="mb-3 h-6 w-6" />
                                    Efectivo
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="Tarjeta" id="card" className="peer sr-only" />
                                <Label htmlFor="card" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <CreditCard className="mb-3 h-6 w-6" />
                                    Tarjeta
                                </Label>
                            </div>
                                <div>
                                <RadioGroupItem value="Crédito" id="credit" className="peer sr-only" />
                                <Label htmlFor="credit" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                    <FileText className="mb-3 h-6 w-6" />
                                    Crédito
                                </Label>
                            </div>
                        </RadioGroup>
                            {paymentMethod === 'Efectivo' && (
                            <div className="space-y-2">
                                <Label htmlFor="amount-received">Monto Recibido</Label>
                                <Input 
                                    id="amount-received" 
                                    type="number" 
                                    placeholder="Ej: 500.00" 
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="text-center text-lg h-12"
                                />
                            </div>
                            )}
                        {paymentMethod === 'Efectivo' && (
                                <div className="text-center">
                                <p className="text-muted-foreground">Cambio</p>
                                <p className="text-2xl font-semibold text-primary">{formatCurrency(change)}</p>
                            </div>
                        )}
                            {paymentMethod === 'Crédito' && !selectedCustomer && (
                            <p className="text-center text-sm text-destructive">
                                Debes seleccionar un cliente para una venta a crédito.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Cancelar</Button>
                        <Button 
                            onClick={handleConfirmSale} 
                            disabled={
                                (paymentMethod === 'Efectivo' && Number(amountReceived) < total) || 
                                (paymentMethod === 'Crédito' && !selectedCustomer)
                            }
                        >
                            Confirmar Venta
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isCustomerModalOpen} onOpenChange={setCustomerModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Seleccionar Cliente</DialogTitle>
                        <DialogDescription>Busca un cliente existente o crea uno nuevo desde la pestaña "Clientes".</DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-4 items-center pt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar por nombre o identificación..." className="pl-10" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} />
                        </div>
                    </div>
                    <ScrollArea className="h-96 mt-4 border rounded-lg">
                        <Table>
                             <TableHeader className="sticky top-0 bg-muted">
                                <TableRow>
                                    <TableHead>Identificación</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-mono text-xs">{c.identification || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{c.name}</div>
                                            <div className="text-xs text-muted-foreground">{c.email}</div>
                                        </TableCell>
                                        <TableCell className="capitalize">{c.type}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => { setSelectedCustomer(c); setCustomerModalOpen(false); }}>Seleccionar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {filteredCustomers.length === 0 && <p className="text-center text-sm text-muted-foreground p-8">No se encontraron clientes.</p>}
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <ImageViewerDialog
                open={isViewerOpen}
                onOpenChange={setIsViewerOpen}
                images={viewerImages}
                productName={viewerProductName}
            />
            <Dialog open={!!productDetail} onOpenChange={(open) => !open && setProductDetail(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{productDetail?.name}</DialogTitle>
                        <DialogDescription className="pt-2">
                           {productDetail?.description || "Este producto no tiene una descripción detallada."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setProductDetail(null)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

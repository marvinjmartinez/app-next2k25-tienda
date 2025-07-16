// src/app/sales/pos/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus, Trash2, User, DollarSign, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import type { Product } from '@/lib/dummy-data';
import { getProducts } from '@/lib/dummy-data';
import { useToast } from '@/hooks/use-toast';
import type { User as AuthUser } from '@/context/auth-context';
import usersData from '@/data/users.json';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PosCartItem extends Product {
    quantity: number;
}

interface PosSale {
    id: string;
    date: string;
    customer?: { id: string; name: string };
    items: PosCartItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: 'Completada';
}

const dummyCustomers: AuthUser[] = usersData as AuthUser[];
const SALES_STORAGE_KEY = 'pos_sales';

export default function PosPage() {
    const { toast } = useToast();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<PosCartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<AuthUser | null>(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [amountReceived, setAmountReceived] = useState<number | string>('');

    useEffect(() => {
        setAllProducts(getProducts());
    }, []);

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return [];
        return allProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 10); // Limit results for performance
    }, [searchQuery, allProducts]);
    
    const filteredCustomers = useMemo(() => {
        if (!customerSearch) return dummyCustomers;
        return dummyCustomers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
    }, [customerSearch]);


    const addToCart = useCallback((product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setSearchQuery('');
    }, []);

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            setCart(prev => prev.filter(item => item.id !== productId));
        } else {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
        }
    };
    
    const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
    const tax = useMemo(() => subtotal * 0.16, [subtotal]);
    const total = useMemo(() => subtotal + tax, [subtotal, tax]);

    const change = useMemo(() => {
        const received = typeof amountReceived === 'number' ? amountReceived : 0;
        return received >= total ? received - total : 0;
    }, [amountReceived, total]);

    const handleConfirmSale = () => {
        const newSale: PosSale = {
            id: `VENTA-${Date.now()}`,
            date: new Date().toISOString(),
            customer: selectedCustomer ? { id: selectedCustomer.id, name: selectedCustomer.name } : undefined,
            items: cart,
            subtotal,
            tax,
            total,
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
        setAmountReceived('');
        setPaymentModalOpen(false);
    };

    return (
        <>
            <div className="space-y-6">
                <PageHeader title="Punto de Venta" description="Realiza ventas rápidas y gestiona transacciones en tiempo real." />
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* Left Side: Product Search and Results */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar producto por nombre o código..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        {searchQuery && (
                            <Card>
                                <CardContent className="p-2 max-h-60 overflow-y-auto">
                                    {filteredProducts.length > 0 ? filteredProducts.map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer" onClick={() => addToCart(p)}>
                                            <div className="flex items-center gap-3">
                                                <Image src={p.image} alt={p.name} width={40} height={40} className="rounded-md object-cover" />
                                                <div>
                                                    <p className="font-medium">{p.name}</p>
                                                    <p className="text-sm text-muted-foreground">Stock: {p.stock}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold">{formatCurrency(p.price)}</p>
                                        </div>
                                    )) : <p className="text-center text-muted-foreground p-4">No se encontraron productos.</p>}
                                </CardContent>
                            </Card>
                        )}
                        {/* Cart Items */}
                        <Card>
                            <CardHeader><CardTitle>Productos en la Venta</CardTitle></CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Producto</TableHead>
                                                <TableHead className="w-[120px]">Cantidad</TableHead>
                                                <TableHead className="text-right">Subtotal</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cart.length > 0 ? cart.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center border rounded-md">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                                            <Input readOnly value={item.quantity} className="w-10 h-8 text-center border-0 bg-transparent focus-visible:ring-0" />
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">{formatCurrency(item.price * item.quantity)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => updateQuantity(item.id, 0)}><Trash2 className="h-4 w-4" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={4} className="h-24 text-center">Agrega productos para empezar una venta.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
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
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <User className="mr-2 h-4 w-4" />
                                            {selectedCustomer ? selectedCustomer.name : "Seleccionar Cliente"}
                                        </Button>
                                    </PopoverTrigger>
                                     {selectedCustomer && <Button variant="ghost" size="icon" className="absolute right-2 top-11" onClick={() => setSelectedCustomer(null)}><X className="h-4 w-4"/></Button>}
                                    <PopoverContent className="w-80 p-0">
                                        <div className="p-2 border-b">
                                             <Input placeholder="Buscar cliente..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} />
                                        </div>
                                        <ScrollArea className="h-60">
                                           {filteredCustomers.map(c => (
                                            <div key={c.id} className="p-2 hover:bg-muted cursor-pointer" onClick={() => { setSelectedCustomer(c); setCustomerSearch(''); }}>
                                                {c.name}
                                            </div>
                                           ))}
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">IVA (16%)</span><span>{formatCurrency(tax)}</span></div>
                                <div className="flex justify-between text-lg font-bold"><span >Total</span><span>{formatCurrency(total)}</span></div>
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
            </div>

            {/* Payment Modal */}
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
                        <div className="space-y-2">
                            <label htmlFor="amount-received">Monto Recibido</label>
                             <Input 
                                id="amount-received" 
                                type="number" 
                                placeholder="Ej: 500.00" 
                                value={amountReceived}
                                onChange={(e) => setAmountReceived(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="text-center text-lg h-12"
                             />
                        </div>
                        <div className="text-center">
                            <p className="text-muted-foreground">Cambio</p>
                            <p className="text-2xl font-semibold text-primary">{formatCurrency(change)}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleConfirmSale} disabled={Number(amountReceived) < total}>Confirmar Venta</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


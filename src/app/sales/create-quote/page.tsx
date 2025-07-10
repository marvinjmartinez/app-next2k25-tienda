
// src/app/sales/create-quote/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PageHeader } from '@/components/page-header';
import { AiProductSuggester } from '@/components/ai-product-suggester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Search, Plus, Send, Save } from 'lucide-react';

import type { Product } from '@/lib/dummy-data';
import { products as allProducts } from '@/lib/dummy-data';
import usersData from '@/data/users.json';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

const dummyCustomers = usersData.filter(u => u.role.startsWith('cliente')).map(u => ({ id: u.id, name: u.name }));

interface QuoteItem extends Product {
  quantity: number;
}

export interface Quote {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Pagada' | 'Enviada' | 'Borrador' | 'Cancelada';
  items: QuoteItem[];
}


export default function CreateQuotePage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  const handleAddProductToQuote = (product: Product, quantity: number = 1) => {
    setQuoteItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast({
        title: "Producto agregado a la cotización",
        description: `${product.name} ha sido añadido.`
    })
  };

  const handleRemoveItem = (productId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setQuoteItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };
  
  const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const quoteTotal = quoteItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const validateQuote = () => {
    if (!selectedCustomerId) {
      toast({ variant: 'destructive', title: "Cliente no seleccionado", description: "Por favor, selecciona un cliente." });
      return false;
    }
    if (quoteItems.length === 0) {
      toast({ variant: 'destructive', title: "Cotización Vacía", description: "Agrega productos antes de continuar." });
      return false;
    }
    return true;
  }
  
  const saveQuoteToLocalStorage = (status: 'Borrador' | 'Enviada') => {
      if (!validateQuote()) return;

      const newQuote: Quote = {
          id: `COT-${Date.now().toString().slice(-4)}`,
          customerName: selectedCustomerName,
          date: new Date().toISOString().split('T')[0],
          total: quoteTotal,
          status,
          items: quoteItems,
      };

      const existingQuotes: Quote[] = JSON.parse(localStorage.getItem('saved_quotes') || '[]');
      localStorage.setItem('saved_quotes', JSON.stringify([newQuote, ...existingQuotes]));
  }


  const handleSaveQuote = () => {
      saveQuoteToLocalStorage('Borrador');
      toast({
          title: "Cotización Guardada",
          description: "La cotización ha sido guardada como borrador.",
      });
      router.push('/sales/quotes');
  }

  const handleSendToCart = () => {
      if (!validateQuote()) return;
      
      quoteItems.forEach(item => {
          addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
          })
      });
      
      saveQuoteToLocalStorage('Enviada');

      toast({
          title: "Cotización enviada al carrito",
          description: `${quoteItems.length} productos han sido agregados al carrito de compras.`
      })
      router.push('/cart');
  }

  const handleCustomerChange = (customerId: string) => {
      setSelectedCustomerId(customerId);
      const customer = dummyCustomers.find(c => c.id === customerId);
      setSelectedCustomerName(customer ? customer.name : '');
  }

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Crear Nueva Cotización"
          description="Selecciona un cliente, agrega productos y genera una nueva cotización."
        />
        <Separator />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Seleccionar Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="customer-select">Cliente</Label>
                <Select onValueChange={handleCustomerChange}>
                  <SelectTrigger id="customer-select">
                    <SelectValue placeholder="Selecciona un cliente para la cotización" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyCustomers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>2. Productos en la Cotización</CardTitle>
                  <CardDescription>Añade o edita los productos para este cliente.</CardDescription>
                </div>
                <Button onClick={() => setIsProductDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="w-[100px]">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unitario</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteItems.length > 0 ? (
                      quoteItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                              className="h-8 w-20 text-center"
                              min="1"
                            />
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                          Aún no has agregado productos a la cotización.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between items-center gap-4">
                  <div className="text-right flex-1">
                    <p className="text-lg font-bold">Total: ${quoteTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Impuestos no incluidos</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="lg" variant="outline" onClick={handleSaveQuote}>
                        <Save className="mr-2 h-4 w-4"/>
                        Guardar Borrador
                    </Button>
                    <Button size="lg" onClick={handleSendToCart}>
                        <Send className="mr-2 h-4 w-4"/>
                        Enviar al Carrito
                    </Button>
                  </div>
              </CardFooter>
            </Card>
          </div>
          <div>
            <AiProductSuggester onSuggestionClick={(productName) => {
                const product = allProducts.find(p => p.name === productName);
                if (product) {
                    handleAddProductToQuote(product);
                } else {
                    toast({ variant: 'destructive', title: "Producto no encontrado", description: `El producto "${productName}" no se encontró en el catálogo.`})
                }
            }} />
          </div>
        </div>
      </div>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buscar y Agregar Productos</DialogTitle>
            <DialogDescription>
              Busca en el catálogo y agrega productos a la cotización actual.
            </DialogDescription>
          </DialogHeader>
          <div className="relative my-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
              />
          </div>
          <div className="max-h-[400px] overflow-y-auto pr-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                            <TableCell>
                                <Button size="sm" onClick={() => {
                                    handleAddProductToQuote(product);
                                    setIsProductDialogOpen(false);
                                    setSearchQuery('');
                                }}>
                                    Agregar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No se encontraron productos.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

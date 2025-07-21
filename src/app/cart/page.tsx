// src/app/cart/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Save, Plus, Minus, Printer } from 'lucide-react';

import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PrintableCart } from '@/components/printable-cart';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { saveQuotesApi, getQuotesApi } from '@/lib/local-storage-api';
import type { Quote, QuoteItem, CartItem } from '@/lib/types';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getSelectedItemsTotal, clearCart, toggleItemSelection, isItemSelected, getSelectedItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [itemsToPrint, setItemsToPrint] = useState<CartItem[] | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };
  
  const handleSaveForLater = () => {
    const selectedItemsToSave = getSelectedItems();
    if (!isAuthenticated || !user || selectedItemsToSave.length === 0) {
       toast({
        variant: 'destructive',
        title: "Selecciona productos",
        description: "Debes seleccionar al menos un producto para guardar.",
      });
      return;
    }

    const newQuote: Quote = {
      id: `COT-${Date.now().toString().slice(-4)}`,
      customerId: user.id,
      customerName: user.name,
      salespersonId: (user.role === 'admin' || user.role === 'vendedor') ? user.id : undefined,
      salespersonName: (user.role === 'admin' || user.role === 'vendedor') ? user.name : undefined,
      date: new Date().toISOString().split('T')[0],
      total: getSelectedItemsTotal(),
      status: 'Borrador',
      items: selectedItemsToSave.map(item => ({
        ...item,
        hint: '',
        stock: 0, 
        category: '',
        description: '',
        status: 'activo'
      })),
    };

    const existingQuotes = getQuotesApi();
    saveQuotesApi([newQuote, ...existingQuotes]);

    toast({
      title: "Productos Guardados",
      description: "Los productos seleccionados se han guardado en 'Mis Compras' para después.",
    });

    // Remove saved items from cart
    selectedItemsToSave.forEach(item => removeFromCart(item.id));
  }

  const handleCheckout = () => {
    if (getSelectedItems().length === 0) {
      toast({
        variant: 'destructive',
        title: "No hay productos seleccionados",
        description: "Por favor, selecciona los productos que deseas comprar.",
      });
      return;
    }
    router.push('/checkout');
  }

  const handlePrint = () => {
    let itemsForPrinting: CartItem[] = getSelectedItems();
    let totalForPrinting: number = getSelectedItemsTotal();
    
    // If no items are selected, print all items in the cart
    if (itemsForPrinting.length === 0 && cartItems.length > 0) {
        itemsForPrinting = cartItems;
        totalForPrinting = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    if (itemsForPrinting.length === 0) {
        toast({
            variant: "destructive",
            title: "Carrito vacío",
            description: "No hay productos en el carrito para imprimir.",
        });
        return;
    }
    setItemsToPrint(itemsForPrinting);
    setTimeout(() => {
        window.print();
        setItemsToPrint(null);
    }, 100);
  }


  return (
    <>
    <div className="flex flex-col min-h-screen no-print">
      <SiteHeader />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <p className="text-muted-foreground mb-4">Tu carrito está vacío.</p>
                <Button asChild>
                  <Link href="/products">Continuar Comprando</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex flex-col md:flex-row items-start gap-4 p-4 border-b last:border-b-0">
                          {/* Columna de Checkbox e Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <Checkbox
                              id={`select-${item.id}`}
                              checked={isItemSelected(item.id)}
                              onCheckedChange={() => toggleItemSelection(item.id)}
                              aria-label={`Seleccionar ${item.name}`}
                            />
                            <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                            <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                            </div>
                          </div>
                          
                          {/* Columna de Controles y Subtotal */}
                          <div className="w-full md:w-auto flex flex-col items-end gap-2">
                            <div className="flex items-center justify-end gap-2 w-full">
                                <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Input
                                        type="text"
                                        readOnly
                                        value={item.quantity}
                                        className="w-10 h-8 text-center border-0 bg-transparent focus-visible:ring-0"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción eliminará permanentemente "{item.name}" de tu carrito.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => removeFromCart(item.id)}>Eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                    <CardDescription>El total se calcula con base en los artículos seleccionados.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal (Seleccionado)</p>
                      <p>{formatCurrency(getSelectedItemsTotal())}</p>
                    </div>
                     <div className="flex justify-between">
                      <p className="text-muted-foreground">Envío</p>
                      <p>Gratis</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <p>Total</p>
                      <p>{formatCurrency(getSelectedItemsTotal())}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2 items-stretch">
                    {isAuthenticated ? (
                        <>
                          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCheckout} disabled={getSelectedItems().length === 0}>
                              Proceder al Pago
                          </Button>
                           <Button variant="outline" className="w-full" onClick={handleSaveForLater} disabled={getSelectedItems().length === 0}>
                              <Save className="mr-2 h-4 w-4" />
                              Guardar seleccionados
                          </Button>
                        </>
                    ) : (
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                            <Link href="/login">Iniciar Sesión para Pagar</Link>
                        </Button>
                    )}
                    <Button variant="secondary" className="w-full" onClick={handlePrint} disabled={cartItems.length === 0}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir Carrito
                    </Button>
                     <Button variant="link" className="w-full" asChild>
                        <Link href="/products">Continuar comprando</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
    <div className="hidden printable-content">
        {itemsToPrint && (
            <PrintableCart
                items={itemsToPrint}
                total={itemsToPrint.reduce((total, item) => total + item.price * item.quantity, 0)}
            />
        )}
    </div>
    </>
  );
}


// src/app/checkout/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck, Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import type { Quote } from '@/app/sales/create-quote/page';
import { LogoTienda } from '@/components/logo-tienda';


export default function CheckoutPage() {
  const { getSelectedItems, getSelectedItemsTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const itemsForCheckout = getSelectedItems();
  const checkoutTotal = getSelectedItemsTotal();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!user) {
        toast({
            variant: 'destructive',
            title: "Error de autenticación",
            description: "Debes iniciar sesión para realizar un pedido.",
        });
        router.push('/login');
        return;
      }
      
      // Guardar la compra en localStorage
      const newPurchase: Quote = {
          id: `COT-${Date.now().toString().slice(-4)}`,
          customerId: user.id,
          customerName: user.name,
          date: new Date().toISOString().split('T')[0],
          total: checkoutTotal,
          status: 'Pagada',
          items: itemsForCheckout.map(item => ({
            id: item.id,
            name: item.name,
            price: getPriceForCustomer(item, user.role),
            quantity: item.quantity,
            image: item.image,
            hint: '',
            stock: 0,
            category: '',
            description: '',
            status: 'activo'
          })),
      };

      try {
        const existingQuotes: Quote[] = JSON.parse(localStorage.getItem('saved_quotes') || '[]');
        existingQuotes.unshift(newPurchase);
        localStorage.setItem('saved_quotes', JSON.stringify(existingQuotes));
      } catch (error) {
        console.error("Error saving purchase to localStorage", error);
      }
      
      console.log("Placing order...", newPurchase);
      
      toast({
          title: "¡Pedido Realizado!",
          description: "Gracias por tu compra. Tu pedido ha sido registrado.",
      });

      clearCart(); // Clear entire cart after purchase
      router.push('/account/dashboard');
  }

  if (itemsForCheckout.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">No puedes proceder al pago sin productos.</p>
            <Button asChild>
                <Link href="/">Volver a la tienda</Link>
            </Button>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-muted/40">
       <header className="bg-background">
        <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoTienda width={40} height={40} className="h-10 w-auto" />
            <span className="font-bold text-xl font-headline text-foreground"> - Pago Seguro</span>
          </Link>
        </div>
      </header>
      <main className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
              <Button variant="outline" asChild>
                  <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Volver al carrito
                  </Link>
              </Button>
          </div>
          <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-1 md:order-2">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itemsForCheckout.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>{formatCurrency(checkoutTotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Envío</p>
                    <p>Gratis</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{formatCurrency(checkoutTotal)}</p>
                  </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        Realizar Pedido
                    </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="md:col-span-2 md:order-1 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Truck className="h-5 w-5"/> Información de Envío</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Juan" required defaultValue={user?.name.split(' ')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Pérez" required defaultValue={user?.name.split(' ').slice(1).join(' ')} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" placeholder="Av. Siempre Viva 123" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Springfield" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Código Postal</Label>
                    <Input id="zip" placeholder="12345" required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5"/> Detalles de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input id="cardNumber" placeholder="**** **** **** 1234" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                        <Input id="expiryDate" placeholder="MM/AA" required />
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required />
                      </div>
                  </div>
                   <div className="flex items-start space-x-2 pt-2">
                        <Lock className="h-4 w-4 text-muted-foreground mt-1" />
                        <p className="text-xs text-muted-foreground">
                            Toda la información es encriptada y segura. Esta es una tienda de demostración y no se procesarán pagos reales.
                        </p>
                    </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

const getPriceForCustomer = (product: { price: number }, role: string) => {
  // This is a simplified placeholder. In a real app, you'd fetch the full product data.
  switch (role) {
    case 'cliente_especial':
      return product.price * 0.9;
    case 'vendedor':
      return product.price * 0.85;
    default:
      return product.price;
  }
};

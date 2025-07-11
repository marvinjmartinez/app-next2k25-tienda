// src/app/cart/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { LogoTienda } from '@/components/logo-tienda';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartItemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };
  
  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === 'admin' || user.role === 'vendedor') {
      return "/sales/create-quote";
    }
    return "/account/dashboard";
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoTienda width={40} height={40} className="h-10 w-auto" />
            <span className="font-bold text-xl font-headline text-foreground">Distrimin SAS</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Inicio</Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Productos</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">Nosotros</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartItemCount() > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-1 text-xs bg-accent text-accent-foreground">{getCartItemCount()}</Badge>
                    )}
                    <span className="sr-only">Carrito</span>
                </Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/40x40.png" alt={user.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Mi Panel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Link href="/login">
                    <Button>
                        <User className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                    </Button>
                </Link>
            )}
          </div>
        </div>
      </header>

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
                    <div className="space-y-6">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                          <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover" />
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                              className="w-16 h-9 text-center"
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <p className="font-semibold w-24 text-right">{formatCurrency(item.price * item.quantity)}</p>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>{formatCurrency(getCartTotal())}</p>
                    </div>
                     <div className="flex justify-between">
                      <p className="text-muted-foreground">Envío</p>
                      <p>Gratis</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <p>Total</p>
                      <p>{formatCurrency(getCartTotal())}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    {isAuthenticated ? (
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                            <Link href="/checkout">Proceder al Pago</Link>
                        </Button>
                    ) : (
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                            <Link href="/login">Iniciar Sesión para Pagar</Link>
                        </Button>
                    )}
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
    </div>
  );
}

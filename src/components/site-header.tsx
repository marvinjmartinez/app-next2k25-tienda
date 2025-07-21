// src/components/site-header.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoTienda } from '@/components/logo-tienda';

export function SiteHeader() {
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === 'admin' || user.role === 'vendedor') {
      return "/sales/dashboard";
    }
    return "/account/dashboard";
  }

  return (
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
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
  );
}

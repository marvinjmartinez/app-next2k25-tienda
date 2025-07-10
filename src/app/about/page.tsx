// src/app/about/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function AboutPage() {
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
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
                   {user.role === 'admin' && (
                     <DropdownMenuItem onClick={() => router.push('/sales/create-quote')}>
                        <Logo className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
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

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Nuestra Historia</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Más de 50 años construyendo sueños, un tornillo a la vez.</p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">De un pequeño local a tu ferretería de confianza</h2>
              <p className="text-muted-foreground mb-4">
                "Distrimin SAS" nació en 1974 como un pequeño negocio familiar con una misión clara: proveer a nuestra comunidad con las mejores herramientas y un servicio inigualable. Lo que empezó con un mostrador y mucha pasión, hoy es el referente en materiales de construcción y ferretería en la región.
              </p>
              <p className="text-muted-foreground">
                A través de los años, hemos crecido junto a nuestros clientes, adaptándonos a las nuevas tecnologías pero sin perder el trato cercano que nos caracteriza. Cada proyecto de nuestros clientes es también un proyecto nuestro.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image src="https://placehold.co/600x400.png" data-ai-hint="vintage hardware store" alt="Tienda antigua de Distrimin SAS" width={600} height={400} className="rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold">Nuestros Valores</h2>
                     <p className="mt-2 text-muted-foreground">Los pilares que nos sostienen</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Calidad</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Solo ofrecemos productos que cumplen con los más altos estándares. Si no lo usaríamos nosotros, no lo vendemos.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Servicio</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Nuestro equipo no solo despacha, asesora. Estamos aquí para ayudarte a encontrar la solución perfecta para tu proyecto.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Confianza</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Construimos relaciones duraderas basadas en la honestidad y el compromiso con nuestros clientes y proveedores.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-foreground text-background">
        <div className="container mx-auto py-8 px-4 md:px-6">
            <p className="text-center text-sm text-muted-foreground">© 2024 Distrimin SAS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

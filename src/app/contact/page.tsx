// src/app/contact/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, User, Phone, Mail, MapPin, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { LogoTienda } from '@/components/logo-tienda';


export default function ContactPage() {
  const { getCartItemCount } = useCart();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const router = useRouter();


  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // En una aplicación real, aquí se enviaría el formulario a un backend.
      toast({
          title: "Mensaje Enviado",
          description: "Gracias por contactarnos. Te responderemos a la brevedad."
      });
      (e.target as HTMLFormElement).reset();
  }
  
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

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Ponte en Contacto</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">¿Tienes alguna pregunta o necesitas una cotización? Estamos aquí para ayudarte.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card>
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" type="text" placeholder="Tu nombre completo" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" type="email" placeholder="tu@email.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Input id="subject" type="text" placeholder="Ej: Cotización de materiales" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Mensaje</Label>
                            <Textarea id="message" placeholder="Escribe tu mensaje aquí..." rows={5} required />
                        </div>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Enviar Mensaje</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                  <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
                  <div className="space-y-4">
                      <div className="flex items-center gap-4">
                          <MapPin className="h-6 w-6 text-primary" />
                          <p className="text-muted-foreground">Av. de los Constructores 123, Colonia Industrial, C.P. 54321, Ciudad Ejemplo, México</p>
                      </div>
                      <div className="flex items-center gap-4">
                          <Phone className="h-6 w-6 text-primary" />
                          <p className="text-muted-foreground">+52 (55) 1234 5678</p>
                      </div>
                      <div className="flex items-center gap-4">
                          <Mail className="h-6 w-6 text-primary" />
                          <p className="text-muted-foreground">contacto@distriminsas.com</p>
                      </div>
                  </div>
              </div>
              <div>
                  <h3 className="text-xl font-bold mb-4">Horario de Atención</h3>
                  <p className="text-muted-foreground">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Sábados: 9:00 AM - 2:00 PM</p>
                  <p className="text-muted-foreground">Domingos: Cerrado</p>
              </div>
              <div className="aspect-video">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.59384934444!2d-99.13539578559983!3d19.43260778688179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f93f1a600c8b%3A0x83f06b120c1511a!2sPalacio%20de%20Bellas%20Artes!5e0!3m2!1ses-419!2smx!4v1684443318285!5m2!1ses-419!2smx" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-foreground text-background">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">© 2024 Distrimin SAS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

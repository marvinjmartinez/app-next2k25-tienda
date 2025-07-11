// src/app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/dummy-data';
import { getProducts, categories } from '@/lib/dummy-data';
import { ShoppingCart, User, LogOut, LayoutDashboard, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoTienda } from '@/components/logo-tienda';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const products = getProducts();
    const foundProduct = products.find(p => p.id === params.id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Cargando producto...</div>;
  }

  if (!product) {
    notFound();
  }
  
  const handleAddToCart = (product: Product) => {
    addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
    });
    toast({
      title: "Producto agregado",
      description: `${product.name} se ha añadido a tu carrito.`,
      action: (
        <div className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span>Agregado</span>
        </div>
      )
    });
  }

  const getCategoryName = (slug: string) => {
    return categories.find(c => c.slug === slug)?.name || 'Sin categoría';
  }

  const getDashboardPath = () => {
    if (!user) return "/login";
    return user.role === 'admin' || user.role === 'vendedor' ? "/sales/dashboard" : "/account/dashboard";
  }

  const allImages = [product.image, ...(product.gallery || [])];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoTienda className="h-10 w-auto" />
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
              <Link href="/login"><Button><User className="mr-2 h-4 w-4" />Iniciar Sesión</Button></Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <Card className="overflow-hidden">
                <Carousel>
                  <CarouselContent>
                    {allImages.map((img, index) => (
                       <CarouselItem key={index}>
                         <Image
                            src={img}
                            alt={`${product.name} - imagen ${index + 1}`}
                            width={600}
                            height={600}
                            className="w-full aspect-square object-cover"
                            data-ai-hint={index === 0 ? product.hint : undefined}
                         />
                       </CarouselItem>
                    ))}
                  </CarouselContent>
                  {allImages.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-4" />
                      <CarouselNext className="absolute right-4" />
                    </>
                  )}
                </Carousel>
              </Card>
            </div>
            <div>
              <p className="text-sm uppercase font-medium text-muted-foreground tracking-wider">{getCategoryName(product.category)}</p>
              <h1 className="text-3xl lg:text-4xl font-bold font-headline mt-2">{product.name}</h1>
              <p className="text-3xl text-primary font-bold mt-4">{formatCurrency(product.price)}</p>
              <Badge variant={product.stock > 0 ? "default" : "destructive"} className="mt-4">
                {product.stock > 0 ? `En Stock: ${product.stock} unidades` : 'Agotado'}
              </Badge>
              
              <Separator className="my-6" />

              <div className="prose prose-sm text-muted-foreground max-w-none">
                <h2 className="text-xl font-semibold text-foreground mb-2">Descripción del Producto</h2>
                <p>{product.description}</p>
              </div>

              <Separator className="my-6" />
              
              <Button size="lg" className="w-full" disabled={product.stock === 0} onClick={() => handleAddToCart(product)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock > 0 ? 'Agregar al Carrito' : 'No disponible'}
              </Button>
            </div>
          </div>
        </div>
      </main>

       <footer className="bg-foreground text-background mt-12">
        <div className="container mx-auto py-8 px-4 md:px-6">
            <p className="text-center text-sm text-muted-foreground">© 2024 Distrimin SAS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

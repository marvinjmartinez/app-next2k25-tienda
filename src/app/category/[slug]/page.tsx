// src/app/category/[slug]/page.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Wrench, User } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { products, categories, type Product } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { addToCart, getCartItemCount } = useCart();

  const category = categories.find(c => c.slug === params.slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(p => p.category === category.slug);

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
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl font-headline text-foreground">Distrimin SAS</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
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
             <Link href="/sales/create-quote">
                <Button>
                    <User className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-headline">Categoría: {category.name}</h1>
            <p className="text-muted-foreground mt-2">{category.description}</p>
          </div>
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categoryProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group flex flex-col">
                  <CardHeader className="p-0 relative">
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="absolute top-2 left-2 z-10">AGOTADO</Badge>
                    )}
                    <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={product.hint} />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg h-12">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.stock > 0 ? `${product.stock} en existencia` : "Sin existencias"}
                    </p>
                    <CardDescription className="text-primary font-semibold text-lg mt-2">${product.price.toFixed(2)}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {product.stock > 0 ? 'Agregar al carrito' : 'No disponible'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No hay productos en esta categoría por el momento.</p>
              <Button asChild className="mt-4">
                  <Link href="/products">Ver todos los productos</Link>
              </Button>
            </div>
          )}
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

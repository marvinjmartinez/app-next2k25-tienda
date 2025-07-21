// src/app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { getProducts, categories } from '@/lib/dummy-data';
import { ShoppingCart, CheckCircle, ArrowLeft } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};

const SVG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='30' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const id = pathname.split('/').pop();
    const products = getProducts();
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setIsLoading(false);
  }, [pathname]);

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

  const allImages = [product.image || SVG_PLACEHOLDER, ...(product.gallery || [])];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {allImages.map((img, index) => (
                     <CarouselItem key={index}>
                       <Image
                          src={img}
                          alt={`${product.name} - imagen ${index + 1}`}
                          width={600}
                          height={600}
                          className="w-full aspect-square object-cover rounded-lg border"
                          data-ai-hint={index === 0 ? product.hint : undefined}
                          priority
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

       <SiteFooter />
    </div>
  );
}

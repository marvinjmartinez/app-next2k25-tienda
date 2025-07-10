// src/components/product-card.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Maximize } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Product } from '@/lib/dummy-data';

interface ProductCardProps {
  product: Product;
  categoryName: string;
  onAddToCart: (product: Product) => void;
  onImageClick: (product: Product) => void;
}

export function ProductCard({ product, categoryName, onAddToCart, onImageClick }: ProductCardProps) {
  const allImages = [product.image, ...(product.gallery || [])];

  return (
    <Card className="overflow-hidden group flex flex-col">
      <CardHeader className="p-0 relative">
        <button onClick={() => onImageClick(product)} className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize className="h-8 w-8 text-white" />
          <span className="sr-only">Ampliar imagen</span>
        </button>
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2 z-10">AGOTADO</Badge>
        )}
        <Carousel className="w-full">
          <CarouselContent>
            {allImages.map((img, index) => (
              <CarouselItem key={index}>
                <Image
                  src={img}
                  alt={`${product.name} - imagen ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                  data-ai-hint={product.hint}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <CarouselNext className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            </>
          )}
        </Carousel>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg h-12">{product.name}</CardTitle>
        <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider mt-1">{categoryName}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {product.stock > 0 ? `${product.stock} en existencia` : "Sin existencias"}
        </p>
        <CardDescription className="text-primary font-semibold text-lg mt-2">${product.price.toFixed(2)}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock > 0 ? 'Agregar al carrito' : 'No disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// src/components/product-card.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Maximize, ExternalLink } from 'lucide-react';
import { Product } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';


interface ProductCardProps {
  product: Product;
  categoryName: string;
  onAddToCart: (product: Product) => void;
  onImageClick: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, categoryName, onAddToCart, onImageClick, className }: ProductCardProps) {

  return (
    <Card className={cn("overflow-hidden group flex flex-col", className)}>
      <CardHeader className="p-0 relative">
        <button onClick={() => onImageClick(product)} className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize className="h-8 w-8 text-white" />
          <span className="sr-only">Ampliar imagen</span>
        </button>
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 left-2 z-10">AGOTADO</Badge>
        )}
        
         <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover"
            data-ai-hint={product.hint}
            priority={product.featured}
          />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg h-12 leading-tight">{product.name}</CardTitle>
        <p className="text-xs uppercase font-medium text-muted-foreground tracking-wider mt-1">{categoryName}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {product.stock > 0 ? `${product.stock} en existencia` : "Sin existencias"}
        </p>
        <CardDescription className="text-primary font-semibold text-lg mt-2">${product.price.toFixed(2)}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
         <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <Link href={`/products/${product.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Detalle
          </Link>
        </Button>
        <Button
          className="w-full"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock > 0 ? 'Añadir' : 'Agotado'}
        </Button>
      </CardFooter>
    </Card>
  );
}

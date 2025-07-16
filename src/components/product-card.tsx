// src/components/product-card.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Maximize, FileText } from 'lucide-react';
import { Product } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';


interface ProductCardProps {
  product: Product;
  categoryName: string;
  onAddToCart: (product: Product) => void;
  onImageClick: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, categoryName, onAddToCart, onImageClick, onViewDetails, className }: ProductCardProps) {

  return (
    <Card className={cn("group flex flex-col", className)}>
      <CardHeader className="p-0 relative">
        <button onClick={() => onImageClick(product)} className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize className="h-6 w-6 text-white" />
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
            className="w-full h-32 object-cover"
            data-ai-hint={product.hint}
            priority={product.featured}
          />
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
          <p className="text-sm font-medium h-16 leading-tight hover:text-primary line-clamp-3">{product.name}</p>
          <p className="text-primary font-semibold text-base mt-auto pt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex flex-col gap-2 items-stretch">
        {onViewDetails && (
            <Button
                variant="outline"
                className="w-full h-8"
                size="sm"
                onClick={() => onViewDetails(product)}
            >
                <FileText className="mr-2 h-4 w-4" />
                Detalle
            </Button>
        )}
        <Button
          className="w-full h-8"
          size="sm"
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

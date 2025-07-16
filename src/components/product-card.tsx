// src/components/product-card.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Maximize } from 'lucide-react';
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
    <Card className={cn("overflow-hidden group flex flex-col", className)}>
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
      <CardContent className="p-3 flex-grow">
        <Link href={`/products/${product.id}`} passHref>
          <CardTitle as="a" className="text-sm h-10 leading-tight font-medium hover:text-primary cursor-pointer">{product.name}</CardTitle>
        </Link>
        <CardDescription className="text-primary font-semibold text-base mt-1">${product.price.toFixed(2)}</CardDescription>
      </CardContent>
      <CardFooter className="p-2 pt-0 flex gap-1">
        {onViewDetails && ( // This button is now effectively unused in POS but kept for flexibility
          <Button
            size="sm"
            variant="outline"
            className="px-2 h-8"
            onClick={() => onViewDetails(product)}
            title="Ver detalles"
          >
            <Maximize className="h-4 w-4" />
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

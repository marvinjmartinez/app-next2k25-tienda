// src/app/sales/tariffs/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { getProducts, saveProducts, type Product } from '@/lib/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { PriceTiers } from '@/lib/dummy-data';

export default function TariffsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadedProducts = getProducts().map(p => ({
        ...p,
        priceTiers: p.priceTiers ?? {
            cliente: p.price,
            cliente_especial: p.price * 0.9,
            vendedor: p.price * 0.85,
        }
    }));
    setProducts(loadedProducts);
  }, []);

  const handlePriceChange = (productId: string, tier: keyof PriceTiers, value: string) => {
    const newPrice = parseFloat(value) || 0;
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            priceTiers: {
              ...p.priceTiers!,
              [tier]: newPrice,
            },
          };
        }
        return p;
      })
    );
  };
  
  const handleSaveChanges = () => {
    saveProducts(products);
    toast({
        title: "Tarifas Actualizadas",
        description: "Los nuevos precios se han guardado correctamente.",
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Tarifas"
        description="Administra los diferentes niveles de precios para los productos."
      />
      <Card>
        <CardHeader>
          <CardTitle>Tarifas de Precios por Producto</CardTitle>
          <CardDescription>
            Modifica los precios para cada tipo de cliente y guarda los cambios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cliente Normal</TableHead>
                <TableHead className="text-right">Cliente Especial</TableHead>
                <TableHead className="text-right">Vendedor (Comisión)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={product.priceTiers?.cliente ?? ''}
                      onChange={(e) => handlePriceChange(product.id, 'cliente', e.target.value)}
                      className="w-28 text-right ml-auto"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                       value={product.priceTiers?.cliente_especial ?? ''}
                       onChange={(e) => handlePriceChange(product.id, 'cliente_especial', e.target.value)}
                      className="w-28 text-right ml-auto"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                     <Input
                      type="number"
                       value={product.priceTiers?.vendedor ?? ''}
                       onChange={(e) => handlePriceChange(product.id, 'vendedor', e.target.value)}
                      className="w-28 text-right ml-auto"
                      step="0.01"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end">
            <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

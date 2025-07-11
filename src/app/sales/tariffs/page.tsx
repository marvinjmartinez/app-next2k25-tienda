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
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { getProducts, type Product } from '@/lib/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function TariffsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

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
            Visualiza los precios para cada tipo de cliente. Las celdas se podrán editar en una futura versión.
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
                      type="text"
                      readOnly
                      value={formatCurrency(product.priceTiers?.cliente ?? product.price)}
                      className="w-28 text-right bg-muted"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="text"
                      readOnly
                      value={formatCurrency(product.priceTiers?.cliente_especial ?? product.price * 0.9)}
                      className="w-28 text-right bg-muted"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                     <Input
                      type="text"
                      readOnly
                      value={formatCurrency(product.priceTiers?.vendedor ?? product.price * 0.85)}
                      className="w-28 text-right bg-muted"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// src/app/sales/tariffs/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
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
import { getProducts, saveProducts, type Product, categories } from '@/lib/dummy-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { PriceTiers } from '@/lib/dummy-data';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function TariffsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

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
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nombre de producto..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[240px]">
                        <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las Categorías</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
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
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No se encontraron productos que coincidan con la búsqueda.
                    </TableCell>
                </TableRow>
              )}
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

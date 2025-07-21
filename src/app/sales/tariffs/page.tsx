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
            tipo1: p.price,
            tipo2: p.price * 0.9,
            tipo3: p.price * 0.85,
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
            Modifica los precios para cada tipo de cliente. El Precio Tipo 3 (Costo) se usa como base para el cálculo de comisiones.
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
                <TableHead className="text-right">Precio Tipo 1 (Público)</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Precio Tipo 2 (Especial)</TableHead>
                <TableHead className="text-right hidden md:table-cell">Precio Tipo 3 (Costo)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                    <div className="sm:hidden mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`p1-${product.id}`} className="text-xs text-muted-foreground">P. Público</Label>
                             <Input
                                id={`p1-${product.id}`}
                                type="number"
                                value={product.priceTiers?.tipo1 ?? ''}
                                onChange={(e) => handlePriceChange(product.id, 'tipo1', e.target.value)}
                                className="w-24 h-8 text-right"
                                step="0.01"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor={`p2-${product.id}`} className="text-xs text-muted-foreground">P. Especial</Label>
                              <Input
                                id={`p2-${product.id}`}
                                type="number"
                                value={product.priceTiers?.tipo2 ?? ''}
                                onChange={(e) => handlePriceChange(product.id, 'tipo2', e.target.value)}
                                className="w-24 h-8 text-right"
                                step="0.01"
                            />
                        </div>
                         <div className="flex items-center justify-between md:hidden">
                            <Label htmlFor={`p3-${product.id}`} className="text-xs text-muted-foreground">P. Costo</Label>
                             <Input
                                id={`p3-${product.id}`}
                                type="number"
                                value={product.priceTiers?.tipo3 ?? ''}
                                onChange={(e) => handlePriceChange(product.id, 'tipo3', e.target.value)}
                                className="w-24 h-8 text-right"
                                step="0.01"
                            />
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    <Input
                      type="number"
                      value={product.priceTiers?.tipo1 ?? ''}
                      onChange={(e) => handlePriceChange(product.id, 'tipo1', e.target.value)}
                      className="w-28 text-right ml-auto"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    <Input
                      type="number"
                       value={product.priceTiers?.tipo2 ?? ''}
                       onChange={(e) => handlePriceChange(product.id, 'tipo2', e.target.value)}
                      className="w-28 text-right ml-auto"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                     <Input
                      type="number"
                       value={product.priceTiers?.tipo3 ?? ''}
                       onChange={(e) => handlePriceChange(product.id, 'tipo3', e.target.value)}
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

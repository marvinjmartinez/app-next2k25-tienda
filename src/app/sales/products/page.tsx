// src/app/sales/products/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { products as allProducts, categories, type Product } from '@/lib/dummy-data';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export default function ProductsAdminPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    // En una aplicación real, aquí llamarías a una API para eliminar.
    toast({
      title: "Producto Eliminado (Simulación)",
      description: `El producto "${product.name}" ha sido eliminado.`,
    });
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      // En una aplicación real, se enviaría el formulario a la API.
      toast({
          title: `Producto ${selectedProduct ? 'Actualizado' : 'Creado'} (Simulación)`,
          description: `El producto se ha guardado correctamente.`,
      })
      setIsDialogOpen(false);
  }

  const getCategoryName = (slug: string) => {
      return categories.find(c => c.slug === slug)?.name || 'Sin categoría';
  }

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
      setCurrentPage(1);
  }, [searchQuery, categoryFilter, itemsPerPage]);

  const totalPages = itemsPerPage === 0 ? 1 : Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
      if (itemsPerPage === 0) return filteredProducts;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
            <PageHeader
                title="Gestión de Productos"
                description="Añade, edita y gestiona todos los productos de la tienda."
            />
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2" />
                Añadir Producto
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Catálogo de Productos</CardTitle>
            <CardDescription>
                Lista completa de productos disponibles en la tienda.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nombre..."
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
                  <TableHead className="w-[80px]">Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Destacado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                            data-ai-hint={product.hint}
                        />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{getCategoryName(product.category)}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                        </Badge>
                        </TableCell>
                        <TableCell>
                            {product.featured ? (
                                <Badge variant="secondary">Sí</Badge>
                            ) : (
                                'No'
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(product)}
                            >
                                Eliminar
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                            No se encontraron productos que coincidan con los filtros.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                        <span>Filas por página:</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => setItemsPerPage(Number(value))}
                    >
                        <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="0">Todos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                    <div className="flex items-center gap-4">
                    <span>Página {currentPage} de {totalPages}</span>
                    <div className="flex gap-2">
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                        </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </DialogTitle>
              <DialogDescription>
                Completa la información del producto. Haz clic en guardar para aplicar los cambios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input id="name" defaultValue={selectedProduct?.name} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select defaultValue={selectedProduct?.category}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" type="number" step="0.01" defaultValue={selectedProduct?.price} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" defaultValue={selectedProduct?.stock} required />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="image">URL de la Imagen</Label>
                    <Input id="image" defaultValue={selectedProduct?.image || 'https://placehold.co/300x300.png'} />
                </div>
                 <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="hint">Pista de IA para la imagen</Label>
                    <Input id="hint" defaultValue={selectedProduct?.hint} placeholder="Ej: power tool" />
                </div>
                 <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="featured" defaultChecked={selectedProduct?.featured} />
                    <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                       Marcar como producto destacado
                    </Label>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// src/app/sales/products/page.tsx
"use client";

import { useState, useMemo, useEffect, useTransition } from 'react';
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
import { MoreHorizontal, PlusCircle, Search, ChevronLeft, ChevronRight, Trash2, Power, PowerOff, Sparkles, Plus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { initialProducts, categories, type Product, getProducts, saveProducts } from '@/lib/dummy-data';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { generateProductImageAction, saveProductAction } from './actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

const SVG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='30' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};


export default function ProductsAdminPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, startSavingTransition] = useTransition();
  
  // States for the form inside the dialog
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0);
  const [productHint, setProductHint] = useState('');
  const [productFeatured, setProductFeatured] = useState(false);
  const [productStatus, setProductStatus] = useState(true);
  const [productImage, setProductImage] = useState(SVG_PLACEHOLDER);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [galleryHint, setGalleryHint] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const updateProductsStateAndStorage = (newProducts: Product[]) => {
      setProducts(newProducts);
      saveProducts(newProducts);
  };


  const resetFormState = () => {
    setProductName('');
    setProductDescription('');
    setProductCategory('');
    setProductPrice(0);
    setProductStock(0);
    setProductHint('');
    setProductFeatured(false);
    setProductStatus(true);
    setProductImage(SVG_PLACEHOLDER);
    setGalleryUrls([]);
    setNewGalleryUrl('');
    setGalleryHint('');
  };
  
  const populateFormState = (product: Product) => {
    setProductName(product.name);
    setProductDescription(product.description || '');
    setProductCategory(product.category);
    setProductPrice(product.price);
    setProductStock(product.stock);
    setProductHint(product.hint);
    setProductFeatured(product.featured || false);
    setProductStatus(product.status === 'activo');
    setProductImage(product.image);
    setGalleryUrls(product.gallery || []);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    resetFormState();
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    populateFormState(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (productToDelete: Product) => {
    const updatedProducts = products.filter(p => p.id !== productToDelete.id)
    updateProductsStateAndStorage(updatedProducts);
    toast({
      title: "Producto Eliminado",
      description: `El producto "${productToDelete.name}" ha sido eliminado.`,
    });
  };

  const handleSave = () => {
    if (!productName || !productCategory) {
      toast({
        variant: 'destructive',
        title: 'Campos requeridos',
        description: 'El nombre y la categoría del producto son obligatorios.',
      });
      return;
    }

    const formData = new FormData();
    if(selectedProduct) formData.append('id', selectedProduct.id);
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('category', productCategory);
    formData.append('price', String(productPrice));
    formData.append('stock', String(productStock));
    formData.append('hint', productHint);
    formData.append('featured', String(productFeatured));
    formData.append('status', String(productStatus));
    formData.append('image', productImage);
    formData.append('gallery', JSON.stringify(galleryUrls));

    startSavingTransition(async () => {
      const result = await saveProductAction(formData);

      if (result.success && result.data) {
        const savedProduct = result.data;
        let updatedProducts: Product[];

        if(selectedProduct) { // Editing existing product
            updatedProducts = products.map(p => p.id === savedProduct.id ? savedProduct : p);
        } else { // Adding new product
            updatedProducts = [savedProduct, ...products];
        }

        updateProductsStateAndStorage(updatedProducts);
        
        toast({
          title: `Producto ${selectedProduct ? 'actualizado' : 'creado'}`,
          description: `Los cambios para "${savedProduct.name}" se han guardado correctamente.`,
        });
        setIsDialogOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error al guardar',
          description: result.error || "No se pudo guardar el producto.",
        });
      }
    });
  };


  const handleGenerateImage = (target: 'main' | 'gallery') => {
    const hint = target === 'main' ? productHint : galleryHint;
    
    if (!hint || hint.length < 3) {
      toast({ variant: 'destructive', title: "Pista inválida", description: "La pista de IA debe tener al menos 3 caracteres."});
      return;
    }

    setIsGenerating(true);
    
    const formData = new FormData();
    formData.append("hint", hint);

    generateProductImageAction(formData)
      .then((result) => {
        if (result.success && result.data?.imageUrl) {
            const dataUri = result.data.imageUrl;
            
            if (target === 'main') {
              setProductImage(dataUri);
              toast({ title: "Imagen Principal Generada", description: "La imagen se ha generado. No olvides guardar los cambios." });
            } else {
              setGalleryUrls(prev => [...prev, dataUri]);
              setGalleryHint('');
              toast({ title: "Imagen de Galería Generada", description: "La nueva imagen se ha añadido a la galería. No olvides guardar." });
            }
        } else {
            toast({ variant: 'destructive', title: "Error al generar imagen", description: result.error });
        }
      })
      .catch((error) => {
        console.error("Error en handleGenerateImage:", error);
        toast({ variant: 'destructive', title: "Error inesperado", description: "Ocurrió un error al procesar la imagen." });
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const handleChangeStatus = (productId: string, newStatus: 'activo' | 'inactivo') => {
    let productName = '';
    const updatedProducts = products.map(p => {
        if (p.id === productId) {
            productName = p.name;
            return { ...p, status: newStatus };
        }
        return p;
    });
    updateProductsStateAndStorage(updatedProducts);

    toast({
        title: "Estado del Producto Actualizado",
        description: `El producto "${productName}" ahora está ${newStatus}.`,
    });
  };

  const handleAddGalleryUrl = () => {
      if (newGalleryUrl.trim() && (newGalleryUrl.startsWith('http://') || newGalleryUrl.startsWith('https://'))) {
          setGalleryUrls(prev => [...prev, newGalleryUrl]);
          setNewGalleryUrl('');
      } else {
          toast({
              variant: 'destructive',
              title: 'URL Inválida',
              description: 'Por favor, introduce una URL válida (http:// o https://).'
          })
      }
  }

  const handleRemoveGalleryUrl = (urlToRemove: string) => {
      setGalleryUrls(prev => prev.filter(url => url !== urlToRemove));
  }

  const getCategoryName = (slug: string) => {
      return categories.find(c => c.slug === slug)?.name || 'Sin categoría';
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

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
                  <TableHead>Estado</TableHead>
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
                            src={product.image || SVG_PLACEHOLDER}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                            data-ai-hint={product.hint}
                        />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                           <Badge variant={product.status === 'activo' ? 'default' : 'outline'}>
                                {product.status === 'activo' ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </TableCell>
                        <TableCell>{getCategoryName(product.category)}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                        <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
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
                             {product.status === 'activo' ? (
                                <DropdownMenuItem onClick={() => handleChangeStatus(product.id, 'inactivo')}>
                                    <PowerOff className="mr-2 h-4 w-4" />
                                    Desactivar
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleChangeStatus(product.id, 'activo')}>
                                    <Power className="mr-2 h-4 w-4" />
                                    Activar
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el producto <span className="font-bold">{product.name}</span>.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(product)}>Eliminar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
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
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </DialogTitle>
              <DialogDescription>
                Completa la información del producto. Haz clic en guardar para aplicar los cambios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 max-h-[70vh] overflow-y-auto pr-4">
                {/* Product Info */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Producto</Label>
                                <Input id="name" name="name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Descripción del Producto</Label>
                                <Textarea id="description" name="description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Select name="category" value={productCategory} onValueChange={setProductCategory}>
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
                                    <Input id="price" name="price" type="number" step="0.01" value={productPrice} onChange={(e) => setProductPrice(parseFloat(e.target.value))} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" name="stock" type="number" value={productStock} onChange={(e) => setProductStock(parseInt(e.target.value))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hint">Pista de IA para imagen principal</Label>
                                    <div className="flex gap-2">
                                        <Input id="hint" name="hint" value={productHint} onChange={(e) => setProductHint(e.target.value)} placeholder="Ej: power tool" />
                                        <Button type="button" variant="outline" size="icon" onClick={() => handleGenerateImage('main')} disabled={isGenerating}>
                                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                                <Checkbox id="featured" name="featured" checked={productFeatured} onCheckedChange={(checked) => setProductFeatured(Boolean(checked))} />
                                <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Marcar como producto destacado
                                </Label>
                            </div>
                             <div className="flex items-center space-x-2 pt-4">
                                <Switch id="status" name="status" checked={productStatus} onCheckedChange={setProductStatus} />
                                <Label htmlFor="status">Producto Activo</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Image Management */}
                 <div className="space-y-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Imágenes del Producto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Imagen Principal</Label>
                                <div className="flex items-center gap-2">
                                    <Image src={productImage || SVG_PLACEHOLDER} alt="Preview" width={80} height={80} className="rounded-md object-cover border" />
                                    <Input value={productImage.startsWith('data:') ? 'Nueva imagen generada' : productImage} readOnly className="flex-1" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label>Galería de Imágenes</Label>
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 rounded-md border p-2">
                                    {galleryUrls.map((url, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-muted p-1 rounded-md">
                                            <Image src={url || SVG_PLACEHOLDER} alt={`Gallery image ${index + 1}`} width={40} height={40} className="rounded object-cover" />
                                            <p className="text-xs text-muted-foreground truncate flex-1">{url.startsWith('data:') ? 'Nueva imagen generada' : url}</p>
                                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveGalleryUrl(url)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                    {galleryUrls.length === 0 && <p className="text-sm text-center text-muted-foreground py-2">No hay imágenes en la galería.</p>}
                                </div>
                                <p className="text-xs text-muted-foreground pt-2">Añade imágenes a la galería.</p>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        placeholder="Añadir URL manual" 
                                        value={newGalleryUrl}
                                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                                        className="h-9"
                                    />
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddGalleryUrl}>Añadir</Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        placeholder="Generar con IA..." 
                                        value={galleryHint}
                                        onChange={(e) => setGalleryHint(e.target.value)}
                                        className="h-9"
                                    />
                                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => handleGenerateImage('gallery')} disabled={isGenerating}>
                                         {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 </div>

            </div>
            <DialogFooter className="pt-4 border-t">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar Cambios'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

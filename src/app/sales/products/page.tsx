// src/app/sales/products/page.tsx
"use client";

import { useState, useMemo, useEffect, useTransition, useRef } from 'react';
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
import { MoreHorizontal, PlusCircle, Search, ChevronLeft, ChevronRight, Trash2, Power, PowerOff, Sparkles, Loader2, ImagePlus, Upload, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { categories, type Product, getProducts, saveProducts } from '@/lib/dummy-data';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { generateProductImageAction, generateProductDescriptionAction, generateMissingProductImagesAction, uploadProductImageAction } from './actions';


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
  const [isBulkGenerateDialogOpen, setBulkGenerateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isUploading, startUploadingTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [isGeneratingDesc, startGeneratingDescTransition] = useTransition();
  const [isGeneratingMissing, startGeneratingMissingTransition] = useTransition();
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  
  // States for the form inside the dialog
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0);
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
    setProductFeatured(product.featured || false);
    setProductStatus(product.status === 'activo');
    setProductImage(product.image || SVG_PLACEHOLDER);
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

    startSavingTransition(() => {
        const finalProduct: Product = {
            id: selectedProduct?.id || `prod_${Date.now()}`,
            name: productName,
            description: productDescription,
            category: productCategory,
            price: productPrice,
            stock: productStock,
            hint: productName, // Usar nombre como hint por defecto
            featured: productFeatured,
            status: productStatus ? 'activo' : 'inactivo',
            image: productImage,
            gallery: galleryUrls,
            priceTiers: selectedProduct?.priceTiers // Mantener los tiers si existen
        };

        let updatedProducts: Product[];
        if (selectedProduct) { // Editing
            updatedProducts = products.map(p =>
                p.id === finalProduct.id ? finalProduct : p
            );
        } else { // Creating
            updatedProducts = [finalProduct, ...products];
        }

        updateProductsStateAndStorage(updatedProducts);
        
        toast({
            title: `Producto ${selectedProduct ? 'actualizado' : 'creado'}`,
            description: `Los cambios para "${finalProduct.name}" se han guardado correctamente.`,
        });
        setIsDialogOpen(false);
    });
  };


  const handleGenerateImage = (target: 'main' | 'gallery') => {
    const hint = target === 'main' ? productName : galleryHint;
    
    if (!hint || hint.length < 3) {
      toast({ variant: 'destructive', title: "Pista inválida", description: "El nombre del producto o la pista de IA para la galería debe tener al menos 3 caracteres."});
      return;
    }
    
    const formData = new FormData();
    formData.append("hint", hint);

    startGeneratingTransition(() => {
      generateProductImageAction(formData)
        .then(async (result) => {
          if (result.success && result.data?.imageUrl) {
              const imageUrl = result.data.imageUrl;
              
              if (target === 'main') {
                setProductImage(imageUrl);
                toast({ title: "Imagen Principal Generada", description: "La imagen se ha generado. No olvides guardar." });
              } else {
                setGalleryUrls(prev => [...prev, imageUrl]);
                setGalleryHint('');
                toast({ title: "Imagen de Galería Generada", description: "La nueva imagen se ha añadido. No olvides guardar." });
              }
          } else {
              toast({ variant: 'destructive', title: "Error al generar imagen", description: result.error || "Ocurrió un error desconocido." });
          }
        })
        .catch((error) => {
          console.error("Error en handleGenerateImage:", error);
          toast({ variant: 'destructive', title: "Error inesperado", description: "Ocurrió un error al procesar la imagen." });
        });
    });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery') => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      
      startUploadingTransition(() => {
        uploadProductImageAction(formData)
        .then(result => {
             if (result.success && result.data?.imageUrl) {
                if (target === 'main') {
                    setProductImage(result.data.imageUrl);
                    toast({ title: "Imagen Principal Subida", description: "No olvides guardar los cambios." });
                } else {
                    setGalleryUrls(prev => [...prev, result.data!.imageUrl]);
                    toast({ title: "Imagen de Galería Subida", description: "No olvides guardar los cambios." });
                }
            } else {
                 toast({ variant: 'destructive', title: "Error al subir imagen", description: result.error || "Ocurrió un error." });
            }
        })
        .catch(error => {
            console.error("Error en handleFileUpload:", error);
            toast({ variant: 'destructive', title: "Error inesperado", description: "Ocurrió un error al subir la imagen." });
        });
      });
      // Reset file input
      event.target.value = '';
  }

  const handleGenerateMissingImages = (mode: 'missing' | 'all') => {
      setBulkGenerateDialogOpen(false);
      startGeneratingMissingTransition(() => {
        generateMissingProductImagesAction({products, mode}).then(result => {
            if (result.success && result.data) {
                updateProductsStateAndStorage(result.data);
                toast({
                    title: "Imágenes Generadas",
                    description: `Se generaron y actualizaron ${result.generatedCount} imágenes.`
                });
            } else {
                 toast({ variant: 'destructive', title: "Error al generar imágenes", description: result.error || "Ocurrió un error." });
            }
        });
      });
  }

  const handleGenerateDescription = () => {
      if (!productName || !productCategory) {
          toast({
              variant: 'destructive',
              title: "Datos insuficientes",
              description: "El nombre y la categoría son necesarios para generar una descripción.",
          });
          return;
      }
      
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("category", getCategoryName(productCategory));

      startGeneratingDescTransition(() => {
          generateProductDescriptionAction(formData)
              .then((result) => {
                  if (result.success && result.data?.description) {
                      setProductDescription(result.data.description);
                      toast({
                          title: "Descripción Generada",
                          description: "La descripción se ha autocompletado.",
                      });
                  } else {
                      toast({ variant: 'destructive', title: "Error al generar descripción", description: result.error || "Ocurrió un error." });
                  }
              })
              .catch((error) => {
                  console.error("Error en handleGenerateDescription:", error);
                  toast({ variant: 'destructive', title: "Error inesperado", description: "Ocurrió un error al generar la descripción." });
              });
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

  const productsWithoutImage = useMemo(() => {
      return products.filter(p => !p.image || p.image.includes('placehold.co')).length;
  }, [products]);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
            <PageHeader
                title="Gestión de Productos"
                description="Añade, edita y gestiona todos los productos de la tienda."
            />
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setBulkGenerateDialogOpen(true)} disabled={isGeneratingMissing}>
                     {isGeneratingMissing ? <Loader2 className="mr-2 animate-spin" /> : <ImagePlus className="mr-2" />}
                    Generar Imágenes
                </Button>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2" />
                    Añadir Producto
                </Button>
            </div>
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
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoría</TableHead>
                  <TableHead className="hidden md:table-cell">Precio</TableHead>
                  <TableHead className="hidden lg:table-cell">Stock</TableHead>
                  <TableHead className="hidden lg:table-cell">Destacado</TableHead>
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
                            className="rounded-md object-contain"
                            data-ai-hint={product.name}
                        />
                        </TableCell>
                        <TableCell className="font-medium">
                            {product.name}
                            <div className="text-muted-foreground text-sm md:hidden">
                                {formatCurrency(product.price)} - <Badge variant={product.status === 'activo' ? 'default' : 'outline'}>{product.status === 'activo' ? 'Activo' : 'Inactivo'}</Badge>
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                           <Badge variant={product.status === 'activo' ? 'default' : 'outline'}>
                                {product.status === 'activo' ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{getCategoryName(product.category)}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(product.price)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                        <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
                            {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                        </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
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

      <Dialog open={isBulkGenerateDialogOpen} onOpenChange={setBulkGenerateDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Generación Masiva de Imágenes</DialogTitle>
                <DialogDescription>
                    Selecciona cómo quieres generar las imágenes para los productos.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 flex flex-col md:flex-row gap-4">
                 <Button variant="outline" className="w-full justify-start h-auto py-3" onClick={() => handleGenerateMissingImages('missing')}>
                    <div className="flex items-start gap-4 text-left">
                        <ImagePlus className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Generar sólo faltantes ({productsWithoutImage})</p>
                            <p className="text-sm text-muted-foreground">La IA creará imágenes para productos sin imagen real.</p>
                        </div>
                    </div>
                </Button>
                 <Button variant="destructive" className="w-full justify-start h-auto py-3" onClick={() => handleGenerateMissingImages('all')}>
                     <div className="flex items-start gap-4 text-left">
                        <AlertTriangle className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Regenerar TODAS ({products.length})</p>
                            <p className="text-sm text-destructive-foreground/80">
                                Se reemplazarán todas las imágenes. Esta acción es intensiva.
                            </p>
                        </div>
                    </div>
                </Button>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancelar</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>

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
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="description">Descripción del Producto</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGeneratingDesc || !productName || !productCategory}>
                                        {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Generar
                                    </Button>
                                </div>
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
                                    <Input value={productImage === SVG_PLACEHOLDER ? 'Marcador de posición' : 'Imagen generada o URL'} readOnly className="flex-1" />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => handleGenerateImage('main')} disabled={isGenerating || isUploading}>
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Generar con IA
                                    </Button>
                                    <input type="file" ref={mainImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'main')}/>
                                    <Button type="button" variant="outline" size="sm" onClick={() => mainImageInputRef.current?.click()} disabled={isUploading || isGenerating}>
                                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                        Subir
                                    </Button>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label>Galería de Imágenes</Label>
                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 rounded-md border p-2">
                                    {galleryUrls.map((url, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-muted p-1 rounded-md">
                                            <Image src={url || SVG_PLACEHOLDER} alt={`Gallery image ${index + 1}`} width={40} height={40} className="rounded object-cover" />
                                            <p className="text-xs text-muted-foreground truncate flex-1">{url.startsWith('data:') || url.includes('storage.googleapis.com') ? 'Imagen generada/subida' : url}</p>
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
                                        placeholder="Generar con IA (pista)..." 
                                        value={galleryHint}
                                        onChange={(e) => setGalleryHint(e.target.value)}
                                        className="h-9"
                                    />
                                    <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => handleGenerateImage('gallery')} disabled={isGenerating || isUploading}>
                                         {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                     <input type="file" ref={galleryImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')}/>
                                     <Button type="button" variant="outline" size="icon" className="h-9 w-9" onClick={() => galleryImageInputRef.current?.click()} disabled={isUploading || isGenerating}>
                                         {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
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
                <Button onClick={handleSave} disabled={isSaving || isGenerating || isUploading}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar Cambios'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

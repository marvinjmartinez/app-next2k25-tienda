// src/app/products/page.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Search, LogOut } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { products, categories, type Product } from '@/lib/dummy-data';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { ImageViewerDialog } from '@/components/image-viewer-dialog';
import { Logo } from '@/components/logo';


function ProductsPageComponent() {
  const { addToCart, getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerProductName, setViewerProductName] = useState('');

  const handleOpenImageViewer = (product: Product) => {
    setViewerImages([product.image, ...(product.gallery || [])]);
    setViewerProductName(product.name);
    setIsViewerOpen(true);
  };

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);
  
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, pathname]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast({
      title: "Producto agregado",
      description: `${product.name} se ha añadido a tu carrito.`,
    });
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch.trim()) {
      params.set('search', localSearch.trim());
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredProducts = products.filter(p => {
    const isActive = p.status === 'activo';
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return isActive && matchesCategory && matchesSearch;
  });

  const getCategoryName = (slug: string) => {
    return categories.find(c => c.slug === slug)?.name || 'Sin categoría';
  }

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
            <span className="font-bold text-xl font-headline text-foreground sr-only">Distrimin SAS</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Inicio</Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Productos</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">Nosotros</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-1 text-xs bg-accent text-accent-foreground">{getCartItemCount()}</Badge>
                )}
                <span className="sr-only">Carrito</span>
              </Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://placehold.co/40x40.png" alt={user.name} data-ai-hint="person portrait" />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   {user.role === 'admin' && (
                     <DropdownMenuItem onClick={() => router.push('/sales/create-quote')}>
                        <Logo className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Link href="/login">
                    <Button>
                        <User className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                    </Button>
                </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-headline">
              {searchQuery ? `Resultados para "${searchQuery}"` : "Todos Nuestros Productos"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {searchQuery ? `Encontramos ${filteredProducts.length} productos` : "Explora el catálogo completo de Distrimin SAS."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-10">
              <form onSubmit={handleSearch} className="relative w-full">
                  <Input 
                      name="search" 
                      type="search" 
                      placeholder="Buscar producto..." 
                      className="w-full h-10 pr-10"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                  />
                  <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8 bg-accent hover:bg-accent/90">
                      <Search className="h-4 w-4"/>
                  </Button>
              </form>
              <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)} value={selectedCategory || 'all'}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                      <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                          <SelectItem key={category.slug} value={category.slug}>
                              {category.name}
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                 <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={getCategoryName(product.category)}
                  onAddToCart={handleAddToCart}
                  onImageClick={handleOpenImageViewer}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron productos que coincidan con tus filtros.</p>
              <Button variant="link" className="mt-4" onClick={() => { setLocalSearch(''); setSelectedCategory(null); router.push(pathname)}}>
                  Limpiar filtros y ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-foreground text-background">
        <div className="container mx-auto py-8 px-4 md:px-6">
            <p className="text-center text-sm text-muted-foreground">© 2024 Distrimin SAS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
    <ImageViewerDialog
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        images={viewerImages}
        productName={viewerProductName}
    />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ProductsPageComponent />
    </Suspense>
  );
}

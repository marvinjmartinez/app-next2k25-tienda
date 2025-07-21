// This component is now a client component to use the cart context
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categories, type Product, getProducts } from '@/lib/dummy-data';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product-card';
import { ImageViewerDialog } from '@/components/image-viewer-dialog';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useCart } from '@/context/cart-context';

export default function HomePage() {
  const { addToCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerProductName, setViewerProductName] = useState('');

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const featuredProducts = products.filter(p => p.featured && p.status === 'activo');

  const handleOpenImageViewer = (product: Product) => {
    setViewerImages([product.image, ...(product.gallery || [])]);
    setViewerProductName(product.name);
    setIsViewerOpen(true);
  };

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
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getCategoryName = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.name : 'Sin categoría';
  }

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section 
          className="relative h-[40vh] flex items-center justify-center text-center text-white bg-no-repeat bg-cover bg-center" 
          style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}}
          data-ai-hint="hardware store background">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Tu proyecto empieza aquí</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">Encuentra todo lo que necesitas, desde un tornillo hasta maquinaria pesada.</p>
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <Input name="search" type="search" placeholder="Buscar producto..." className="w-full h-12 pr-12 text-black" />
                    <Button type="submit" size="icon" className="absolute right-1 top-1 h-10 w-10 bg-accent hover:bg-accent/90">
                        <Search className="h-5 w-5"/>
                    </Button>
                </form>
            </div>
        </section>

        <section className="py-10 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Categorías Populares</h2>
             <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">Explora nuestras categorías más buscadas y encuentra lo que necesitas para empezar.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                    <Card className="text-center hover:shadow-lg transition-shadow h-full">
                        <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                            <div className="p-4 bg-primary/10 rounded-full text-primary">{category.icon}</div>
                            <p className="font-semibold">{category.name}</p>
                        </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>


        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Productos Destacados</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">Los favoritos de nuestros clientes, seleccionados por su calidad y precio.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={getCategoryName(product.category)}
                  onAddToCart={handleAddToCart}
                  onImageClick={handleOpenImageViewer}
                  priority={index < 4} // Prioritize first 4 featured products
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
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

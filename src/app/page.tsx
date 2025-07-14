// This component is now a client component to use the cart context
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '@/context/cart-context'; 
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { categories, type Product, initialProducts, getProducts } from '@/lib/dummy-data';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/product-card';
import { ImageViewerDialog } from '@/components/image-viewer-dialog';
import { LogoTienda } from '@/components/logo-tienda';

const PRODUCTS_STORAGE_KEY = 'crud_products';

export default function HomePage() {
  const { addToCart, getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

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

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === 'admin' || user.role === 'vendedor') {
      return "/sales/create-quote";
    }
    return "/account/dashboard";
  }

  const getCategoryName = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.name : 'Sin categoría';
  }

  return (
    <>
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoTienda width={40} height={40} className="h-10 w-auto" />
            <span className="font-bold text-xl font-headline text-foreground">Distrimin SAS</span>
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
                  <DropdownMenuItem onClick={() => router.push(getDashboardPath())}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Mi Panel</span>
                  </DropdownMenuItem>
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
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={getCategoryName(product.category)}
                  onAddToCart={handleAddToCart}
                  onImageClick={handleOpenImageViewer}
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-foreground text-background">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Distrimin SAS</h3>
              <p className="text-sm text-muted-foreground">© 2024. Todos los derechos reservados.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Navegación</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/products" className="hover:text-primary">Productos</Link></li>
                <li><Link href="/about" className="hover:text-primary">Nosotros</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Soporte</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="#" className="hover:text-primary">Preguntas Frecuentes</Link></li>
                <li><Link href="#" className="hover:text-primary">Política de Devoluciones</Link></li>
                <li><Link href="#" className="hover:text-primary">Términos de Servicio</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Subscríbete</h3>
              <p className="text-sm mb-2 text-muted-foreground">Recibe ofertas especiales y noticias.</p>
              <form onSubmit={(e) => { e.preventDefault(); toast({title: "¡Gracias por subscribirte!"}) }}>
                <div className="flex">
                    <Input type="email" required placeholder="tu@email.com" className="bg-background/20 border-0 rounded-r-none text-white placeholder:text-muted-foreground/80" />
                    <Button type="submit" className="rounded-l-none bg-accent hover:bg-accent/90">Enviar</Button>
                </div>
              </form>
            </div>
          </div>
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

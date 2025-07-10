import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Wrench, User, Search, HardHat, Paintbrush, Drill } from 'lucide-react';
import Image from 'next/image';

const featuredProducts = [
  {
    name: "Taladro Percutor Inalámbrico",
    price: "$1,899.00",
    image: "https://placehold.co/300x300.png",
    hint: "power tool"
  },
  {
    name: "Juego de Destornilladores 25 pzs",
    price: "$499.00",
    image: "https://placehold.co/300x300.png",
    hint: "hand tools"
  },
  {
    name: "Pintura Vinílica Blanca 19L",
    price: "$1,250.00",
    image: "https://placehold.co/300x300.png",
    hint: "paint can"
  },
  {
    name: "Escalera de Tijera de Aluminio",
    price: "$980.00",
    image: "https://placehold.co/300x300.png",
    hint: "ladder"
  },
];

const categories = [
    { name: "Herramientas", icon: <Drill className="h-8 w-8" /> },
    { name: "Construcción", icon: <HardHat className="h-8 w-8" /> },
    { name: "Pintura", icon: <Paintbrush className="h-8 w-8" /> },
    { name: "Plomería", icon: <Wrench className="h-8 w-8" /> },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl font-headline text-foreground">El Martillo de Oro</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Productos</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Nosotros</Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Contacto</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrito</span>
            </Button>
            <Link href="/sales/create-quote">
                <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-no-repeat bg-cover bg-center" style={{backgroundImage: "url('https://placehold.co/1920x1080.png')"}}>
            <div className="absolute inset-0 bg-black/50" data-ai-hint="construction hardware store"></div>
            <div className="relative container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Tu proyecto empieza aquí</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">Encuentra todo lo que necesitas, desde un tornillo hasta maquinaria pesada.</p>
                <div className="relative max-w-xl mx-auto">
                    <Input type="search" placeholder="Buscar producto..." className="w-full h-12 pr-12 text-black" />
                    <Button size="icon" className="absolute right-1 top-1 h-10 w-10">
                        <Search className="h-5 w-5"/>
                    </Button>
                </div>
            </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Categorías Populares</h2>
             <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">Explora nuestras categorías más buscadas y encuentra lo que necesitas para empezar.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card key={category.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">{category.icon}</div>
                    <p className="font-semibold">{category.name}</p>
                  </CardContent>
                </Card>
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
                <Card key={product.name} className="overflow-hidden group">
                  <CardHeader className="p-0">
                    <Image src={product.image} alt={product.name} width={300} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" data-ai-hint={product.hint} />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg h-12">{product.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold text-lg mt-2">{product.price}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Agregar al carrito
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-foreground text-background">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">El Martillo de Oro</h3>
              <p className="text-sm text-muted-foreground">© 2024. Todos los derechos reservados.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Navegación</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="#" className="hover:text-primary">Productos</Link></li>
                <li><Link href="#" className="hover:text-primary">Nosotros</Link></li>
                <li><Link href="#" className="hover:text-primary">Contacto</Link></li>
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
              <div className="flex">
                  <Input type="email" placeholder="tu@email.com" className="bg-background/20 border-0 rounded-r-none text-white placeholder:text-muted-foreground/80" />
                  <Button type="submit" className="rounded-l-none">Enviar</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// src/components/site-footer.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

function NewsletterForm() {
    const { toast } = useToast();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({ title: "¡Gracias por subscribirte!" });
        (e.target as HTMLFormElement).reset();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex">
                <Input type="email" required placeholder="tu@email.com" className="bg-background/20 border-0 rounded-r-none text-white placeholder:text-muted-foreground/80" />
                <Button type="submit" className="rounded-l-none bg-accent hover:bg-accent/90">Enviar</Button>
            </div>
        </form>
    );
}

export function SiteFooter() {
    return (
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
                        <NewsletterForm />
                    </div>
                </div>
            </div>
        </footer>
    );
}

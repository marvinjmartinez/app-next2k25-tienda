// src/app/contact/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // En una aplicación real, aquí se enviaría el formulario a un backend.
      toast({
          title: "Mensaje Enviado",
          description: "Gracias por contactarnos. Te responderemos a la brevedad."
      });
      (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Ponte en Contacto</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">¿Tienes alguna pregunta o necesitas una cotización? Estamos aquí para ayudarte.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card>
                <CardContent className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" type="text" placeholder="Tu nombre completo" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" type="email" placeholder="tu@email.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Input id="subject" type="text" placeholder="Ej: Cotización de materiales" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Mensaje</Label>
                            <Textarea id="message" placeholder="Escribe tu mensaje aquí..." rows={5} required />
                        </div>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Enviar Mensaje</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                  <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
                  <div className="space-y-4">
                      <div className="flex items-start gap-4">
                          <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <p className="text-muted-foreground">Av. de los Constructores 123, Colonia Industrial, C.P. 54321, Ciudad Ejemplo, México</p>
                      </div>
                      <div className="flex items-center gap-4">
                          <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                          <p className="text-muted-foreground">+52 (55) 1234 5678</p>
                      </div>
                      <div className="flex items-center gap-4">
                          <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                          <p className="text-muted-foreground">contacto@distriminsas.com</p>
                      </div>
                  </div>
              </div>
              <div>
                  <h3 className="text-xl font-bold mb-4">Horario de Atención</h3>
                  <p className="text-muted-foreground">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Sábados: 9:00 AM - 2:00 PM</p>
                  <p className="text-muted-foreground">Domingos: Cerrado</p>
              </div>
              <div className="aspect-video">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.59384934444!2d-99.13539578559983!3d19.43260778688179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f93f1a600c8b%3A0x83f06b120c1511a!2sPalacio%20de%20Bellas%20Artes!5e0!3m2!1ses-419!2smx!4v1684443318285!5m2!1ses-419!2smx" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

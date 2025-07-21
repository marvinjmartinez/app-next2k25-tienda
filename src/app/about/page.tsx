// src/app/about/page.tsx
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Nuestra Historia</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Más de 50 años construyendo sueños, un tornillo a la vez.</p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4">De un pequeño local a tu ferretería de confianza</h2>
              <p className="text-muted-foreground mb-4">
                "Distrimin SAS" nació en 1974 como un pequeño negocio familiar con una misión clara: proveer a nuestra comunidad con las mejores herramientas y un servicio inigualable. Lo que empezó con un mostrador y mucha pasión, hoy es el referente en materiales de construcción y ferretería en la región.
              </p>
              <p className="text-muted-foreground">
                A través de los años, hemos crecido junto a nuestros clientes, adaptándonos a las nuevas tecnologías pero sin perder el trato cercano que nos caracteriza. Cada proyecto de nuestros clientes es también un proyecto nuestro.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Image src="https://placehold.co/600x400.png" data-ai-hint="vintage hardware store" alt="Tienda antigua de Distrimin SAS" width={600} height={400} className="rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold">Nuestros Valores</h2>
                     <p className="mt-2 text-muted-foreground">Los pilares que nos sostienen</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Calidad</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Solo ofrecemos productos que cumplen con los más altos estándares. Si no lo usaríamos nosotros, no lo vendemos.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Servicio</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Nuestro equipo no solo despacha, asesora. Estamos aquí para ayudarte a encontrar la solución perfecta para tu proyecto.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Confianza</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Construimos relaciones duraderas basadas en la honestidad y el compromiso con nuestros clientes y proveedores.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

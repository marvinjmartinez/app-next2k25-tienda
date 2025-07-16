// src/app/sales/pos/page.tsx
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function PosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Punto de Venta (POS)"
        description="Realiza ventas rápidas y gestiona transacciones en tiempo real."
      />
      <Card>
        <CardContent className="p-10 text-center">
            <div className="flex flex-col items-center gap-4">
                <Construction className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Módulo en Construcción</h2>
                <p className="text-muted-foreground max-w-md">
                    El módulo de Punto de Venta está en desarrollo. Próximamente podrás gestionar tus ventas directamente desde aquí.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

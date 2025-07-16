// src/app/sales/pos/layout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    router.push(`/sales/pos${value}`);
  };

  const getCurrentTab = () => {
    if (pathname.endsWith("/history")) return "/history";
    if (pathname.endsWith("/closing")) return "/closing";
    if (pathname.endsWith("/reports")) return "/reports";
    return ""; // Default tab for /sales/pos
  };

  return (
    <div className="space-y-6">
       <PageHeader title="Punto de Venta" description="Realiza ventas rápidas, consulta el historial y gestiona la caja." />
        <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
            <TabsList>
                <TabsTrigger value="">Caja</TabsTrigger>
                <TabsTrigger value="/history">Historial</TabsTrigger>
                <TabsTrigger value="/closing">Cuadre de Caja</TabsTrigger>
                <TabsTrigger value="/reports">Informes</TabsTrigger>
            </TabsList>
        </Tabs>
        <div className="mt-6">{children}</div>
    </div>
  );
}

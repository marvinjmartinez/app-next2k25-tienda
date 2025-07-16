// src/app/sales/pos/reports/page.tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PosReportsPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Informes de Ventas</CardTitle>
                    <CardDescription>
                        Esta sección está en construcción. Aquí podrás ver informes detallados de las ventas del POS.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Próximamente...</p>
                </CardContent>
            </Card>
        </div>
    );
}

// src/app/sales/pos/closing/page.tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PosClosingPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Cuadre de Caja</CardTitle>
                    <CardDescription>
                        Esta sección está en construcción. Aquí podrás realizar el cierre y cuadre de la caja del día.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Próximamente...</p>
                </CardContent>
            </Card>
        </div>
    );
}

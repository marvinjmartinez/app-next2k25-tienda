import { PageHeader } from '@/components/page-header';
import { AiProductSuggester } from '@/components/ai-product-suggester';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CreateQuotePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Crear Nueva Cotización"
        description="Usa el asistente de IA para obtener sugerencias de productos basadas en las necesidades de tu cliente."
      />
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Cotización</CardTitle>
                    <CardDescription>Ingresa la información del cliente y agrega productos a la cotización.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Los elementos del formulario de cotización estarán aquí...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div>
            <AiProductSuggester />
        </div>
      </div>
    </div>
  );
}

// src/app/sales/quotes/page.tsx
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Cotizaciones"
        description="Aquí podrás ver, crear y gestionar todas las cotizaciones."
      />
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones Recientes</CardTitle>
          <CardDescription>
            Esta funcionalidad está en desarrollo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              Las cotizaciones generadas aparecerán aquí.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

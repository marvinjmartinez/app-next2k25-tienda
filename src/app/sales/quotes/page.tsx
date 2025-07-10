// src/app/sales/quotes/page.tsx
"use client";

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Send } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const dummyQuotes = [
  {
    id: 'COT-001',
    customerName: 'Constructora Roble',
    date: '2024-07-08',
    total: 15890.50,
    status: 'Pagada',
  },
  {
    id: 'COT-002',
    customerName: 'Ana García',
    date: '2024-07-10',
    total: 3250.00,
    status: 'Borrador',
  },
  {
    id: 'COT-003',
    customerName: 'Proyectos Urbanos S.A.',
    date: '2024-07-11',
    total: 78500.00,
    status: 'Enviada',
  },
   {
    id: 'COT-004',
    customerName: 'Carlos Mendoza',
    date: '2024-07-12',
    total: 890.00,
    status: 'Borrador',
  },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};
  
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const statusBadges: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    Pagada: 'default',
    Enviada: 'secondary',
    Borrador: 'outline',
    Cancelada: 'destructive',
}

export default function QuotesPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSendToCart = (quoteId: string) => {
        // En una app real, cargarías los productos de la cotización y los añadirías al carrito.
        toast({
            title: 'Cotización Enviada al Carrito (Simulación)',
            description: `Los productos de la cotización ${quoteId} han sido añadidos al carrito.`,
        });
        router.push('/cart');
    }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Cotizaciones"
        description="Visualiza, edita y da seguimiento a todas las cotizaciones generadas."
      />
      <Card>
        <CardHeader>
          <CardTitle>Cotizaciones Recientes</CardTitle>
          <CardDescription>
            Lista de las cotizaciones más recientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead># Cotización</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.customerName}</TableCell>
                  <TableCell>{formatDate(quote.date)}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadges[quote.status] || 'outline'}>
                        {quote.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(quote.total)}</TableCell>
                  <TableCell className="text-right">
                    {quote.status !== 'Pagada' && (
                       <Button variant="outline" size="sm" onClick={() => handleSendToCart(quote.id)}>
                            <Send className="mr-2 h-3 w-3" />
                            Enviar a Carrito
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

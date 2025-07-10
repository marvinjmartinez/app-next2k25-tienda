// src/app/sales/customers/page.tsx

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
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const dummyCustomers = [
  {
    id: '1',
    name: 'Constructora Roble',
    email: 'compras@constructoraroble.com',
    type: 'Cliente Especial',
    since: '2021-08-15',
    totalSpent: 150000,
  },
  {
    id: '2',
    name: 'Ana García',
    email: 'ana.garcia.pro@email.com',
    type: 'Vendedor',
    since: '2023-01-20',
    totalSpent: 75000,
  },
  {
    id: '3',
    name: 'Carlos Mendoza',
    email: 'carlos.m@email.com',
    type: 'Cliente',
    since: '2024-03-10',
    totalSpent: 5200,
  },
   {
    id: '4',
    name: 'Proyectos Urbanos S.A.',
    email: 'proyectos@urbanos.com',
    type: 'Cliente Especial',
    since: '2020-05-30',
    totalSpent: 320500,
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


export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Clientes"
        description="Visualiza y administra tus clientes y vendedores."
      />
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Aquí puedes ver a todos los usuarios registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo de Cliente</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
                <TableHead>Cliente Desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.type === 'Cliente Especial' ? 'default' : 'secondary'}>
                        {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{formatDate(customer.since)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Ver Pedidos</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

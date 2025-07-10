// src/app/sales/customers/page.tsx
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
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

const dummyUsers = [
  {
    id: '1',
    name: 'Constructora Roble',
    email: 'compras@constructoraroble.com',
    role: 'cliente_especial',
    since: '2021-08-15',
    totalSpent: 150000,
  },
  {
    id: '2',
    name: 'Ana García',
    email: 'ana.garcia.pro@email.com',
    role: 'vendedor',
    since: '2023-01-20',
    totalSpent: 75000,
  },
  {
    id: '3',
    name: 'Carlos Mendoza',
    email: 'carlos.m@email.com',
    role: 'cliente',
    since: '2024-03-10',
    totalSpent: 5200,
  },
   {
    id: '4',
    name: 'Proyectos Urbanos S.A.',
    email: 'proyectos@urbanos.com',
    role: 'cliente_especial',
    since: '2020-05-30',
    totalSpent: 320500,
  },
  {
    id: '5',
    name: 'Nuevo Usuario',
    email: 'nuevo@email.com',
    role: 'cliente',
    since: '2024-07-15',
    totalSpent: 0,
  }
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

const roleBadges: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    admin: 'destructive',
    vendedor: 'default',
    cliente_especial: 'secondary',
    cliente: 'outline',
}

const roleNames: { [key: string]: string } = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    cliente_especial: 'Cliente Especial',
    cliente: 'Cliente',
}

export default function CustomersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const isAdmin = user?.role === 'admin';

    const handleChangeRole = (userName: string, newRole: string) => {
        // En una aplicación real, aquí llamarías a una API para actualizar el rol.
        toast({
            title: "Rol Actualizado (Simulación)",
            description: `El rol de ${userName} ha sido cambiado a ${roleNames[newRole]}.`,
        })
    }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Registrados"
        description="Visualiza y administra todos los usuarios registrados en el sistema."
      />
      <Card>
        <CardHeader>
          <CardTitle>Lista de Registrados</CardTitle>
          <CardDescription>
            Usuarios registrados en la plataforma. Solo los administradores pueden cambiar roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
                <TableHead>Registrado Desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyUsers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleBadges[customer.role] || 'outline'}>
                        {roleNames[customer.role] || customer.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell>{formatDate(customer.since)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={!isAdmin}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                        {isAdmin && (
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Cambiar Rol</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'cliente')}>Cliente</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'cliente_especial')}>Cliente Especial</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'vendedor')}>Vendedor</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'admin')}>Administrador</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        )}
                        <DropdownMenuItem className="text-destructive">Eliminar Usuario</DropdownMenuItem>
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

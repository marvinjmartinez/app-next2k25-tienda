// src/app/sales/customers/page.tsx
"use client";

import { useState } from 'react';
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
import { MoreHorizontal, Search, PlusCircle, UserCheck, UserX } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserStatus = 'activo' | 'inactivo';

const dummyUsers = [
  {
    id: '1',
    name: 'Constructora Roble',
    email: 'compras@constructoraroble.com',
    role: 'cliente_especial',
    since: '2021-08-15',
    totalSpent: 150000,
    status: 'activo' as UserStatus,
  },
  {
    id: '2',
    name: 'Ana García',
    email: 'ana.garcia.pro@email.com',
    role: 'vendedor',
    since: '2023-01-20',
    totalSpent: 75000,
    status: 'activo' as UserStatus,
  },
  {
    id: '3',
    name: 'Carlos Mendoza',
    email: 'carlos.m@email.com',
    role: 'cliente',
    since: '2024-03-10',
    totalSpent: 5200,
    status: 'inactivo' as UserStatus,
  },
   {
    id: '4',
    name: 'Proyectos Urbanos S.A.',
    email: 'proyectos@urbanos.com',
    role: 'cliente_especial',
    since: '2020-05-30',
    totalSpent: 320500,
    status: 'activo' as UserStatus,
  },
  {
    id: '5',
    name: 'Nuevo Usuario',
    email: 'nuevo@email.com',
    role: 'cliente',
    since: '2024-07-15',
    totalSpent: 0,
    status: 'activo' as UserStatus,
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false);

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Usuario Creado (Simulación)",
            description: "El nuevo usuario ha sido agregado al sistema.",
        });
        setCreateUserDialogOpen(false);
    }
    
    const handleChangeRole = (userName: string, newRole: string) => {
        toast({
            title: "Rol Actualizado (Simulación)",
            description: `El rol de ${userName} ha sido cambiado a ${roleNames[newRole]}.`,
        })
    }
    
    const handleChangeStatus = (userName: string, newStatus: UserStatus) => {
        toast({
            title: "Estado Actualizado (Simulación)",
            description: `El estado de ${userName} ha sido cambiado a ${newStatus}.`,
        })
    }

    const handleViewProfile = (customerName: string) => {
        toast({
            title: "Función no implementada",
            description: `Aquí se mostraría el perfil de ${customerName}.`,
        });
    };

    const filteredUsers = dummyUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
    <>
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <PageHeader
                    title="Gestión de Registrados"
                    description="Visualiza y administra todos los usuarios registrados en el sistema."
                />
                 {isAdmin && (
                    <Button onClick={() => setCreateUserDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Usuario
                    </Button>
                )}
            </div>
            <Card>
                <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Lista de Registrados</CardTitle>
                        <CardDescription>
                            Usuarios registrados en la plataforma. Solo los administradores pueden cambiar roles.
                        </CardDescription>
                    </div>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre o email..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Registrado Desde</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredUsers.map((customer) => (
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
                        <TableCell>
                            <Badge variant={customer.status === 'activo' ? 'default' : 'destructive'}>
                                {customer.status === 'activo' ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </TableCell>
                        <TableCell>{formatDate(customer.since)}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewProfile(customer.name)}>Ver Perfil</DropdownMenuItem>
                                {isAdmin && (
                                    <>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Cambiar Rol</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'cliente')}>Cliente</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'cliente_especial')}>Cliente Especial</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'vendedor')}>Vendedor</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.name, 'admin')}>Administrador</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>

                                        <DropdownMenuSeparator />
                                        
                                        {customer.status === 'activo' ? (
                                            <DropdownMenuItem onClick={() => handleChangeStatus(customer.name, 'inactivo')}>
                                                <UserX className="mr-2 h-4 w-4" />
                                                Desactivar
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem onClick={() => handleChangeStatus(customer.name, 'activo')}>
                                                <UserCheck className="mr-2 h-4 w-4" />
                                                Activar
                                            </DropdownMenuItem>
                                        )}
                                    
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Eliminar Usuario</DropdownMenuItem>
                                    </>
                                )}
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

        <Dialog open={isCreateUserDialogOpen} onOpenChange={setCreateUserDialogOpen}>
            <DialogContent className="sm:max-w-md">
                 <form onSubmit={handleCreateUser}>
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                            Completa los datos para registrar un nuevo usuario en el sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" placeholder="Ej: Juan Pérez" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" type="email" placeholder="ejemplo@email.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">Contraseña Temporal</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol del Usuario</Label>
                            <Select required>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cliente">Cliente</SelectItem>
                                    <SelectItem value="cliente_especial">Cliente Especial</SelectItem>
                                    <SelectItem value="vendedor">Vendedor</SelectItem>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Crear Usuario</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </>
    );
}
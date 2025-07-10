// src/app/sales/customers/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { MoreHorizontal, Search, PlusCircle, UserCheck, UserX, Trash2 } from 'lucide-react';
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
import usersData from '@/data/users.json';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


type UserRole = 'admin' | 'vendedor' | 'cliente_especial' | 'cliente';
type UserStatus = 'activo' | 'inactivo';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  since: string;
  status: UserStatus;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const roleBadges: { [key in UserRole]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    admin: 'destructive',
    vendedor: 'default',
    cliente_especial: 'secondary',
    cliente: 'outline',
}

const roleNames: { [key in UserRole]: string } = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    cliente_especial: 'Cliente Especial',
    cliente: 'Cliente',
}

export default function CustomersPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const isAdmin = user?.role === 'admin';

    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false);
    const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        setUsers(usersData as User[]);
    }, []);

    const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as UserRole,
            since: new Date().toISOString().split('T')[0],
            status: 'activo',
        };

        setUsers(prev => [newUser, ...prev]);

        toast({
            title: "Usuario Creado",
            description: `El usuario ${newUser.name} ha sido agregado al sistema.`,
        });
        setCreateUserDialogOpen(false);
        e.currentTarget.reset();
    }
    
    const handleChangeRole = (userId: string, newRole: UserRole) => {
        let userName = '';
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                userName = u.name;
                return {...u, role: newRole};
            }
            return u;
        }));
        toast({
            title: "Rol Actualizado",
            description: `El rol de ${userName} ha sido cambiado a ${roleNames[newRole]}.`,
        })
    }
    
    const handleChangeStatus = (userId: string, newStatus: UserStatus) => {
        let userName = '';
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                userName = u.name;
                return {...u, status: newStatus};
            }
            return u;
        }));

        toast({
            title: "Estado Actualizado",
            description: `El estado de ${userName} ha sido cambiado a ${newStatus}.`,
        })
    }

    const handleDeleteUser = (userId: string) => {
        let userName = '';
        setUsers(prev => prev.filter(u => {
            if (u.id === userId) {
                userName = u.id === user?.id ? "tu propio usuario" : u.name;
                return false;
            }
            return true;
        }));
         toast({
            variant: "destructive",
            title: "Usuario Eliminado",
            description: `El usuario ${userName} ha sido eliminado del sistema.`,
        })
    }

    const handleViewProfile = (customer: User) => {
        setSelectedUser(customer);
        setProfileDialogOpen(true);
    };

    const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedName = formData.get('name') as string;

        if (selectedUser) {
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, name: updatedName } : u));
            toast({
                title: "Perfil Actualizado",
                description: `Se actualizó el nombre de ${selectedUser.name} a ${updatedName}.`,
            });
        }
        setProfileDialogOpen(false);
    }

    const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast({
            title: "Contraseña Actualizada (Simulación)",
            description: `Se ha actualizado la contraseña para ${selectedUser?.name}.`,
        });
        setProfileDialogOpen(false);
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

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
                    <CardTitle>Lista de Registrados</CardTitle>
                    <CardDescription>
                        Usuarios registrados en la plataforma. Solo los administradores pueden cambiar roles.
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar por nombre o email..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Roles</SelectItem>
                                {Object.entries(roleNames).map(([key, name]) => (
                                    <SelectItem key={key} value={key}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                                <DropdownMenuItem onClick={() => handleViewProfile(customer)}>Ver Perfil</DropdownMenuItem>
                                {isAdmin && customer.id !== user?.id && (
                                    <>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>Cambiar Rol</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.id, 'cliente')}>Cliente</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.id, 'cliente_especial')}>Cliente Especial</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.id, 'vendedor')}>Vendedor</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(customer.id, 'admin')}>Administrador</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>

                                        <DropdownMenuSeparator />
                                        
                                        {customer.status === 'activo' ? (
                                            <DropdownMenuItem onClick={() => handleChangeStatus(customer.id, 'inactivo')}>
                                                <UserX className="mr-2 h-4 w-4" />
                                                Desactivar
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem onClick={() => handleChangeStatus(customer.id, 'activo')}>
                                                <UserCheck className="mr-2 h-4 w-4" />
                                                Activar
                                            </DropdownMenuItem>
                                        )}
                                    
                                        <DropdownMenuSeparator />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                     <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar Usuario
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario <span className="font-bold">{customer.name}</span>.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteUser(customer.id)}>Eliminar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                )}
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                 {filteredUsers.length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No se encontraron usuarios que coincidan con los filtros.
                    </div>
                )}
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
                            <Input id="name" name="name" placeholder="Ej: Juan Pérez" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" name="email" type="email" placeholder="ejemplo@email.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">Contraseña Temporal</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol del Usuario</Label>
                            <Select name="role" required defaultValue="cliente">
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

        <Dialog open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Gestionar Perfil de: {selectedUser?.name}</DialogTitle>
                    <DialogDescription>
                        Edita la información del usuario o actualiza su contraseña.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-8 pt-4">
                    <form onSubmit={handleProfileSave}>
                        <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="profile-name">Nombre</Label>
                                <Input id="profile-name" name="name" defaultValue={selectedUser?.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profile-email">Correo Electrónico</Label>
                                <Input id="profile-email" type="email" defaultValue={selectedUser?.email} disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Guardar Cambios</Button>
                        </CardFooter>
                        </Card>
                    </form>
                     <form onSubmit={handlePasswordChange}>
                        <Card>
                        <CardHeader>
                            <CardTitle>Cambiar Contraseña</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva Contraseña</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Actualizar Contraseña</Button>
                        </CardFooter>
                        </Card>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
}

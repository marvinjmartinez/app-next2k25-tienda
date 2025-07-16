// src/app/sales/pos/customers/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, UserPlus, Trash2, Pencil, Building, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { type PosCustomer } from '../page';
import posCustomersData from '@/data/pos_customers.json';

const POS_CUSTOMERS_KEY = 'pos_customers';

const loadUsers = (): PosCustomer[] => {
    if (typeof window === 'undefined') return [];
    try {
        const storedUsers = localStorage.getItem(POS_CUSTOMERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            localStorage.setItem(POS_CUSTOMERS_KEY, JSON.stringify(posCustomersData));
            return posCustomersData;
        }
    } catch (error) {
        console.error("Error loading POS customers:", error);
        return posCustomersData;
    }
};

const saveUsers = (users: PosCustomer[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(POS_CUSTOMERS_KEY, JSON.stringify(users));
    }
};

export default function PosCustomersPage() {
    const { toast } = useToast();
    const [customers, setCustomers] = useState<PosCustomer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCustomers(loadUsers());
    }, []);

    const handleFormOpen = (customer: PosCustomer | null = null) => {
        setSelectedCustomer(customer);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedCustomer(null);
    };

    const handleSave = (customerData: PosCustomer) => {
        let updatedCustomers;
        if (selectedCustomer) {
            updatedCustomers = customers.map(c => c.id === selectedCustomer.id ? customerData : c);
        } else {
            updatedCustomers = [customerData, ...customers];
        }
        setCustomers(updatedCustomers);
        saveUsers(updatedCustomers);
        toast({
            title: `Cliente ${selectedCustomer ? 'actualizado' : 'creado'}`,
            description: `El cliente ${customerData.name} ha sido guardado.`,
        });
        handleFormClose();
    };

    const handleDelete = (customerId: string) => {
        const updatedCustomers = customers.filter(c => c.id !== customerId);
        setCustomers(updatedCustomers);
        saveUsers(updatedCustomers);
        toast({
            variant: "destructive",
            title: "Cliente Eliminado",
            description: "El cliente ha sido eliminado del directorio.",
        });
    };
    
    const filteredCustomers = useMemo(() => {
        return customers.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.identification && c.identification.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [customers, searchQuery]);

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCustomers, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);


    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Directorio de Clientes</CardTitle>
                        <CardDescription>
                            Gestiona los clientes para ventas en el punto de venta.
                        </CardDescription>
                    </div>
                    <Button onClick={() => handleFormOpen()}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear Cliente
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full max-w-sm mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, identificación o email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Contacto</TableHead>
                                <TableHead>Identificación</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.length > 0 ? paginatedCustomers.map(customer => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>
                                        <div>{customer.email || '-'}</div>
                                        <div className="text-sm text-muted-foreground">{customer.phone || '-'}</div>
                                    </TableCell>
                                    <TableCell>{customer.identification || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleFormOpen(customer)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estás seguro de que quieres eliminar a <strong>{customer.name}</strong>? Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(customer.id)}>Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={4} className="h-24 text-center">No se encontraron clientes.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <span>Total de clientes: {filteredCustomers.length}</span>
                        <div className="flex items-center gap-4">
                            <span>Página {currentPage} de {totalPages}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" /> Anterior
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                                    Siguiente <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
            <CustomerFormDialog
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSave={handleSave}
                customer={selectedCustomer}
            />
        </>
    );
}

// Subcomponente de formulario
interface CustomerFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PosCustomer) => void;
    customer: PosCustomer | null;
}

function CustomerFormDialog({ isOpen, onClose, onSave, customer }: CustomerFormDialogProps) {
    const [customerType, setCustomerType] = useState<'natural' | 'empresa'>('natural');

    useEffect(() => {
        if (customer) {
            setCustomerType(customer.type);
        } else {
            setCustomerType('natural');
        }
    }, [customer]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = customerType === 'natural'
            ? `${formData.get('firstName')} ${formData.get('lastName')}`
            : formData.get('companyName');

        const customerData: PosCustomer = {
            id: customer?.id || `pos_user_${Date.now()}`,
            name: name as string,
            email: formData.get('email') as string,
            role: customer?.role || 'cliente',
            type: customerType,
            identification: formData.get('identification') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
        };
        onSave(customerData);
    };

    const getNaturalNameParts = (fullName: string | undefined) => {
        if (!fullName) return { firstName: '', lastName: '' };
        const parts = fullName.split(' ');
        const firstName = parts.slice(0, -1).join(' ');
        const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
        return { firstName: firstName || fullName, lastName };
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{customer ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <RadioGroup value={customerType} onValueChange={(value: 'natural' | 'empresa') => setCustomerType(value)} className="grid grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="natural" id="natural" className="peer sr-only" />
                            <Label htmlFor="natural" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <User className="h-5 w-5" /> Persona Natural
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="empresa" id="empresa" className="peer sr-only" />
                            <Label htmlFor="empresa" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Building className="h-5 w-5" /> Empresa
                            </Label>
                        </div>
                    </RadioGroup>

                    {customerType === 'natural' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><Label htmlFor="firstName">Nombres</Label><Input id="firstName" name="firstName" defaultValue={getNaturalNameParts(customer?.name).firstName} required /></div>
                            <div className="space-y-1"><Label htmlFor="lastName">Apellidos</Label><Input id="lastName" name="lastName" defaultValue={getNaturalNameParts(customer?.name).lastName} required /></div>
                        </div>
                    ) : (
                        <div className="space-y-1"><Label htmlFor="companyName">Razón Social</Label><Input id="companyName" name="companyName" defaultValue={customer?.name} required /></div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label htmlFor="identification">Identificación (Cédula/RUC)</Label><Input id="identification" name="identification" defaultValue={customer?.identification} required /></div>
                        <div className="space-y-1"><Label htmlFor="email">Correo Electrónico</Label><Input id="email" name="email" type="email" defaultValue={customer?.email} required /></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" defaultValue={customer?.phone} required /></div>
                        <div className="space-y-1"><Label htmlFor="address">Dirección</Label><Input id="address" name="address" defaultValue={customer?.address} required /></div>
                    </div>
                     <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar Cliente</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
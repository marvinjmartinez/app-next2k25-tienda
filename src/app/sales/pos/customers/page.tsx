// src/app/sales/pos/customers/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, UserPlus, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { type PosCustomer } from '../page';
import posCustomersData from '@/data/pos_customers.json';
import { PosCustomerFormDialog } from '@/components/pos-customer-form';

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
            <PosCustomerFormDialog
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSave={handleSave}
                customer={selectedCustomer}
            />
        </>
    );
}

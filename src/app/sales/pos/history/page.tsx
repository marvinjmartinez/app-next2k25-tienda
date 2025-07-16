// src/app/sales/pos/history/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, Search, Eye, ChevronLeft, ChevronRight, CreditCard, Wallet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/dummy-data';

interface PosCartItem extends Product {
    quantity: number;
}

interface PosSale {
    id: string;
    date: string;
    customer?: { id: string; name: string };
    items: PosCartItem[];
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: 'Efectivo' | 'Tarjeta';
    status: 'Completada';
}

const SALES_STORAGE_KEY = 'pos_sales';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function PosHistoryPage() {
    const [sales, setSales] = useState<PosSale[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        try {
            const storedSales = localStorage.getItem(SALES_STORAGE_KEY);
            if (storedSales) {
                setSales(JSON.parse(storedSales));
            }
        } catch (error) {
            console.error("Error loading sales from localStorage", error);
        }
    }, []);

    const filteredSales = useMemo(() => {
        return sales.filter(sale => 
            sale.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (sale.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sales, searchQuery]);
    
    const paginatedSales = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredSales.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredSales, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <PageHeader title="Historial de Ventas POS" description="Consulta todas las transacciones realizadas en el punto de venta." />
            <Card>
                <CardHeader>
                    <CardTitle>Ventas Realizadas</CardTitle>
                    <CardDescription>
                        Busca por ID de venta o nombre del cliente.
                    </CardDescription>
                    <div className="pt-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar venta o cliente..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead># Venta</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Pago</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedSales.length > 0 ? paginatedSales.map(sale => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.id}</TableCell>
                                    <TableCell>{formatDate(sale.date)}</TableCell>
                                    <TableCell>{sale.customer?.name || 'Cliente General'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {sale.paymentMethod === 'Efectivo' ? <Wallet className="h-4 w-4 text-muted-foreground" /> : <CreditCard className="h-4 w-4 text-muted-foreground" />}
                                            <span>{sale.paymentMethod}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="ghost" size="icon">
                                            <Link href={`/sales/pos/history/${sale.id}`}>
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Ver Detalle</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No se encontraron ventas.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                   <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Total de ventas: {filteredSales.length}</span>
                        </div>
                         <div className="flex items-center gap-4">
                            <span>Página {currentPage} de {totalPages}</span>
                            <div className="flex gap-2">
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                >
                                <ChevronLeft className="h-4 w-4" />
                                Anterior
                                </Button>
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                >
                                Siguiente
                                <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

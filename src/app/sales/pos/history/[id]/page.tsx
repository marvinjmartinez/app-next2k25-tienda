// src/app/sales/pos/history/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import type { Product } from '@/lib/dummy-data';
import { formatCurrency } from '@/lib/utils';

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

export default function SaleDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [sale, setSale] = useState<PosSale | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof id === 'string') {
            try {
                const storedSales = localStorage.getItem(SALES_STORAGE_KEY);
                if (storedSales) {
                    const sales: PosSale[] = JSON.parse(storedSales);
                    const foundSale = sales.find(s => s.id === id);
                    setSale(foundSale || null);
                }
            } catch (error) {
                console.error("Error loading sale from localStorage", error);
            }
        }
        setIsLoading(false);
    }, [id]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
                <Card><Skeleton className="h-96 w-full" /></Card>
            </div>
        );
    }

    if (!sale) {
        return (
            <div className="text-center">
                <PageHeader title="Venta no encontrada" description="No se pudo encontrar la venta con el ID proporcionado." />
                <Button asChild variant="link" className="mt-4"><Link href="/sales/pos/history">Volver al Historial</Link></Button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <PageHeader title={`Detalle de Venta #${sale.id}`} description={`Realizada el ${formatDate(sale.date)}`} />
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/sales/pos/history">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Historial
                        </Link>
                    </Button>
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Reimprimir
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Cliente: {sale.customer?.name || 'Cliente General'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Cantidad</TableHead>
                                <TableHead className="text-right">Precio Unit.</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sale.items.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(sale.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">IVA (16%)</span>
                            <span>{formatCurrency(sale.tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(sale.total)}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

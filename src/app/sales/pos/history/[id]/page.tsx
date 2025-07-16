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
import { LogoTienda } from '@/components/logo-tienda';
import { Badge } from '@/components/ui/badge';

import type { Product } from '@/lib/dummy-data';
import { formatCurrency } from '@/lib/utils';
import { PosSale } from '../page';


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

    const Receipt = ({ sale }: { sale: PosSale }) => (
        <div className="bg-white text-black font-mono p-4 w-full max-w-md mx-auto border rounded-lg">
            <div className="text-center mb-4">
                <LogoTienda width={48} height={48} className="mx-auto h-12 w-auto" />
                <h2 className="text-xl font-bold">Distrimin SAS</h2>
                <p className="text-xs">Av. de los Constructores 123</p>
                <p className="text-xs">Ciudad Ejemplo, México</p>
            </div>
            <Separator className="my-2 border-dashed" />
            <div className="text-xs">
                <p>Venta: {sale.id}</p>
                <p>Fecha: {formatDate(sale.date)}</p>
                <p>Cliente: {sale.customer?.name || 'Cliente General'}</p>
                <p>Forma de Pago: {sale.paymentMethod}</p>
            </div>
            <Separator className="my-2 border-dashed" />
            <table className="w-full text-xs">
                <thead>
                    <tr>
                        <th className="text-left font-semibold">Producto</th>
                        <th className="text-right font-semibold">Cant.</th>
                        <th className="text-right font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.items.map(item => (
                        <tr key={item.id}>
                            <td className="w-1/2 truncate pr-2">{item.name}</td>
                            <td className="text-right">{item.quantity}</td>
                            <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Separator className="my-2 border-dashed" />
            <div className="text-xs space-y-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(sale.subtotal)}</span></div>
                <div className="flex justify-between"><span>IVA (16%):</span><span>{formatCurrency(sale.tax)}</span></div>
                <div className="flex justify-between font-bold text-sm"><span>TOTAL:</span><span>{formatCurrency(sale.total)}</span></div>
            </div>
            <Separator className="my-2 border-dashed" />
            <div className="text-center text-xs mt-4">
                <p>¡Gracias por su compra!</p>
            </div>
        </div>
    );

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
            <div className="flex justify-between items-start no-print">
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
             <div className="printable-content">
                <Receipt sale={sale} />
            </div>
        </div>
    );
}

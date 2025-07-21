// src/app/account/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import type { Quote } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PrintableQuote } from '@/components/printable-quote';
import { getQuotesApi } from '@/lib/local-storage-api';

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

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const [myPurchases, setMyPurchases] = useState<Quote[]>([]);
  const [quoteToPrint, setQuoteToPrint] = useState<Quote | null>(null);

  useEffect(() => {
    if (user) {
        const allQuotes = getQuotesApi();
        const userQuotes = allQuotes.filter(q => q.customerId === user.id);
        setMyPurchases(userQuotes);
    }
  }, [user]);

  const handlePrint = (purchase: Quote) => {
    setQuoteToPrint(purchase);
    // Timeout to allow state to update before printing
    setTimeout(() => {
        window.print();
        setQuoteToPrint(null);
    }, 100);
  }

  return (
    <>
        <div className="no-print space-y-6">
            <PageHeader
                title="Mi Cuenta"
                description="Bienvenido a tu panel de control. Aquí puedes gestionar tu información y pedidos."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Compras</CardTitle>
                    <CardDescription>Aquí puedes ver todas las compras y cotizaciones que has realizado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead># Pedido</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Asesor</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {myPurchases.length > 0 ? (
                                myPurchases.map((purchase) => (
                                <TableRow key={purchase.id}>
                                    <TableCell className="font-medium">{purchase.id}</TableCell>
                                    <TableCell>{formatDate(purchase.date)}</TableCell>
                                    <TableCell>{purchase.salespersonName || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusBadges[purchase.status] || 'outline'}>
                                            {purchase.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatCurrency(purchase.total)}</TableCell>
                                    <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handlePrint(purchase)}>
                                            <Printer className="h-4 w-4" />
                                            <span className="sr-only">Imprimir</span>
                                    </Button>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No has realizado ninguna compra todavía.
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="hidden printable-content">
            {quoteToPrint && <PrintableQuote quote={quoteToPrint} />}
        </div>
    </>
  );
}

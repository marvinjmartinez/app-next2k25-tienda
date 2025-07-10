// src/app/account/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-context';
import type { Quote } from '@/app/sales/create-quote/page';

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

  useEffect(() => {
    if (user) {
        try {
            const allQuotes: Quote[] = JSON.parse(localStorage.getItem('saved_quotes') || '[]');
            const userQuotes = allQuotes.filter(q => q.customerId === user.id);
            setMyPurchases(userQuotes);
        } catch (error) {
            console.error("Error loading purchases from localStorage", error);
        }
    }
  }, [user]);

  return (
    <div className="space-y-6">
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead># Pedido</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {myPurchases.length > 0 ? (
                    myPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>{formatDate(purchase.date)}</TableCell>
                        <TableCell>
                            <Badge variant={statusBadges[purchase.status] || 'outline'}>
                                {purchase.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(purchase.total)}</TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            No has realizado ninguna compra todavía.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

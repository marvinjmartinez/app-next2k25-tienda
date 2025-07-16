// src/app/sales/commissions/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import usersData from '@/data/users.json';
import { getProducts, type Product, type PriceTiers } from '@/lib/dummy-data';
import type { PosSale } from '../pos/page';
import type { User } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { HandCoins } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const SALES_STORAGE_KEY = 'pos_sales';
const PRODUCTS_STORAGE_KEY = 'crud_products';
const COMMISSIONS_STORAGE_KEY = 'settled_commissions';

// Definición de tasas de comisión (simuladas)
const COMMISSION_RATES: { [key in keyof PriceTiers]: number } = {
  tipo1: 0.05, // 5% para ventas a precio público
  tipo2: 0.03, // 3% para ventas a precio especial
  tipo3: 0.0,  // 0% para ventas a precio de costo (sin comisión)
};

const priceTierNames: { [key in keyof PriceTiers]: string } = {
    tipo1: 'Público',
    tipo2: 'Especial',
    tipo3: 'Costo',
}

interface CommissionData {
  salespersonId: string;
  salespersonName: string;
  totalSales: number;
  totalCommission: number;
  details: {
    saleId: string;
    productName: string;
    quantity: number;
    salePrice: number;
    priceTier: keyof PriceTiers;
    commission: number;
  }[];
}

export default function CommissionsPage() {
  const { toast } = useToast();
  const [sales, setSales] = useState<PosSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salespeople, setSalespeople] = useState<User[]>([]);
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  
  useEffect(() => {
    // Cargar datos de localStorage
    try {
      const storedSales = localStorage.getItem(SALES_STORAGE_KEY);
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      
      const salesData = storedSales ? JSON.parse(storedSales) : [];
      const productsData = storedProducts ? JSON.parse(storedProducts) : getProducts();
      
      const settledSales = JSON.parse(localStorage.getItem(COMMISSIONS_STORAGE_KEY) || '[]');
      const unsettledSales = salesData.filter((s: PosSale) => !settledSales.includes(s.id));

      setSales(unsettledSales);
      setProducts(productsData);
      setSalespeople(usersData.filter(u => u.role === 'vendedor') as User[]);
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos de ventas." });
    }
  }, [toast]);

  const commissionData = useMemo(() => {
    const data: { [key: string]: CommissionData } = {};

    salespeople.forEach(sp => {
      data[sp.id] = {
        salespersonId: sp.id,
        salespersonName: sp.name,
        totalSales: 0,
        totalCommission: 0,
        details: [],
      };
    });

    sales.forEach(sale => {
      // En un sistema real, se guardaría el ID del vendedor que realiza la venta.
      // Aquí simulamos que si un vendedor compra, la comisión es para él.
      const salespersonId = sale.customer?.id;
      if (salespersonId && data[salespersonId]) {
        sale.items.forEach(item => {
          const product = products.find(p => p.id === item.id);
          if (!product || !product.priceTiers) return;

          let priceTier: keyof PriceTiers = 'tipo1';
          if (item.price === product.priceTiers.tipo2) priceTier = 'tipo2';
          else if (item.price === product.priceTiers.tipo3) priceTier = 'tipo3';

          const commissionRate = COMMISSION_RATES[priceTier];
          const commission = item.price * item.quantity * commissionRate;
          
          data[salespersonId].totalSales += item.price * item.quantity;
          data[salespersonId].totalCommission += commission;
          data[salespersonId].details.push({
            saleId: sale.id,
            productName: item.name,
            quantity: item.quantity,
            salePrice: item.price,
            priceTier,
            commission
          });
        });
      }
    });

    return Object.values(data);
  }, [sales, products, salespeople]);

  const filteredCommissionData = useMemo(() => {
    if (selectedSalesperson === 'all') {
      return commissionData;
    }
    return commissionData.filter(c => c.salespersonId === selectedSalesperson);
  }, [commissionData, selectedSalesperson]);
  
  const handleSettleCommissions = (salespersonId: string) => {
    const salespersonData = commissionData.find(c => c.salespersonId === salespersonId);
    if (!salespersonData || salespersonData.details.length === 0) {
        toast({variant: "destructive", title: "Sin Comisiones", description: "No hay comisiones pendientes para liquidar."});
        return;
    }
    
    // Marcar las ventas como liquidadas
    const settledSalesIds = salespersonData.details.map(d => d.saleId);
    const existingSettled = JSON.parse(localStorage.getItem(COMMISSIONS_STORAGE_KEY) || '[]');
    localStorage.setItem(COMMISSIONS_STORAGE_KEY, JSON.stringify([...existingSettled, ...settledSalesIds]));
    
    // Actualizar el estado para reflejar el cambio
    setSales(prevSales => prevSales.filter(s => !settledSalesIds.includes(s.id)));

    toast({
        title: "Comisiones Liquidadas",
        description: `Se han liquidado ${formatCurrency(salespersonData.totalCommission)} para ${salespersonData.salespersonName}.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Liquidación de Comisiones"
        description="Calcula y liquida las comisiones de los vendedores basadas en sus ventas."
      />

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Comisiones Pendientes</CardTitle>
          <div className="flex justify-between items-center pt-2">
            <CardDescription>
                Comisiones generadas por ventas que aún no han sido liquidadas.
            </CardDescription>
            <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los Vendedores</SelectItem>
                    {salespeople.map(sp => (
                        <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Vendedor</TableHead>
                        <TableHead className="text-right">Ventas Totales</TableHead>
                        <TableHead className="text-right">Comisión Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCommissionData.length > 0 ? filteredCommissionData.map(data => (
                        <TableRow key={data.salespersonId}>
                            <TableCell className="font-medium">{data.salespersonName}</TableCell>
                            <TableCell className="text-right">{formatCurrency(data.totalSales)}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{formatCurrency(data.totalCommission)}</TableCell>
                            <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="outline" disabled={data.totalCommission === 0}>
                                            <HandCoins className="mr-2 h-4 w-4" />
                                            Liquidar
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Confirmar Liquidación?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esto marcará todas las comisiones pendientes de <strong>{data.salespersonName}</strong> por un total de <strong>{formatCurrency(data.totalCommission)}</strong> como pagadas. Esta acción no se puede deshacer.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleSettleCommissions(data.salespersonId)}>
                                                Confirmar y Liquidar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">No hay comisiones pendientes.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      {selectedSalesperson !== 'all' && filteredCommissionData.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>Detalle de Ventas para {filteredCommissionData[0].salespersonName}</CardTitle>
                <CardDescription>Desglose de cada producto que generó comisión.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead># Venta</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Tipo de Precio</TableHead>
                            <TableHead className="text-right">Comisión</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCommissionData[0].details.map((detail, index) => (
                            <TableRow key={`${detail.saleId}-${index}`}>
                                <TableCell className="font-mono text-xs">{detail.saleId}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{detail.productName}</div>
                                    <div className="text-sm text-muted-foreground">{detail.quantity} x {formatCurrency(detail.salePrice)}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="capitalize">{priceTierNames[detail.priceTier]}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(detail.commission)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
      )}

    </div>
  );
}

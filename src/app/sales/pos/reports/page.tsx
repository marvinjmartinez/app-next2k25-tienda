// src/app/sales/pos/reports/page.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, DollarSign, ShoppingBag, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Label } from '@/components/ui/label';

// Datos de demostración
const summaryData = {
    totalSales: 15720.50,
    totalTransactions: 89,
    productsSold: 213,
};

const salesByPaymentMethod = [
    { method: 'Efectivo', amount: 5250.50, transactions: 45 },
    { method: 'Tarjeta', amount: 8320.00, transactions: 38 },
    { method: 'Crédito', amount: 2150.00, transactions: 6 },
];

export default function PosReportsPage() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setDate(1)));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informes de Ventas</CardTitle>
                    <CardDescription>
                       Selecciona un rango de fechas para ver el rendimiento del punto de venta.
                    </CardDescription>
                    <div className="flex items-end gap-4 pt-4">
                        <div className="grid gap-2">
                           <Label htmlFor="start-date">Fecha de Inicio</Label>
                           <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="start-date" variant="outline" className="w-[200px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "d 'de' LLL, y", {locale: es}) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                        locale={es}
                                        disabled={(date) => date > (endDate || new Date()) || date < new Date("1900-01-01")}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor="end-date">Fecha de Fin</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="end-date" variant="outline" className="w-[200px] justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "d 'de' LLL, y", {locale: es}) : <span>Seleccionar fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                        locale={es}
                                        disabled={(date) => date < (startDate || new Date(0)) || date > new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <Button>Aplicar Filtro</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* KPIs */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(summaryData.totalSales)}</div>
                                <p className="text-xs text-muted-foreground">{summaryData.totalTransactions} transacciones</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summaryData.productsSold}</div>
                                <p className="text-xs text-muted-foreground">unidades en total</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                                <BarChart2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(summaryData.totalSales / summaryData.totalTransactions)}</div>
                                <p className="text-xs text-muted-foreground">por transacción</p>
                            </CardContent>
                        </Card>
                    </div>
                    {/* Tabla */}
                    <div>
                        <h3 className="font-semibold mb-4">Resumen por Método de Pago</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Método de Pago</TableHead>
                                    <TableHead className="text-right"># Transacciones</TableHead>
                                    <TableHead className="text-right">Monto Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesByPaymentMethod.map(item => (
                                    <TableRow key={item.method}>
                                        <TableCell className="font-medium">{item.method}</TableCell>
                                        <TableCell className="text-right">{item.transactions}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

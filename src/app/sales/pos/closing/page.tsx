// src/app/sales/pos/closing/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Banknote, CreditCard, FileText, Scale } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Datos de demostración (en una app real vendrían de las ventas del día)
const systemData = {
    cashSales: 5250.50,
    cardSales: 8320.00,
    creditSales: 2150.00,
};

export default function PosClosingPage() {
    const { toast } = useToast();
    const [initialCash, setInitialCash] = useState('2000');
    const [countedCash, setCountedCash] = useState('');

    const totalSales = systemData.cashSales + systemData.cardSales + systemData.creditSales;
    const expectedCash = (parseFloat(initialCash) || 0) + systemData.cashSales;
    const difference = (parseFloat(countedCash) || 0) - expectedCash;

    const handleCloseRegister = () => {
        if (!countedCash) {
            toast({
                variant: 'destructive',
                title: 'Campo requerido',
                description: 'Por favor, ingresa el efectivo contado en caja.'
            });
            return;
        }

        toast({
            title: 'Caja Cerrada (Simulación)',
            description: `Se ha registrado el cierre de caja con una diferencia de ${formatCurrency(difference)}.`,
        });
        
        // Aquí se guardaría el registro del cierre y se reiniciarían los datos.
        setCountedCash('');
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Cuadre de Caja</CardTitle>
                    <CardDescription>
                        Verifica los montos del sistema, realiza el conteo de efectivo y cierra la caja del día.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Resumen del Sistema */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Resumen del Sistema</h3>
                        <div className="p-4 bg-muted rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center gap-2"><Banknote />Ventas en Efectivo</span>
                                <span className="font-medium">{formatCurrency(systemData.cashSales)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center gap-2"><CreditCard />Ventas con Tarjeta</span>
                                <span className="font-medium">{formatCurrency(systemData.cardSales)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground flex items-center gap-2"><FileText />Ventas a Crédito</span>
                                <span className="font-medium">{formatCurrency(systemData.creditSales)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center font-bold">
                                <span>Total de Ventas del Día</span>
                                <span>{formatCurrency(totalSales)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Conteo de Caja */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Conteo de Caja</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="initial-cash">Fondo de Caja (Inicio)</Label>
                                <Input id="initial-cash" type="number" value={initialCash} onChange={(e) => setInitialCash(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="counted-cash">Efectivo Contado (Final)</Label>
                                <Input id="counted-cash" type="number" value={countedCash} onChange={(e) => setCountedCash(e.target.value)} placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Diferencia */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Diferencia</h3>
                        <div className="p-4 border rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Scale />
                                <div>
                                    <p className="font-bold text-lg">
                                        {formatCurrency(difference)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Efectivo esperado: {formatCurrency(expectedCash)}</p>
                                </div>
                            </div>
                            {countedCash && (
                                <Badge variant={difference === 0 ? 'default' : 'destructive'}>
                                    {difference === 0 ? 'Cuadre Correcto' : (difference > 0 ? 'Sobrante' : 'Faltante')}
                                </Badge>
                            )}
                        </div>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handleCloseRegister}>Cerrar Caja</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
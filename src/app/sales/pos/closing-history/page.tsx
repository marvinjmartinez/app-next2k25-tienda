// src/app/sales/pos/closing-history/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { ClosingRecord } from '../closing/page';
import { Badge } from '@/components/ui/badge';

const CLOSING_HISTORY_KEY = 'pos_closing_history';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function PosClosingHistoryPage() {
    const [history, setHistory] = useState<ClosingRecord[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(CLOSING_HISTORY_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Error loading closing history:", error);
        }
    }, []);

    const paginatedHistory = history.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(history.length / itemsPerPage);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historial de Cierres de Caja</CardTitle>
                <CardDescription>
                    Consulta todos los cierres de caja registrados en el sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead className="text-right">Fondo Inicial</TableHead>
                            <TableHead className="text-right">Efectivo Contado</TableHead>
                            <TableHead className="text-right">Descuadre</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedHistory.length > 0 ? paginatedHistory.map(record => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                                <TableCell>{record.userName}</TableCell>
                                <TableCell className="text-right">{formatCurrency(record.initialCash)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(record.countedCash)}</TableCell>
                                <TableCell className="text-right">
                                     <Badge variant={record.difference === 0 ? 'default' : 'destructive'}>
                                        {formatCurrency(record.difference)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">No hay registros de cierre.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                 <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <span>Total de cierres: {history.length}</span>
                    <div className="flex items-center gap-4">
                        <span>Página {currentPage} de {totalPages}</span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" /> Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Siguiente <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

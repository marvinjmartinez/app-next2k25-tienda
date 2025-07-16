// src/app/sales/quotes/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Send, Trash2, Pencil, Printer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Quote } from '../create-quote/page';
import { useCart } from '@/context/cart-context';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PrintableQuote } from '@/components/printable-quote';
import { getProducts } from '@/lib/dummy-data';


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

const allProducts = getProducts();

const initialDummyQuotes: Quote[] = [
    {
      id: 'COT-001',
      customerName: 'Constructora Roble',
      customerId: 'user-roble',
      salespersonName: 'Vendedor User',
      date: '2024-07-08',
      total: 15890.50,
      status: 'Pagada',
      items: [
          {...allProducts.find(p => p.id === 'prod_5')!, quantity: 50, price: 260.00},
          {...allProducts.find(p => p.id === 'prod_9')!, quantity: 15, price: 180.00},
      ],
    },
    {
      id: 'COT-002',
      customerName: 'Vendedor User',
      customerId: 'user-vendedor',
      salespersonName: 'Admin User',
      date: '2024-07-10',
      total: 3250.00,
      status: 'Borrador',
      items: [
          {...allProducts.find(p => p.id === 'prod_1')!, quantity: 1, price: 1650.00},
          {...allProducts.find(p => p.id === 'prod_2')!, quantity: 2, price: 425.00},
          {...allProducts.find(p => p.id === 'prod_7')!, quantity: 1, price: 750.00},
      ],
    },
    {
      id: 'COT-003',
      customerName: 'Proyectos Urbanos S.A.',
      customerId: 'user-urbanos',
      salespersonName: 'Vendedor User',
      date: '2024-07-11',
      total: 78500.00,
      status: 'Enviada',
       items: [
          {...allProducts.find(p => p.id === 'prod_12')!, quantity: 40, price: 1700.00},
          {...allProducts.find(p => p.id === 'prod_3')!, quantity: 10, price: 1050.00},
      ],
    },
     {
      id: 'COT-004',
      customerName: 'Cliente Ejemplo',
      customerId: 'user-cliente',
      salespersonName: 'Admin User',
      date: '2024-07-12',
      total: 890.00,
      status: 'Borrador',
      items: [
         {...allProducts.find(p => p.id === 'prod_6')!, quantity: 2, price: 150.00},
         {...allProducts.find(p => p.id === 'prod_8')!, quantity: 4, price: 95.00},
         {...allProducts.find(p => p.id === 'prod_2')!, quantity: 1, price: 210.00},
      ],
    },
  ];

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [quoteToPrint, setQuoteToPrint] = useState<Quote | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { addToCart } = useCart();
    
    useEffect(() => {
        try {
            const savedQuotesJSON = localStorage.getItem('saved_quotes');
            let savedQuotes: Quote[] = savedQuotesJSON ? JSON.parse(savedQuotesJSON) : [];
            
            // One-time migration: Check if dummy quotes have empty items. If so, replace them.
            const needsMigration = savedQuotes.some(q => 
                initialDummyQuotes.some(dq => dq.id === q.id && q.items.length === 0)
            );

            if (savedQuotes.length === 0 || needsMigration) {
                // Get existing user-created quotes (not part of dummy data)
                const userCreatedQuotes = savedQuotes.filter(q => !initialDummyQuotes.some(dq => dq.id === q.id));
                // Merge dummy data with user-created data
                const updatedQuotes = [...initialDummyQuotes, ...userCreatedQuotes];
                localStorage.setItem('saved_quotes', JSON.stringify(updatedQuotes));
                savedQuotes = updatedQuotes;
            }
            
            setQuotes(savedQuotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            console.error("Failed to load quotes from localStorage", error);
            const sortedInitial = initialDummyQuotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setQuotes(sortedInitial);
        }
    }, []);

    const handleSendToCart = (quote: Quote) => {
        if (quote.items && quote.items.length > 0) {
            quote.items.forEach(item => {
                addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity,
                })
            });

            toast({
                title: 'Cotización Enviada al Carrito',
                description: `Los productos de la cotización ${quote.id} han sido añadidos al carrito.`,
            });
            router.push('/cart');
        } else {
             toast({
                variant: 'destructive',
                title: 'Cotización sin productos',
                description: `No se pueden agregar productos al carrito porque la cotización está vacía o es una simulación.`,
            });
        }
    }

    const handleEdit = (quoteId: string) => {
        router.push(`/sales/create-quote?edit=${quoteId}`);
    }

    const handlePrint = (quote: Quote) => {
      setQuoteToPrint(quote);
      setTimeout(() => {
        window.print();
        setQuoteToPrint(null);
      }, 100);
    }

    const deleteQuote = (quoteId: string) => {
        try {
            let savedQuotes: Quote[] = JSON.parse(localStorage.getItem('saved_quotes') || '[]');
            const updatedSavedQuotes = savedQuotes.filter(q => q.id !== quoteId);
            localStorage.setItem('saved_quotes', JSON.stringify(updatedSavedQuotes));
            setQuotes(updatedSavedQuotes);
        } catch (error) {
            console.error("Failed to update localStorage", error);
        }
        
        toast({
            title: "Cotización Eliminada",
            description: `La cotización ${quoteId} ha sido eliminada.`,
        });
    }

  return (
    <>
      <div className="space-y-6 no-print">
        <PageHeader
          title="Gestión de Compras"
          description="Visualiza, edita y da seguimiento a todas las cotizaciones generadas."
        />
        <Card>
          <CardHeader>
            <CardTitle>Compras Recientes</CardTitle>
            <CardDescription>
              Lista de las cotizaciones más recientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead># Cotización</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Asesor</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.length > 0 ? quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.customerName}</TableCell>
                    <TableCell>{quote.salespersonName || 'N/A'}</TableCell>
                    <TableCell>{formatDate(quote.date)}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadges[quote.status] || 'outline'}>
                          {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(quote.total)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handlePrint(quote)}>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimir
                          </DropdownMenuItem>
                          {quote.status !== 'Pagada' && (
                              <DropdownMenuItem onClick={() => handleEdit(quote.id)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                              </DropdownMenuItem>
                          )}
                          {quote.status !== 'Pagada' && (
                            <DropdownMenuItem onClick={() => handleSendToCart(quote)}>
                              <Send className="mr-2 h-4 w-4" />
                              Enviar a Carrito
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente la cotización <span className="font-bold">{quote.id}</span>.
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteQuote(quote.id)}>Eliminar</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                          No hay cotizaciones para mostrar.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
       <div className="hidden printable-content">
          {quoteToPrint && <PrintableQuote quote={quoteToPrint} />}
      </div>
    </>
  );
}

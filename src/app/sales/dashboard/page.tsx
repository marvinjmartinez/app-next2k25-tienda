// src/app/sales/dashboard/page.tsx
"use client";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, Users, FileText, ShoppingBag, TrendingUp, Activity } from "lucide-react";

const chartData = [
  { category: 'Herramientas', sales: 45600 },
  { category: 'Construcción', sales: 32150 },
  { category: 'Pintura', sales: 21800 },
  { category: 'Plomería', sales: 15300 },
];

const topProducts = [
  { name: 'Taladro Percutor Inalámbrico 20V', unitsSold: 125, totalSales: 237375 },
  { name: 'Saco de Cemento Gris 50kg', unitsSold: 850, totalSales: 238000 },
  { name: 'Pintura Vinílica Blanca 19L', unitsSold: 92, totalSales: 115000 },
  { name: 'Varilla Corrugada 3/8', unitsSold: 1300, totalSales: 234000 },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};

export default function SalesDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de Administrador"
        description="Resumen del rendimiento y actividad de la tienda."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales (Mes)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(114850)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23</div>
            <p className="text-xs text-muted-foreground">
              +12.5% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8</div>
            <p className="text-xs text-muted-foreground">
              2 nuevas hoy
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+57</div>
            <p className="text-xs text-muted-foreground">
              +19% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Resumen de ingresos por categoría de productos este mes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <Tooltip 
                        cursor={{fill: 'hsl(var(--muted))'}}
                        content={<ChartTooltipContent 
                            formatter={(value) => formatCurrency(Number(value))} 
                        />}
                    />
                    <Legend content={<ChartLegendContent />} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Los 4 productos con mayores ventas en el último periodo.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Ventas Totales</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topProducts.sort((a,b) => b.totalSales - a.totalSales).map((product) => (
                        <TableRow key={product.name}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.totalSales)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// src/app/sales/layout.tsx
"use client";

import { Package2, Home, ShoppingCart, Users, Star, PlusCircle, Package, LogOut, LayoutDashboard, User, DollarSign, Store, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoTienda } from '@/components/logo-tienda';

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const isPosPage = pathname.startsWith('/sales/pos');
  const [sidebarOpen, setSidebarOpen] = useState(!isPosPage);
  
  // Ensure sidebar collapses when navigating to POS page
  useEffect(() => {
    setSidebarOpen(!isPosPage);
  }, [isPosPage]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      toast({
        variant: 'destructive',
        title: 'Acceso Denegado',
        description: 'Debes iniciar sesión para acceder a esta página.',
      });
      return;
    } 
    
    const allowedRoles = ['admin', 'vendedor'];
    if (user && !allowedRoles.includes(user.role)) {
       router.push('/account/dashboard'); // Redirect non-sales roles to their dashboard
       toast({
        variant: 'destructive',
        title: 'Acceso Denegado',
        description: 'No tienes permisos para acceder a esta sección.',
      });
    }

  }, [isAuthenticated, user, router, toast, isLoading]);

  const isAdmin = user?.role === 'admin';

  if (isLoading || !user || !['admin', 'vendedor'].includes(user.role)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar>
          <SidebarHeader>
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <LogoTienda width={32} height={32} />
                <span className="group-data-[collapsible=icon]:hidden">Distrimin SAS</span>
              </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/dashboard')} tooltip="Panel">
                      <Link href="/sales/dashboard"><LayoutDashboard /><span>Panel</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/profile')} tooltip="Perfil">
                  <Link href="/sales/profile"><User /><span>Perfil</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/create-quote')} tooltip="Crear Cotización">
                  <Link href="/sales/create-quote"><PlusCircle /><span>Crear Cotización</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/quotes')} tooltip="Mis Compras">
                  <Link href="/sales/quotes"><Star /><span>Mis Compras</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Punto de Venta" isActive={pathname.startsWith('/sales/pos')}>
                  <Link href="/sales/pos"><Store /><span>Ventas POS</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {isAdmin && (
                <>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/customers')} tooltip="Registrados">
                        <Link href="/sales/customers"><Users /><span>Registrados</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/products')} tooltip="Productos">
                        <Link href="/sales/products"><Package /><span>Productos</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/tariffs')} tooltip="Tarifas">
                        <Link href="/sales/tariffs"><DollarSign /><span>Tarifas</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname.startsWith('/sales/commissions')} tooltip="Comisiones">
                        <Link href="/sales/commissions"><History /><span>Comisiones</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                </>
              )}

              <SidebarMenuItem>
                 <SidebarMenuButton asChild isActive={pathname.startsWith('/products-store')} tooltip="Ir a la Tienda">
                  <Link href="/products"><ShoppingCart /><span>Ir a la Tienda</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={logout} tooltip="Cerrar Sesión">
                            <LogOut />
                            <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <h1 className="font-semibold text-lg hidden sm:block">Panel de Ventas</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <span className="text-sm font-medium block">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

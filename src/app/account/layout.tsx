// src/app/account/layout.tsx
"use client";

import { User, Home, FileText, ShoppingBag, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
    SidebarFooter
} from '@/components/ui/sidebar';
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoTienda } from '@/components/logo-tienda';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      toast({
        variant: 'destructive',
        title: 'Acceso Denegado',
        description: 'Debes iniciar sesión para acceder a esta página.',
      });
    }
  }, [isAuthenticated, user, router, toast, isLoading]);

  if (isLoading || !user) {
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
    <SidebarProvider>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.endsWith('/account/dashboard')} tooltip="Panel">
                    <Link href="/account/dashboard"><Home /><span>Panel</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/account/profile')} tooltip="Mi Perfil">
                    <Link href="/account/profile"><User /><span>Mi Perfil</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/account/purchases')} tooltip="Mis Compras">
                  <Link href="/account/dashboard"><ShoppingBag /><span>Mis Compras</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/account/orders')} tooltip="Mis Pedidos">
                  <Link href="#"><FileText /><span>Mis Pedidos</span></Link>
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
                  <h1 className="font-semibold text-lg hidden sm:block">Panel de Cliente</h1>
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

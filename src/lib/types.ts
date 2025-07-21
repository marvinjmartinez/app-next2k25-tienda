// src/lib/types.ts

import type { UserRole } from "@/context/auth-context";

export interface PriceTiers {
    tipo1: number; // Público general
    tipo2: number; // Cliente especial, mayorista
    tipo3: number; // Costo para vendedor o distribuidor
}

export interface Product {
  id: string;
  name: string;
  price: number;
  priceTiers?: PriceTiers;
  image: string;
  hint: string;
  description: string;
  stock: number;
  category: string;
  featured?: boolean;
  gallery?: string[];
  status: 'activo' | 'inactivo';
}

export interface Category {
    name: string;
    slug: string;
    description: string;
    icon?: React.ReactNode;
}

export interface QuoteItem extends Product {
  quantity: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  salespersonId?: string;
  salespersonName?: string;
  date: string;
  total: number;
  status: 'Pagada' | 'Enviada' | 'Borrador' | 'Cancelada';
  items: QuoteItem[];
}

export interface PosCustomer {
    id: string;
    name: string;
    email?: string;
    type: 'natural' | 'empresa';
    role?: UserRole; // Role is optional for POS customers
    identification?: string;
    phone?: string;
    address?: string;
}

export interface PosSale {
    id: string;
    date: string;
    customer?: { id: string; name: string };
    items: QuoteItem[];
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
    paymentMethod: 'Efectivo' | 'Tarjeta' | 'Crédito';
    status: 'Completada';
}

export interface ClosingRecord {
    id: string;
    date: string;
    userName: string;
    initialCash: number;
    countedCash: number;
    expectedCash: number;
    difference: number;
}

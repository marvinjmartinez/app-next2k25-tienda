import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "./dummy-data";
import type { UserRole } from "@/context/auth-context";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
};

export const getPriceForCustomer = (product: Product, customerRole: UserRole) => {
  if (!product.priceTiers) {
      return product.price; // Fallback
  }

  switch (customerRole) {
      case 'cliente_especial':
          return product.priceTiers.tipo2;
      case 'vendedor':
          return product.priceTiers.tipo3;
      case 'cliente':
      case 'admin':
      default:
          return product.priceTiers.tipo1;
  }
}

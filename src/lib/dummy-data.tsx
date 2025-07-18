// src/lib/dummy-data.tsx
import { Drill, HardHat, Paintbrush, Wrench } from 'lucide-react';
import React from 'react';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

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

const PRODUCTS_STORAGE_KEY = 'crud_products';

const categoryIcons: { [key: string]: React.ReactNode } = {
    herramientas: <Drill className="h-8 w-8" />,
    construccion: <HardHat className="h-8 w-8" />,
    pintura: <Paintbrush className="h-8 w-8" />,
    plomeria: <Wrench className="h-8 w-8" />,
};

export const categories: Category[] = categoriesData.map(cat => ({
    ...cat,
    icon: categoryIcons[cat.slug]
}));

export const initialProducts: Product[] = productsData.map(p => ({
    ...p,
    hint: p.name, // Asegurarse de que el hint por defecto sea el nombre
}));

const SVG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='30' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

export const getProducts = (): Product[] => {
    if (typeof window === 'undefined') {
        return initialProducts.map(p => ({ ...p, image: p.image || SVG_PLACEHOLDER }));
    }
    
    let products: Product[] = [];
    try {
        const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            products = initialProducts;
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        }
    } catch (error) {
        console.error("Failed to load products from localStorage", error);
        products = initialProducts;
    }
    
    // Ensure all products have a valid image field
    return products.map(p => ({
        ...p,
        image: p.image || SVG_PLACEHOLDER,
        gallery: p.gallery || []
    }));
};

export const saveProducts = (products: Product[]) => {
     if (typeof window === 'undefined') {
        return;
    }
    
    try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error("Failed to save products to localStorage", error);
        // Aquí podríamos añadir un toast para notificar al usuario del error de cuota.
        // Por ahora, solo lo logueamos en consola.
    }
}

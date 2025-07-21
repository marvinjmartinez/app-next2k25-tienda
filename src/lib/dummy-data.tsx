// src/lib/dummy-data.tsx
import { Drill, HardHat, Paintbrush, Wrench } from 'lucide-react';
import React from 'react';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Category, Product } from './types';
import { getProductsApi, saveProductsApi } from './local-storage-api';

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

/**
 * Obtiene los productos, cargándolos desde localStorage o inicializándolos.
 * Asegura que todos los productos tengan una URL de imagen válida.
 * @returns Un array de productos.
 */
export const getProducts = (): Product[] => {
    const products = getProductsApi();
    
    // Ensure all products have a valid image field and gallery
    return products.map(p => ({
        ...p,
        image: p.image || SVG_PLACEHOLDER,
        gallery: p.gallery || []
    }));
};

/**
 * Guarda la lista de productos en localStorage.
 * @param products El array de productos a guardar.
 */
export const saveProducts = (products: Product[]): void => {
    saveProductsApi(products);
}
// src/lib/dummy-data.tsx
import { Drill, HardHat, Paintbrush, Wrench } from 'lucide-react';
import React from 'react';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

export interface Product {
  id: string;
  name: string;
  price: number;
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

export const initialProducts: Product[] = productsData as Product[];

export const getProducts = (): Product[] => {
    if (typeof window === 'undefined') {
        return initialProducts;
    }
    
    let products: Product[] = [];
    try {
        const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            products = initialProducts;
        }
    } catch (error) {
        console.error("Failed to load products from localStorage", error);
        products = initialProducts;
    }

    // Ensure all products have an image, falling back to initial data if missing.
    const productsWithImages = products.map(p => {
        if (!p.image) {
            const initialProductData = initialProducts.find(ip => ip.id === p.id);
            return { ...p, image: initialProductData?.image || 'https://placehold.co/300x300.png', hint: initialProductData?.hint || 'product' };
        }
        return p;
    });

    // If the state was different, update localStorage
    if (JSON.stringify(products) !== JSON.stringify(productsWithImages)) {
        try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsWithImages));
        } catch (error) {
            console.error("Failed to save updated products to localStorage", error);
        }
    }

    return productsWithImages;
};

// src/lib/dummy-data.tsx
import { Drill, HardHat, Paintbrush, Wrench } from 'lucide-react';
import React from 'react';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';

export interface PriceTiers {
    cliente: number;
    cliente_especial: number;
    vendedor: number;
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
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        }
    } catch (error) {
        console.error("Failed to load products from localStorage", error);
        products = initialProducts;
    }

    const productsWithImagesAndTiers = products.map(p => {
        const initialProductData = initialProducts.find(ip => ip.id === p.id);
        const image = (p.image && !p.image.includes('300x300')) ? p.image : initialProductData?.image || 'https://placehold.co/600x400.png';
        const hint = p.hint || initialProductData?.hint || 'product';
        const priceTiers = p.priceTiers || initialProductData?.priceTiers || {
            cliente: p.price,
            cliente_especial: p.price * 0.9,
            vendedor: p.price * 0.85,
        };
        
        return { 
            ...p,
            image,
            hint,
            priceTiers
        };
    });

    return productsWithImagesAndTiers;
};

export const saveProducts = (products: Product[]) => {
     if (typeof window === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error("Failed to save products to localStorage", error);
        // Potentially show a toast to the user
    }
}

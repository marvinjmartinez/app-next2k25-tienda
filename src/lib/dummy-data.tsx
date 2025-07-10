
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
  stock: number;
  category: string;
  featured?: boolean;
}

export interface Category {
    name: string;
    slug: string;
    description: string;
    icon?: React.ReactNode;
}

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

export const products: Product[] = productsData;

// src/lib/dummy-data.tsx
import { Drill, HardHat, Paintbrush, Wrench } from 'lucide-react';
import React from 'react';

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
    icon: React.ReactNode;
}

export const categories: Category[] = [
    { name: "Herramientas", slug: "herramientas", description: "Las mejores herramientas para cualquier trabajo, desde lo básico hasta lo especializado.", icon: <Drill className="h-8 w-8" /> },
    { name: "Construcción", slug: "construccion", description: "Materiales resistentes y duraderos para construir bases sólidas y proyectos impresionantes.", icon: <HardHat className="h-8 w-8" /> },
    { name: "Pintura", slug: "pintura", description: "Una amplia gama de colores y acabados para darle vida y protección a tus espacios.", icon: <Paintbrush className="h-8 w-8" /> },
    { name: "Plomería", slug: "plomeria", description: "Todo lo necesario para instalaciones y reparaciones de agua y gas, sin fugas.", icon: <Wrench className="h-8 w-8" /> },
]

export const products: Product[] = [
  {
    id: "prod_1",
    name: "Taladro Percutor Inalámbrico 20V",
    price: 1899.00,
    image: "https://placehold.co/300x300.png",
    hint: "power tool",
    stock: 15,
    category: "herramientas",
    featured: true,
  },
  {
    id: "prod_2",
    name: "Juego de Destornilladores 25 pzs",
    price: 499.00,
    image: "https://placehold.co/300x300.png",
    hint: "hand tools",
    stock: 30,
    category: "herramientas"
  },
  {
    id: "prod_3",
    name: "Pintura Vinílica Blanca 19L",
    price: 1250.00,
    image: "https://placehold.co/300x300.png",
    hint: "paint can",
    stock: 8,
    category: "pintura",
    featured: true,
  },
  {
    id: "prod_4",
    name: "Escalera de Tijera de Aluminio 6 pies",
    price: 980.00,
    image: "https://placehold.co/300x300.png",
    hint: "ladder",
    stock: 0,
    category: "herramientas",
    featured: true,
  },
  {
    id: "prod_5",
    name: "Saco de Cemento Gris 50kg",
    price: 280.00,
    image: "https://placehold.co/300x300.png",
    hint: "cement bag",
    stock: 50,
    category: "construccion",
  },
  {
    id: "prod_6",
    name: "Tubo de PVC Sanitario 4 pulgadas",
    price: 150.00,
    image: "https://placehold.co/300x300.png",
    hint: "pvc pipe",
    stock: 100,
    category: "plomeria",
  },
  {
    id: "prod_7",
    name: "Caja de Herramientas Metálica 22 pulgadas",
    price: 850.00,
    image: "https://placehold.co/300x300.png",
    hint: "toolbox",
    stock: 12,
    category: "herramientas",
    featured: true,
  },
  {
    id: "prod_8",
    name: "Brocha de Pelo de Camello 4 pulgadas",
    price: 95.00,
    image: "https://placehold.co/300x300.png",
    hint: "paintbrush",
    stock: 45,
    category: "pintura"
  },
   {
    id: "prod_9",
    name: "Varilla Corrugada 3/8",
    price: 180.00,
    image: "https://placehold.co/300x300.png",
    hint: "rebar",
    stock: 200,
    category: "construccion",
  },
  {
    id: "prod_10",
    name: "Calentador de Agua de Paso 1 servicio",
    price: 2500.00,
    image: "https://placehold.co/300x300.png",
    hint: "water heater",
    stock: 5,
    category: "plomeria",
  },
   {
    id: "prod_11",
    name: "Esmeriladora Angular 4 1/2 pulg",
    price: 1100.00,
    image: "https://placehold.co/300x300.png",
    hint: "angle grinder",
    stock: 18,
    category: "herramientas"
  },
  {
    id: "prod_12",
    name: "Impermeabilizante Rojo 5 años 19L",
    price: 1800.00,
    image: "https://placehold.co/300x300.png",
    hint: "waterproofing bucket",
    stock: 7,
    category: "pintura",
  },
];

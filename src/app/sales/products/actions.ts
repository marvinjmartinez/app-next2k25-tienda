// src/app/sales/products/actions.ts
"use server";

import { generateProductImage as generateProductImageFlow } from "@/ai/flows/generate-product-image";
import type { Product } from "@/lib/dummy-data";
import { z } from "zod";

const generateImageSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

export async function generateProductImageAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = generateImageSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors.hint?.[0] || "Entrada inválida."
        };
    }
    
    try {
        const result = await generateProductImageFlow({ hint: validation.data.hint });
        
        const dataUri = result?.imageUrl;

        if (!dataUri || !dataUri.startsWith('data:image')) {
             throw new Error('La IA no pudo generar una imagen válida.');
        }
        
        return { success: true, data: { imageUrl: dataUri } };

    } catch (error) {
        console.error("Error en generateProductImageAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
        if (errorMessage.includes("API key not valid")) {
            return { success: false, error: "La clave de API de Google no es válida. Por favor, verifica el archivo .env.local" };
        }
        return { success: false, error: errorMessage };
    }
}


const productFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    category: z.string().min(1, "La categoría es requerida."),
    price: z.coerce.number().min(0, "El precio no puede ser negativo."),
    stock: z.coerce.number().min(0, "El stock no puede ser negativo."),
    hint: z.string(),
    featured: z.coerce.boolean(),
    status: z.coerce.boolean(),
    image: z.string(),
    gallery: z.string().optional(), // Make gallery optional
});

export async function saveProductAction(formData: FormData) {
    const productDataRaw = Object.fromEntries(formData.entries());
    
    const validation = productFormSchema.safeParse(productDataRaw);
    if (!validation.success) {
        console.error("Validation errors:", validation.error.flatten());
        return { success: false, error: "Datos del formulario inválidos." };
    }

    try {
        const productData = validation.data;
        
        // Safely parse gallery
        const gallery = productData.gallery ? JSON.parse(productData.gallery) : [];

        const processedProduct: Product = {
            id: productData.id || `prod_${Date.now()}`,
            name: productData.name,
            description: productData.description || '',
            category: productData.category,
            price: productData.price,
            stock: productData.stock,
            hint: productData.hint,
            featured: productData.featured,
            status: productData.status ? 'activo' : 'inactivo',
            image: productData.image,
            gallery: gallery,
        };
        
        return { success: true, data: processedProduct };

    } catch (error) {
        console.error("Error en saveProductAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al procesar el producto.";
        return { success: false, error: errorMessage };
    }
}

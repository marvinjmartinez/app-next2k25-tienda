// src/app/sales/products/actions.ts
"use server";

import { generateProductImage as generateProductImageFlow } from "@/ai/flows/generate-product-image";
import { z } from "zod";

const generateImageSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

export async function generateProductImageAction(formData: FormData): Promise<{ success: boolean; data?: { imageUrl: string; }; error?: string; }> {
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
            return { success: false, error: "La clave de API de Google no es válida. Por favor, verifica el archivo .env" };
        }
        return { success: false, error: errorMessage };
    }
}


// This action is now simplified and doesn't return data.
// It acts as a server-side validation endpoint if needed, but the core logic
// for updating state and localStorage is handled client-side.
const productFormSchema = z.object({
    id: z.string(), // ID is now required, generated client-side
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    category: z.string().min(1, "La categoría es requerida."),
    price: z.coerce.number().min(0, "El precio no puede ser negativo."),
    stock: z.coerce.number().min(0, "El stock no puede ser negativo."),
    hint: z.string().optional(),
    image: z.string().optional(),
    gallery: z.string().optional(), // JSON string
    featured: z.coerce.boolean(),
    status: z.coerce.boolean(),
});

export async function saveProductAction(formData: FormData): Promise<void> {
    const rawData = Object.fromEntries(formData.entries());
    const validation = productFormSchema.safeParse(rawData);

    if (!validation.success) {
        // In a real app, you might throw an error to be caught client-side.
        // For now, we'll log it. The client is already handling the logic.
        console.error("Server-side validation failed:", validation.error.flatten());
    }
    
    // The primary responsibility for saving is now on the client.
    // This function can be expanded for other server-side tasks if needed (e.g., logging).
    console.log("Product data received and validated on server for product ID:", validation.success ? validation.data.id : 'unknown');
}

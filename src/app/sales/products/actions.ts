// src/app/sales/products/actions.ts
"use server";

import { generateProductImage as generateProductImageFlow } from "@/ai/flows/generate-product-image";
import { z } from "zod";

const generateImageSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

// Acción para generar la imagen y devolver el data URI
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
        
        // Devolver el data URI directamente al cliente
        return { success: true, data: { imageUrl: dataUri } };

    } catch (error) {
        console.error("Error en generateProductImageAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
         if (errorMessage.includes("API key not valid")) {
            return { success: false, error: "La clave de API de Google no es válida. Por favor, verifica el archivo .env" };
        }
        // Este error ya no debería ocurrir, pero lo dejamos por si acaso.
        if (errorMessage.includes("Could not refresh access token")) {
            return { success: false, error: "Error de autenticación con Firebase. Verifica la configuración de la cuenta de servicio." };
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
    featured: z.string().optional(), // FormData sends "on" or nothing
    status: z.string().optional(),   // FormData sends "on" or nothing
    // Images are handled client-side, not in this action
});

export async function saveProductAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const rawData = Object.fromEntries(formData.entries());
    const validation = productFormSchema.safeParse(rawData);

    if (!validation.success) {
        console.error("Server-side validation failed:", validation.error.flatten());
        return { success: false, error: "La validación de datos en el servidor falló." };
    }
    
    console.log("Product data received and validated on server for product ID:", validation.data.id);
    return { success: true };
}

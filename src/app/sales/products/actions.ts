// src/app/sales/products/actions.ts
"use server";

import { generateProductImage as generateProductImageFlow } from "@/ai/flows/generate-product-image";
import { z } from "zod";

const generateImageSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

// Acción para generar la imagen y devolver el Data URI
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
        // 1. Generar la imagen con Genkit (devuelve data URI)
        const result = await generateProductImageFlow({ hint: validation.data.hint });
        const dataUri = result?.imageUrl;

        if (!dataUri || !dataUri.startsWith('data:image')) {
             throw new Error('La IA no pudo generar una imagen válida.');
        }
        
        // 2. Devolver el Data URI directamente al cliente
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

// Acción simplificada solo para validación en el servidor.
// La lógica de guardado y actualización se maneja en el cliente.
const productFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre es requerido."),
});

export async function saveProductAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const rawData = Object.fromEntries(formData.entries());
    const validation = productFormSchema.safeParse(rawData);

    if (!validation.success) {
        console.error("Server-side validation failed:", validation.error.flatten());
        return { success: false, error: "La validación de datos en el servidor falló." };
    }
    
    // Si la validación pasa, simplemente devolvemos éxito.
    // El cliente se encargará del guardado en localStorage.
    return { success: true };
}

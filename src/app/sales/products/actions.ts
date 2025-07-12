// src/app/sales/products/actions.ts
"use server";

import { generateProductImage as generateProductImageFlow } from "@/ai/flows/generate-product-image";
import { z } from "zod";
import { uploadImage } from "@/lib/uploadGeneratedImage";

const generateImageSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

// Acción para generar la imagen y subirla a Firebase Storage
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
        // 1. Generar la imagen con Genkit (devuelve un data URI)
        const result = await generateProductImageFlow({ hint: validation.data.hint });
        const dataUri = result?.imageUrl;

        if (!dataUri || !dataUri.startsWith('data:image')) {
             throw new Error('La IA no pudo generar una imagen válida.');
        }
        
        // 2. Subir la imagen a Firebase Storage y obtener la URL pública
        const publicUrl = await uploadImage(dataUri);

        // 3. Devolver la URL pública persistente
        return { success: true, data: { imageUrl: publicUrl } };

    } catch (error) {
        console.error("Error en generateProductImageAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
        if (errorMessage.includes("Could not refresh access token")) {
            return { success: false, error: "Error de autenticación con Firebase. Verifica la configuración de la cuenta de servicio." };
        }
        return { success: false, error: errorMessage };
    }
}


// Esta acción es solo para validación del lado del servidor.
// La lógica principal de guardado y estado se maneja en el cliente.
const productFormSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    category: z.string().min(1, "La categoría es requerida."),
    price: z.coerce.number().min(0, "El precio no puede ser negativo."),
    stock: z.coerce.number().min(0, "El stock no puede ser negativo."),
    hint: z.string().optional(),
    image: z.string().optional(),
    gallery: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    status: z.coerce.boolean().optional(),
});

export async function saveProductAction(formData: FormData): Promise<void> {
    const rawData = Object.fromEntries(formData.entries());
    const validation = productFormSchema.safeParse(rawData);

    if (!validation.success) {
        console.error("Server-side validation failed:", validation.error.flatten());
        // En una app real, podrías lanzar un error aquí para que el cliente lo capture.
    }
    
    console.log("Product data received and validated on server for product ID:", validation.success ? validation.data.id : 'unknown');
}

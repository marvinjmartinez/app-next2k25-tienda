// src/app/sales/products/actions.ts
"use server";

import { generateProductImage } from "@/ai/flows/generate-product-image";
import { z } from "zod";

const formSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

export async function generateProductImageAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = formSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors.hint?.[0] || "Entrada inválida."
        };
    }
    
    try {
        // Generate image using the Genkit flow and return the Data URI
        const result = await generateProductImage({ hint: validation.data.hint });
        const { imageUrl: dataUri } = result;

        if (!dataUri || !dataUri.startsWith('data:image')) {
             throw new Error('La IA no pudo generar una imagen válida.');
        }
        
        return { success: true, data: { imageUrl: dataUri } };

    } catch (error) {
        console.error("Error en generateProductImageAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
        return { success: false, error: errorMessage };
    }
}

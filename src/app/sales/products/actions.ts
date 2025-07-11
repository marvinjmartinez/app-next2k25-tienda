// src/app/sales/products/actions.ts
"use server";

import { generateProductImage, GenerateProductImageInput } from "@/ai/flows/generate-product-image";
import { z } from "zod";

const formSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

// NOTE: This is a simulated image generation flow for the demo.
// In a real application, you would upload the generated image (media.url from Genkit)
// to a service like Firebase Storage and get a public URL back.
// Here, we just return a placeholder URL to avoid storing large base64 strings
// in localStorage, which has a limited quota.

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
        // We still call the flow to simulate the generation process and time delay.
        await generateProductImage({ hint: validation.data.hint });
        
        // Instead of returning the large base64 URI, we return a placeholder URL.
        const placeholderUrl = "https://placehold.co/600x400.png";

        return { success: true, data: { imageUrl: placeholderUrl } };

    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
        return { success: false, error: errorMessage };
    }
}

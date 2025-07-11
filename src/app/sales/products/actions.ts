// src/app/sales/products/actions.ts
"use server";

import { generateProductImage } from "@/ai/flows/generate-product-image";
import { z } from "zod";
// Ya no necesitamos firebase aquí para el diagnóstico
// import { storage } from "@/lib/firebase";
// import { ref, uploadString, getDownloadURL } from "firebase/storage";

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
        // Este flujo ahora devuelve una URL de placehold.co
        const result = await generateProductImage({ hint: validation.data.hint });
        const { imageUrl } = result;

        if (!imageUrl) {
             throw new Error('La IA no pudo generar una URL de marcador de posición.');
        }

        // Simplemente devolvemos la URL generada por la IA, sin subirla a Firebase.
        return { success: true, data: { imageUrl: imageUrl } };

    } catch (error) {
        console.error("Error al generar URL de imagen:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la URL.";
        return { success: false, error: errorMessage };
    }
}

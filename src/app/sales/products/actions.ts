// src/app/sales/products/actions.ts
"use server";

import { generateProductImage, GenerateProductImageInput } from "@/ai/flows/generate-product-image";
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
        const result = await generateProductImage({ hint: validation.data.hint });

        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Ocurrió un error inesperado al generar la imagen." };
    }
}

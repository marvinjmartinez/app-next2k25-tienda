// src/app/sales/products/actions.ts
"use server";

import { generateProductImage } from "@/ai/flows/generate-product-image";
import { storage } from "@/lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
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
        // 1. Generate image using the Genkit flow
        const result = await generateProductImage({ hint: validation.data.hint });
        const { imageUrl: dataUri } = result;

        if (!dataUri || !dataUri.startsWith('data:image')) {
             throw new Error('La IA no pudo generar una imagen válida.');
        }

        // 2. Upload the generated image to Firebase Storage
        const fileName = `product_${Date.now()}.png`;
        const storagePath = `distrimin/productos/${fileName}`;
        const storageRef = ref(storage, storagePath);
        
        // Upload the Data URI string
        const uploadResult = await uploadString(storageRef, dataUri, 'data_url');
        
        // 3. Get the public download URL
        const downloadURL = await getDownloadURL(uploadResult.ref);

        // 4. Return the public URL to the client
        return { success: true, data: { imageUrl: downloadURL } };

    } catch (error) {
        console.error("Error en generateProductImageAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar o guardar la imagen.";
        return { success: false, error: errorMessage };
    }
}

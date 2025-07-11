// src/app/sales/products/actions.ts
"use server";

import { generateProductImage } from "@/ai/flows/generate-product-image";
import { z } from "zod";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
        const { imageUrl } = result; // This is a base64 data URI

        if (!imageUrl.startsWith('data:image/')) {
            throw new Error('La imagen generada no es un Data URI válido.');
        }

        // 1. Convert Data URI to a Buffer
        const base64Data = imageUrl.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // 2. Create a reference in Firebase Storage
        const storageRef = ref(storage, `products/${Date.now()}-${validation.data.hint.replace(/\s+/g, '-')}.png`);

        // 3. Define metadata
        const metadata = {
          contentType: 'image/png',
        };

        // 4. Upload the Buffer using uploadBytes
        await uploadBytes(storageRef, imageBuffer, metadata);
        
        // 5. Get the public download URL
        const downloadURL = await getDownloadURL(storageRef);

        return { success: true, data: { imageUrl: downloadURL } };

    } catch (error) {
        console.error("Error al generar o subir imagen:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
        return { success: false, error: errorMessage };
    }
}

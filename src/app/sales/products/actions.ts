// src/app/sales/products/actions.ts
"use server";

import { generateProductImage } from "@/ai/flows/generate-product-image";
import { z } from "zod";
import { bucket } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

// Función para subir una imagen en formato Data URI (base64) a Firebase Storage
async function uploadImageFromDataUri(dataUri: string): Promise<string> {
    const base64Data = dataUri.split(';base64,').pop();
    if (!base64Data) {
        throw new Error("Invalid Data URI format.");
    }
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generar un nombre de archivo único
    const filename = `distrimin/imagenes/productos/${uuidv4()}.png`;
    const file = bucket.file(filename);
    
    // Subir el buffer al bucket
    await file.save(buffer, {
        metadata: {
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000', // Cache por 1 año
        },
    });

    // Hacer el archivo público
    await file.makePublic();

    // Devolver la URL pública del archivo
    return file.publicUrl();
}


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
        
        // 2. Upload to Firebase Storage using the admin SDK
        const downloadURL = await uploadImageFromDataUri(dataUri);
        
        // 3. Return the public URL from Firebase Storage
        return { success: true, data: { imageUrl: downloadURL } };

    } catch (error) {
        console.error("Error en generateProductImageAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al generar la imagen.";
        return { success: false, error: errorMessage };
    }
}

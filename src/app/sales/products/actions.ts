{"use server";

import { generateProductImage } from "@/ai/flows/generate-product-image";
import { uploadGeneratedImage } from "@/lib/uploadGeneratedImage";
import { z } from "zod";

const generateImageSchema = z.object({
    hint: z.string().min(3, "La pista debe tener al menos 3 caracteres."),
});

export async function generateProductImageAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = generateImageSchema.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors.hint?.[0] || "Entrada inválida."
        };
    }
    
    try {
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


const productFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre es requerido."),
    description: z.string().optional(),
    category: z.string().min(1, "La categoría es requerida."),
    price: z.coerce.number().min(0, "El precio no puede ser negativo."),
    stock: z.coerce.number().min(0, "El stock no puede ser negativo."),
    hint: z.string(),
    featured: z.coerce.boolean(),
    status: z.coerce.boolean(),
    image: z.string(), // Puede ser un data URI o una URL http
    gallery: z.string(), // Un string JSON de URLs
});

export async function saveProductAction(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validation = productFormSchema.safeParse(rawData);

    if (!validation.success) {
        return { success: false, error: "Datos del formulario inválidos." };
    }

    try {
        const productData = validation.data;
        const galleryUrls: string[] = JSON.parse(productData.gallery || "[]");

        // Subir imagen principal y de galería si son data URIs
        const mainImageUrl = await uploadGeneratedImage(productData.image);
        const uploadedGalleryUrls = await Promise.all(
            galleryUrls.map(url => uploadGeneratedImage(url))
        );
        
        const finalProductData = {
            ...productData,
            image: mainImageUrl,
            gallery: uploadedGalleryUrls,
            price: Number(productData.price),
            stock: Number(productData.stock),
            status: productData.status ? 'activo' : 'inactivo'
        };

        // En una app real, aquí guardarías finalProductData en tu base de datos.
        // Por ahora, solo devolvemos los datos procesados para actualizar el estado del cliente.
        
        return { success: true, data: finalProductData };

    } catch (error) {
        console.error("Error en saveProductAction:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar el producto.";
        return { success: false, error: errorMessage };
    }
}

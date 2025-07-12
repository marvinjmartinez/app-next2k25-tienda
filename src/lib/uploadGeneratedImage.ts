// src/lib/uploadGeneratedImage.ts
import { bucket } from "@/lib/firebase-admin";
import { v4 as uuidv4 } from "uuid";

/**
 * Sube una imagen en formato data URI a Firebase Storage y la hace pública.
 * @param dataUri La imagen codificada como data URI (ej: 'data:image/png;base64,iVBORw...').
 * @returns La URL pública y permanente de la imagen subida.
 */
export async function uploadImage(dataUri: string): Promise<string> {
    const base64EncodedString = dataUri.split(";base64,").pop();
    if (!base64EncodedString) {
        throw new Error("Invalid data URI: no base64 content found.");
    }
  
    // Extraer el tipo de contenido (MIME type) del data URI
    const mimeType = dataUri.substring(dataUri.indexOf(":") + 1, dataUri.indexOf(";"));
    if (!mimeType.startsWith("image/")) {
        throw new Error("Invalid data URI: MIME type is not an image.");
    }

    const buffer = Buffer.from(base64EncodedString, "base64");

    // Generar un nombre de archivo único para evitar colisiones
    const filename = `products/images/${uuidv4()}`;
    const file = bucket.file(filename);

    await file.save(buffer, {
        metadata: { 
            contentType: mimeType,
            // Establecer una política de caché larga para las imágenes
            cacheControl: "public, max-age=31536000",
        },
        // Hacer el archivo públicamente accesible
        public: true,
    });
    
    // Devolver la URL pública del archivo
    // El formato puede ser `https://storage.googleapis.com/[BUCKET_NAME]/[FILE_NAME]`
    // o `file.publicUrl()` dependiendo de la versión del SDK. `publicUrl()` es más seguro.
    return file.publicUrl();
}

// src/lib/uploadGeneratedImage.ts
import { bucket } from "@/lib/firebase-admin";
import { v4 as uuidv4 } from "uuid";

/**
 * Sube una imagen en formato data URI a Firebase Storage y la hace pública.
 * @param dataUri La imagen como una cadena data URI (ej: 'data:image/png;base64,...').
 * @returns La URL pública de la imagen subida.
 */
export async function uploadGeneratedImage(dataUri: string): Promise<string> {
  if (!bucket) {
    throw new Error("El bucket de Firebase Storage no está configurado. Verifica las variables de entorno.");
  }
  
  // Extraer el contenido base64 y el tipo de contenido
  const match = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("El formato del data URI es inválido.");
  }
  
  const contentType = match[1]; // ej: "image/png"
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");

  // Generar un nombre de archivo único
  const filename = `products/${uuidv4()}.png`;
  const file = bucket.file(filename);

  // Guardar el buffer en Firebase Storage
  await file.save(buffer, {
    metadata: { 
      contentType: contentType,
      // Cachear la imagen por un año en el navegador
      cacheControl: "public, max-age=31536000",
    },
    public: true, // Hacer el archivo públicamente accesible
  });

  // Devolver la URL pública del archivo
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

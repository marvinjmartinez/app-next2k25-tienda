{// src/lib/uploadGeneratedImage.ts
import { bucket } from "@/lib/firebase-admin";
import { v4 as uuidv4 } from "uuid";

export async function uploadGeneratedImage(dataUri: string): Promise<string> {
  if (!dataUri || !dataUri.startsWith('data:image')) {
    // If it's already a public URL, just return it.
    if (dataUri && dataUri.startsWith('https://')) {
        return dataUri;
    }
    throw new Error('Formato inválido de imagen para subir.');
  }

  const base64Data = dataUri.split(';base64,').pop();
  if (!base64Data) {
      throw new Error('No se encontraron datos en base64 en el Data URI.');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  const fileExtension = dataUri.split(';')[0].split('/')[1];
  const filename = `distrimin/imagenes/productos/${uuidv4()}.${fileExtension}`;
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: {
      contentType: `image/${fileExtension}`,
      cacheControl: 'public, max-age=31536000',
    },
    public: true, // Esto hace que la URL sea accesible públicamente
  });

  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

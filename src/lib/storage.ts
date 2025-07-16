'use server';

import { Storage } from "@google-cloud/storage";

// Validar que el bucket de almacenamiento exista en las variables de entorno
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  // Comentamos el error para no bloquear la app si se usa file-manager.ts
  // throw new Error("La variable de entorno FIREBASE_STORAGE_BUCKET no está definida.");
  console.warn("ADVERTENCIA: La variable de entorno FIREBASE_STORAGE_BUCKET no está definida. La subida directa a GCS no funcionará.");
}

const bucketName = process.env.FIREBASE_STORAGE_BUCKET!;
const folder = "product-images"; // Se puede mantener una carpeta por defecto

// Inicializar Storage. El SDK buscará automáticamente las credenciales
// en el entorno de ejecución (Application Default Credentials).
const storage = new Storage();
const bucket = storage.bucket(bucketName);

export async function subirImagenDesdeBase64(dataUri: string): Promise<string> {
  const base64Data = dataUri.split(';base64,').pop();
  if (!base64Data) {
      throw new Error("Data URI inválido o no contiene datos base64.");
  }
  const buffer = Buffer.from(base64Data, 'base64');

  const filename = `${folder}/${Date.now()}.png`;
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: {
      contentType: "image/png",
      cacheControl: "public, max-age=31536000",
    },
    public: true, // Esto hace que el archivo sea públicamente accesible
  });

  // Devuelve la URL pública del archivo.
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

'use server';

import { Storage } from "@google-cloud/storage";

// Validar que las variables de entorno existan
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error("La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida.");
}
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("La variable de entorno FIREBASE_STORAGE_BUCKET no está definida.");
}

let credentials;
try {
  credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} catch (error) {
  console.error("Error al parsear FIREBASE_SERVICE_ACCOUNT_JSON:", error);
  throw new Error("El formato de FIREBASE_SERVICE_ACCOUNT_JSON es inválido.");
}

// Reemplazar los saltos de línea literales
if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
}

const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
const folder = process.env.FIREBASE_STORAGE_FOLDER || "product-images";

const storage = new Storage({ credentials });
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
    public: true,
  });

  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

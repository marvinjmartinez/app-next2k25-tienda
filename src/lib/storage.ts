'use server';

import { Storage } from "@google-cloud/storage";

// Validar que las variables de entorno existan
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error("La variable de entorno FIREBASE_PROJECT_ID no está definida.");
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
    throw new Error("La variable de entorno FIREBASE_CLIENT_EMAIL no está definida.");
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("La variable de entorno FIREBASE_PRIVATE_KEY no está definida.");
}
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("La variable de entorno FIREBASE_STORAGE_BUCKET no está definida.");
}

// Construir el objeto de credenciales a partir de variables de entorno individuales
const credentials = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID, // Opcional, pero bueno tenerlo
    private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID, // Opcional
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

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

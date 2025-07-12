// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Verifica si la aplicación de Firebase Admin ya ha sido inicializada
if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`El archivo de credenciales de Firebase no se encontró en la ruta: ${serviceAccountPath}. Asegúrate de que el archivo 'firebase-service-account.json' exista en la raíz de tu proyecto y contenga las credenciales correctas.`);
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (!storageBucket) {
      throw new Error('La variable de entorno FIREBASE_STORAGE_BUCKET no está definida. Por favor, verifica tu archivo .env.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Error de Inicialización de Firebase Admin:', error);
    if (error.message.includes('parse')) {
         throw new Error(`No se pudo inicializar Firebase Admin SDK: Error al analizar el archivo 'firebase-service-account.json'. Asegúrate de que es un archivo JSON válido.`);
    }
    if (error.message.includes('private key') || error.message.includes('PEM')) {
      throw new Error(`Falló la inicialización de Firebase Admin SDK debido a un problema con la clave privada en 'firebase-service-account.json'.`);
    }
    throw new Error(`Falló la inicialización de Firebase Admin SDK: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

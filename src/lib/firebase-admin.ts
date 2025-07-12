// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env en la raíz del proyecto
dotenv.config();

// Verifica si la aplicación de Firebase Admin ya ha sido inicializada
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountJson || !storageBucket) {
    const missingVars = [
      !serviceAccountJson && "FIREBASE_SERVICE_ACCOUNT_JSON",
      !storageBucket && "FIREBASE_STORAGE_BUCKET"
    ].filter(Boolean).join(', ');

    throw new Error(`Firebase environment variables are not set. Missing: ${missingVars}. Please check your .env file in the project root.`);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', error);
    throw new Error(`Failed to initialize Firebase Admin SDK: Error parsing FIREBASE_SERVICE_ACCOUNT_JSON. Please ensure it's a valid JSON string (usually starts and ends with {}).`);
  }

  try {
    // Inicializa la aplicación de Firebase Admin con las credenciales explícitas
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // Lanza un error más específico si el problema es con la clave privada
    if (error.message.includes('private key')) {
        throw new Error(`Failed to initialize Firebase Admin SDK due to a private key issue. Please ensure FIREBASE_SERVICE_ACCOUNT_JSON in your .env file contains the correct, unescaped private key.`);
    }
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

// Exporta el bucket de almacenamiento para ser utilizado en otras partes de la aplicación
const bucket = admin.storage().bucket();

export { bucket };
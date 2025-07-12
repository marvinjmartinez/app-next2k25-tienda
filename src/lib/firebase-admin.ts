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
      !storageBucket && "FIREBASE_STORAGE_BUCKET (en next.config.js)"
    ].filter(Boolean).join(', ');

    throw new Error(`Firebase environment variables are not set. Missing: ${missingVars}. Please check your .env file in the project root.`);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', error);
    throw new Error(`Failed to initialize Firebase Admin SDK: Error parsing FIREBASE_SERVICE_ACCOUNT_JSON. Please ensure it's a valid JSON string wrapped in single quotes in your .env file.`);
  }
  
  // Solución definitiva para el error "Invalid PEM": reemplazar los saltos de línea escapados.
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // Lanza un error más específico si el problema es con la clave privada
    if (error.message.includes('private key') || error.message.includes('PEM')) {
        throw new Error(`Failed to initialize Firebase Admin SDK due to a private key issue. This usually happens if the JSON in FIREBASE_SERVICE_ACCOUNT_JSON is not correctly copied and pasted inside the single quotes.`);
    }
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

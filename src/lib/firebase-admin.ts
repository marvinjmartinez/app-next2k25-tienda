// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env en la raíz del proyecto
dotenv.config();

// Verifica si la aplicación de Firebase Admin ya ha sido inicializada
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  // La clave privada a menudo causa problemas con los saltos de línea en .env.
  // Esta línea reemplaza los caracteres de escape '\\n' por saltos de línea reales '\n'.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  // Valida que todas las variables de entorno necesarias estén presentes
  if (!projectId || !privateKey || !clientEmail || !storageBucket) {
    const missingVars = [
      !projectId && "FIREBASE_PROJECT_ID",
      !privateKey && "FIREBASE_PRIVATE_KEY",
      !clientEmail && "FIREBASE_CLIENT_EMAIL",
      !storageBucket && "FIREBASE_STORAGE_BUCKET"
    ].filter(Boolean).join(', ');

    throw new Error(`Firebase environment variables are not set. Missing: ${missingVars}. Please check your .env file in the project root.`);
  }

  try {
    // Inicializa la aplicación de Firebase Admin con las credenciales explícitas
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // Lanza un error más específico si el problema es con la clave privada
    if (error.message.includes('private key')) {
        throw new Error(`Failed to initialize Firebase Admin SDK due to a private key issue. Please ensure FIREBASE_PRIVATE_KEY in your .env file is correctly formatted, including the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----\\n headers.`);
    }
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

// Exporta el bucket de almacenamiento para ser utilizado en otras partes de la aplicación
const bucket = admin.storage().bucket();

export { bucket };

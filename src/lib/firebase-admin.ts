// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env en la raíz del proyecto
dotenv.config();

// Verifica si la aplicación de Firebase Admin ya ha sido inicializada
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountJson) {
    throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida. Por favor, verifica tu archivo .env.');
  }
   if (!storageBucket) {
    throw new Error('La variable de entorno FIREBASE_STORAGE_BUCKET no está definida. Por favor, verifica tu archivo .env.');
  }

  // Saneamiento del nombre del bucket: remover prefijo 'gs://' y sufijo final si existen.
  if (storageBucket.startsWith('gs://')) {
    storageBucket = storageBucket.substring(5);
  }
  if (storageBucket.endsWith('/')) {
    storageBucket = storageBucket.slice(0, -1);
  }
  // También remover el sufijo de URL que a veces se copia por error
  const firebaseUrlSuffix = '.firebasestorage.app';
  if (storageBucket.endsWith(firebaseUrlSuffix)) {
      storageBucket = storageBucket.slice(0, -firebaseUrlSuffix.length);
  }
  
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error('Error al analizar FIREBASE_SERVICE_ACCOUNT_JSON:', error);
    throw new Error(`No se pudo inicializar Firebase Admin SDK: Error al analizar FIREBASE_SERVICE_ACCOUNT_JSON. Asegúrate de que es una cadena JSON válida, generalmente comienza y termina con {}.`);
  }
  
  // SOLUCIÓN DEFINITIVA: Reemplaza los caracteres de nueva línea escapados (\\n) por saltos de línea reales (\n)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Error de Inicialización de Firebase Admin:', error);
    // Lanza un error más específico si el problema es con la clave privada
    if (error.message.includes('private key') || error.message.includes('PEM')) {
        throw new Error(`Falló la inicialización de Firebase Admin SDK debido a un problema con la clave privada. Esto usualmente sucede si el JSON en FIREBASE_SERVICE_ACCOUNT_JSON no fue copiado y pegado correctamente dentro de las comillas simples.`);
    }
    throw new Error(`Falló la inicialización de Firebase Admin SDK: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Verifica si la aplicación de Firebase Admin ya ha sido inicializada
if (!admin.apps.length) {
  // Carga las variables de entorno
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountString) {
    throw new Error(
      "La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida. Asegúrate de que tu archivo .env la contiene."
    );
  }

  if (!storageBucket) {
    throw new Error(
      "La variable de entorno FIREBASE_STORAGE_BUCKET no está definida. Por favor, verifica tu archivo .env."
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);

    // **LA CORRECCIÓN CRUCIAL**: Reemplaza los saltos de línea escapados en la clave privada.
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Error de Inicialización de Firebase Admin:', error);
    let detailedError = `Falló la inicialización de Firebase Admin SDK: ${error.message}.`;
    if (error.message.includes('parse')) {
      detailedError = `Error al analizar el JSON de FIREBASE_SERVICE_ACCOUNT_JSON en tu .env. Asegúrate de que es un JSON válido y está entre comillas simples.`;
    }
    throw new Error(detailedError);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

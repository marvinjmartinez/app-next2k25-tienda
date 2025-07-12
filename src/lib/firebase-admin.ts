// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import { config } from 'dotenv';

config(); // Carga las variables de entorno

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountString) {
      throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON no está definida.');
    }

    const serviceAccount = JSON.parse(serviceAccountString);

    // **Corrección Definitiva**: Reemplaza los escapes de nueva línea literales por saltos de línea reales.
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    // Deriva el nombre del bucket desde el project_id, que es el método estándar.
    const bucketName = `${serviceAccount.project_id}.appspot.com`;
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName,
    });
    
  } catch (error: any) {
    console.error('Error de Inicialización de Firebase Admin:', error);
    let detailedError = `Falló la inicialización de Firebase Admin SDK: ${error.message}.`;

    if (error.message.includes('FIREBASE_SERVICE_ACCOUNT_JSON')) {
        detailedError = "Asegúrate de que la variable FIREBASE_SERVICE_ACCOUNT_JSON en tu archivo .env contenga el JSON completo de tu cuenta de servicio."
    } else if (error instanceof SyntaxError) {
      detailedError = `Error al analizar el contenido de FIREBASE_SERVICE_ACCOUNT_JSON. Asegúrate de que es un JSON válido y está entre comillas simples.`;
    } else if (error.message.includes("private_key")) {
      detailedError = `El error está en la 'private_key' dentro de tus credenciales de Firebase. Verifica que esté completa y bien formada en tu .env.`
    }
    
    throw new Error(detailedError);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(
        'El archivo firebase-service-account.json no se encontró en la raíz del proyecto. Por favor, asegúrate de crearlo y pegar el contenido de tus credenciales de Firebase.'
      );
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Deriva el nombre del bucket desde el project_id, que es el método estándar.
    const bucketName = `${serviceAccount.project_id}.appspot.com`;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName,
    });
  } catch (error: any) {
    console.error('Error de Inicialización de Firebase Admin:', error);
    let detailedError = `Falló la inicialización de Firebase Admin SDK: ${error.message}.`;
    if (error.code === 'ENOENT') {
      detailedError = `No se pudo encontrar el archivo 'firebase-service-account.json'. Asegúrate de que está en la raíz del proyecto.`;
    } else if (error instanceof SyntaxError) {
      detailedError = `Error al analizar el contenido de 'firebase-service-account.json'. Asegúrate de que es un JSON válido.`;
    }
    throw new Error(detailedError);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

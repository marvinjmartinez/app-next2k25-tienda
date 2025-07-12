// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import serviceAccount from '../../firebase-service-account.json';

if (!admin.apps.length) {
  try {
    // Deriva el nombre del bucket desde el project_id, que es el método estándar.
    const bucketName = `${serviceAccount.project_id}.appspot.com`;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName,
    });
    
  } catch (error: any) {
    console.error('Error de Inicialización de Firebase Admin:', error);
    let detailedError = `Falló la inicialización de Firebase Admin SDK. Asegúrate de que el archivo 'firebase-service-account.json' en la raíz del proyecto es correcto y contiene el JSON de tu cuenta de servicio.`;
    
    throw new Error(detailedError);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

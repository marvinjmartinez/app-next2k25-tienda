// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Validador de credenciales para proporcionar errores más claros.
const validateServiceAccount = (credentials: any) => {
    if (!credentials || Object.keys(credentials).length === 0) {
        throw new Error("El archivo 'firebase-service-account.json' está vacío o no es un JSON válido.");
    }
    if (!credentials.project_id) {
        throw new Error("La credencial en 'firebase-service-account.json' no contiene un 'project_id'.");
    }
    if (!credentials.client_email) {
        throw new Error("La credencial en 'firebase-service-account.json' no contiene un 'client_email'.");
    }
    if (!credentials.private_key) {
        throw new Error("La credencial en 'firebase-service-account.json' no contiene una 'private_key'.");
    }
    if (!credentials.private_key.startsWith('-----BEGIN PRIVATE KEY-----') || !credentials.private_key.endsWith('-----END PRIVATE KEY-----\n')) {
        throw new Error("El formato de la 'private_key' en 'firebase-service-account.json' es incorrecto. Asegúrate de copiarla exactamente como se proporciona, incluyendo los encabezados y pies de página.");
    }
    return true;
}

if (!admin.apps.length) {
  try {
    // Determina la ruta absoluta al archivo de credenciales.
    const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
    
    // Verifica si el archivo existe antes de intentar leerlo.
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error("El archivo 'firebase-service-account.json' no se encuentra en la raíz del proyecto. Por favor, asegúrate de que el archivo existe y has pegado tus credenciales en él.");
    }

    // Lee y parsea el archivo de credenciales.
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Valida el contenido del archivo de credenciales.
    validateServiceAccount(serviceAccount);
    
    // Deriva el nombre del bucket desde el project_id.
    const bucketName = `${serviceAccount.project_id}.appspot.com`;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName,
    });
    
  } catch (error: any) {
    // Relanza el error original para que sea visible.
    console.error('Error de Inicialización de Firebase Admin:', error.message);
    throw error;
  }
}

const bucket = admin.storage().bucket();

export { bucket };

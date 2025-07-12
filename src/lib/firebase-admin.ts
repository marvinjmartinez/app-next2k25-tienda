// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// Definir una interfaz para las credenciales para mayor seguridad de tipo.
interface ServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

if (!admin.apps.length) {
  try {
    const credentialsJson = process.env.FIREBASE_CREDENTIALS;
    
    if (!credentialsJson) {
      throw new Error("La variable de entorno FIREBASE_CREDENTIALS no está definida. Por favor, pégala en tu archivo .env.");
    }

    const serviceAccount: ServiceAccount = JSON.parse(credentialsJson);

    if (!serviceAccount.private_key) {
      throw new Error("Las credenciales en FIREBASE_CREDENTIALS no contienen una 'private_key'.");
    }

    // --- LA SOLUCIÓN DEFINITIVA ---
    // Reemplaza explícitamente los caracteres de escape '\\n' por saltos de línea reales '\n'.
    // Esto corrige el formato de la clave privada que se corrompe al ser leída desde el .env.
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });
    
  } catch (error: any) {
    console.error('Error Crítico de Inicialización de Firebase Admin:', error.message);
    // Relanzar el error para detener la ejecución si la configuración es incorrecta.
    throw new Error(`Fallo al inicializar Firebase Admin: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

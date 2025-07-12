
// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// --- INICIALIZACIÓN DE FIREBASE ADMIN ---

// Esta función se asegura de que solo inicialicemos la app una vez.
function initializeFirebaseAdmin() {
  // 1. Lee la variable de entorno codificada en Base64.
  const base64Credentials = process.env.FIREBASE_CREDENTIALS_BASE64;

  if (!base64Credentials) {
    throw new Error(
      'Error Crítico: La variable de entorno FIREBASE_CREDENTIALS_BASE64 no está definida en el archivo .env. ' +
      'Por favor, codifica tu archivo firebase-service-account.json a Base64 y pégalo en el .env.'
    );
  }

  try {
    // 2. Decodifica la cadena de Base64 para obtener el JSON original.
    const credentialsJson = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(credentialsJson);

    // 3. Valida que las credenciales decodificadas sean válidas.
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Las credenciales decodificadas desde Base64 son inválidas o están incompletas.');
    }

    // 4. Inicializa la app de Firebase con las credenciales decodificadas.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });

  } catch (error: any) {
    console.error("ERROR CRÍTICO AL INICIALIZAR FIREBASE ADMIN:", error.message);
    // Añade más contexto al error para facilitar la depuración.
    if (error.message.includes('Unexpected token')) {
        throw new Error(`Error al parsear las credenciales JSON desde Base64. Asegúrate de que la cadena en FIREBASE_CREDENTIALS_BASE64 sea correcta. Detalle: ${error.message}`);
    }
    throw error;
  }
}

// Solo inicializa si no hay otras apps de Firebase corriendo.
if (!admin.apps.length) {
  initializeFirebaseAdmin();
}

const bucket = admin.storage().bucket();

export { bucket };

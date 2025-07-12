// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// --- PASO 1: PEGA TUS CREDENCIALES AQUÍ ---
// Reemplaza los valores de ejemplo con los de tu archivo JSON de Firebase.
// Asegúrate de copiar el contenido exacto.
const serviceAccount = {
  type: "service_account",
  // Pega aquí tu project_id
  project_id: "TU_PROJECT_ID_AQUI", 
  // Pega aquí tu private_key_id
  private_key_id: "TU_PRIVATE_KEY_ID_AQUI",
  // Pega tu clave privada ENTRE las comillas simples.
  // Es crucial que los saltos de línea (\n) se mantengan.
  private_key: `-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_CON_SALTOS_DE_LINEA_AQUI\n-----END PRIVATE KEY-----\n`,
  // Pega aquí tu client_email
  client_email: "TU_CLIENT_EMAIL_AQUI",
  client_id: "TU_CLIENT_ID_AQUI",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  // Pega aquí tu client_x509_cert_url
  client_x509_cert_url: "TU_CLIENT_X509_CERT_URL_AQUI",
  universe_domain: "googleapis.com",
};

// --- VALIDACIÓN DE CREDENCIALES ---
if (serviceAccount.project_id === "TU_PROJECT_ID_AQUI" || !serviceAccount.project_id) {
    throw new Error(
      `Error Crítico: Las credenciales en 'src/lib/firebase-admin.ts' no han sido reemplazadas. ` +
      `Por favor, edita el archivo y pega los valores de tu cuenta de servicio de Firebase.`
    );
}

// --- INICIALIZACIÓN DE FIREBASE ADMIN ---
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });
  } catch (error: any) {
    console.error('Error Crítico de Inicialización de Firebase Admin:', error.message);
    throw new Error(`Fallo al inicializar Firebase Admin: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

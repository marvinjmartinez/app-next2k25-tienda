// src/lib/firebase-admin.ts
import admin from 'firebase-admin';

// --- INICIALIZACIÓN DE FIREBASE ADMIN ---

if (!admin.apps.length) {
  try {
    // --- PASO 1: PEGA TUS CREDENCIALES AQUÍ ---
    // Reemplaza los valores de ejemplo con los de tu archivo JSON de Firebase.
    const serviceAccount = {
      type: "service_account",
      project_id: "TU_PROJECT_ID_AQUI", // <-- REEMPLAZA
      private_key_id: "TU_PRIVATE_KEY_ID_AQUI", // <-- REEMPLAZA
      private_key: "-----BEGIN PRIVATE KEY-----\nTU_CLAVE_PRIVADA_SIN_LAS_COMILLAS_AQUI\n-----END PRIVATE KEY-----\n", // <-- REEMPLAZA
      client_email: "TU_CLIENT_EMAIL_AQUI", // <-- REEMPLAZA
      client_id: "TU_CLIENT_ID_AQUI", // <-- REEMPLAZA
      auth_uri: "https://accounts.google.com/o/oauth2/auth", // <-- NORMALMENTE NO CAMBIA
      token_uri: "https://oauth2.googleapis.com/token", // <-- NORMALMENTE NO CAMBIA
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs", // <-- NORMALMENTE NO CAMBIA
      client_x509_cert_url: "TU_CERT_URL_AQUI" // <-- REEMPLAZA
    };

    // --- VALIDACIÓN DE CREDENCIALES ---
    if (serviceAccount.project_id === "TU_PROJECT_ID_AQUI" || !serviceAccount.project_id) {
        throw new Error(
          `Error Crítico: Las credenciales en 'src/lib/firebase-admin.ts' no han sido reemplazadas. ` +
          `Por favor, edita el archivo y pega los valores de tu cuenta de servicio de Firebase.`
        );
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });

  } catch (error: any) {
    console.error("ERROR CRÍTICO AL INICIALIZAR FIREBASE ADMIN:", error.message);
    throw error; // Vuelve a lanzar el error para que sea visible
  }
}

const bucket = admin.storage().bucket();

export { bucket };

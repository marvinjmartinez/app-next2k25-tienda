// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let serviceAccount: any;

try {
  // Construye la ruta al archivo de credenciales en la raíz del proyecto
  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
  
  // Verifica si el archivo existe
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Error Crítico: No se encontró el archivo de credenciales en la ruta: ${serviceAccountPath}. ` +
      `Por favor, asegúrate de que el archivo 'firebase-service-account.json' exista en la raíz de tu proyecto.`
    );
  }
  
  const serviceAccountFileContent = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(serviceAccountFileContent);

  // Validación de los campos esenciales dentro del JSON
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error(
      'Error Crítico: El archivo "firebase-service-account.json" está incompleto. ' +
      'Asegúrate de que contenga los campos "project_id", "client_email" y "private_key". ' +
      'Por favor, copia y pega el contenido completo del JSON que descargaste de Firebase.'
    );
  }

} catch (error: any) {
  if (error instanceof SyntaxError) {
      throw new Error(
      'Error Crítico: El archivo "firebase-service-account.json" no es un JSON válido. ' +
      'Por favor, revisa que el contenido esté copiado correctamente desde el archivo original de Firebase.'
    );
  }
  // Re-lanzar otros errores (como el de archivo no encontrado)
  throw error;
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
    // Añade más contexto al error de JWT
    if (error.message.includes('Invalid JWT signature')) {
       throw new Error(`Fallo al inicializar Firebase Admin: ${error.message}. Esto casi siempre se debe a un problema de formato en la 'private_key' dentro de tu archivo 'firebase-service-account.json'. Asegúrate de que los saltos de línea (\\n) no se hayan escapado incorrectamente.`);
    }
    throw new Error(`Fallo al inicializar Firebase Admin: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// --- INICIALIZACIÓN DE FIREBASE ADMIN ---

if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(
        `Error Crítico: No se encontró el archivo de credenciales en la ruta: ${serviceAccountPath}. ` +
        `Por favor, asegúrate de que el archivo 'firebase-service-account.json' exista en la raíz de tu proyecto.`
      );
    }
    
    const serviceAccountFileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    if (!serviceAccountFileContent.trim()) {
        throw new Error(
            `Error Crítico: El archivo 'firebase-service-account.json' está vacío. ` +
            `Por favor, copia y pega el contenido completo del JSON de tu cuenta de servicio de Firebase.`
        );
    }

    const serviceAccount = JSON.parse(serviceAccountFileContent);

    // --- VALIDACIÓN Y CORRECCIÓN DE CREDENCIALES ---
    if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
        throw new Error(
        'Error Crítico: El archivo "firebase-service-account.json" está incompleto o mal formado. ' +
        'Asegúrate de que contenga los campos "project_id", "client_email" y "private_key". ' +
        'Por favor, copia y pega el contenido completo del JSON que descargaste de Firebase.'
      );
    }

    // *** LA CORRECCIÓN DEFINITIVA ***
    // Reemplaza explícitamente '\\n' por '\n' en la clave privada.
    // Esto repara la clave sin importar cómo fue pegada en el archivo.
    const correctedPrivateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        ...serviceAccount,
        private_key: correctedPrivateKey, // Usamos la clave corregida
      }),
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });

  } catch (error: any) {
    if (error instanceof SyntaxError) {
        throw new Error(
        'Error Crítico: El archivo "firebase-service-account.json" no es un JSON válido. ' +
        'Por favor, revisa que el contenido esté copiado correctamente desde el archivo original de Firebase.'
      );
    }
    // Re-lanzar otros errores
    throw error;
  }
}

const bucket = admin.storage().bucket();

export { bucket };

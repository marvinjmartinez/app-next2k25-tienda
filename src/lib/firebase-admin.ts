// src/lib/firebase-admin.ts
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// --- VALIDACIÓN DE CREDENCIALES ---
const SERVICE_ACCOUNT_FILE = 'firebase-service-account.json';
const serviceAccountPath = path.join(process.cwd(), SERVICE_ACCOUNT_FILE);

// 1. Verificar si el archivo existe.
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `Error Crítico: El archivo de credenciales '${SERVICE_ACCOUNT_FILE}' no se encontró en la raíz del proyecto. ` +
    `Por favor, asegúrate de que el archivo exista y contenga las credenciales de tu cuenta de servicio de Firebase.`
  );
}

// 2. Leer e intentar parsear el JSON.
let serviceAccount;
try {
  const fileContents = fs.readFileSync(serviceAccountPath, 'utf8');
  if (!fileContents.trim()) {
    throw new Error(`El archivo '${SERVICE_ACCOUNT_FILE}' está vacío.`);
  }
  serviceAccount = JSON.parse(fileContents);
} catch (error: any) {
  throw new Error(
    `Error Crítico: No se pudo parsear el archivo '${SERVICE_ACCOUNT_FILE}'. ` +
    `Asegúrate de que es un archivo JSON válido. Error original: ${error.message}`
  );
}

// 3. Validar los campos necesarios dentro del JSON.
const requiredFields = ['project_id', 'client_email', 'private_key'];
for (const field of requiredFields) {
  if (!serviceAccount[field]) {
    throw new Error(
      `Error Crítico: El archivo '${SERVICE_ACCOUNT_FILE}' es inválido. ` +
      `Falta el campo requerido: '${field}'.`
    );
  }
}

// 4. *** CORRECCIÓN EXPLÍCITA DE LA CLAVE PRIVADA ***
// Este es el paso crucial. Reemplaza las secuencias de escape '\\n' por saltos de línea reales '\n'.
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');


// --- INICIALIZACIÓN DE FIREBASE ADMIN ---
if (!admin.apps.length) {
  try {
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

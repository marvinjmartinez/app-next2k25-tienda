// src/lib/firebase-admin.ts
import { initializeApp, cert, getApps, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount: ServiceAccount = {
  projectId: process.env.GCLOUD_PROJECT,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Leer el nombre del bucket directamente de la variable de entorno
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

// Inicializar la app de Firebase solo si no se ha hecho antes
// y si las credenciales y el bucket están presentes.
if (!getApps().length) {
    if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail && storageBucket) {
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: storageBucket,
        });
    } else {
        console.warn("Firebase Admin SDK not initialized. Missing credentials or storage bucket configuration in environment variables.");
    }
}

// Obtener el bucket solo si la inicialización fue exitosa
const bucket = getApps().length ? getStorage().bucket() : null;

export { bucket };

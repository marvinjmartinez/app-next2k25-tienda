// src/lib/firebase-admin.ts
import { initializeApp, cert, getApps, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Variables de entorno para las credenciales de la cuenta de servicio
// Estas serán proporcionadas por el entorno de Firebase App Hosting
const serviceAccount: ServiceAccount = {
  projectId: process.env.GCLOUD_PROJECT,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Obtener el nombre del bucket desde las variables de entorno
const storageBucket = process.env.GCLOUD_PROJECT ? `${process.env.GCLOUD_PROJECT}.appspot.com` : undefined;

// Inicializar la app de Firebase solo si no se ha hecho antes
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: storageBucket,
  });
}

const bucket = storageBucket ? getStorage().bucket() : null;

export { bucket };

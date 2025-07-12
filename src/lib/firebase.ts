// src/lib/firebase.ts
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Usar esta configuración para el entorno de servidor (Firebase Studio / App Hosting)
// `applicationDefault` usa las credenciales del entorno automáticamente.
const firebaseConfig = {
  credential: applicationDefault(),
  storageBucket: "distrimnin-tienda.appspot.com",
};

// Inicializar la app de Firebase Admin si aún no existe
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Obtener el bucket de storage por defecto
const bucket = getStorage(app).bucket();

export { app, bucket };

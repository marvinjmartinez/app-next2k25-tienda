// src/lib/firebase.ts
// IMPORTANT: Fill in your Firebase project's configuration details here.
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

// Usar esta configuración para el entorno de cliente (navegador)
const firebaseConfig = {
  apiKey: "AIzaXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export { app, storage };

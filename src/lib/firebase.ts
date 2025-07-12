// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { API_KEY } from "@/ai/genkit";

// Usar esta configuración para el entorno de cliente (navegador)
const firebaseConfig = {
  apiKey: API_KEY, // Usa la misma clave que Genkit
  authDomain: "distrimnin-tienda.firebaseapp.com",
  projectId: "distrimnin-tienda",
  storageBucket: "distrimnin-tienda.appspot.com",
  messagingSenderId: "360018288599",
  appId: "1:360018288599:web:35520e5e04e76e5c531d05",
};

// Inicializar la app de Firebase para el cliente
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Obtener el cliente de storage
const storage = getStorage(app);

export { app, storage };

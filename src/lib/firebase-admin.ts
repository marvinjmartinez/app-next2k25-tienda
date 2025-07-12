// src/lib/firebase-admin.ts
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Evita la reinicialización en entornos de desarrollo con HMR (Hot Module Replacement)
if (!getApps().length) {
    initializeApp({
        // Usar applicationDefault busca las credenciales automáticamente en el entorno.
        // Asegúrate de que la variable de entorno GOOGLE_APPLICATION_CREDENTIALS esté configurada.
        credential: applicationDefault(),
        // Reemplaza esto con el nombre de tu bucket de Firebase Storage
        storageBucket: "distrimnin-tienda.appspot.com",
    });
}

const bucket = getStorage().bucket();

export { bucket };

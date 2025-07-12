// src/lib/firebase-admin.ts
import { initializeApp, applicationDefault, getApps, getApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
      storageBucket: "distrimnin-tienda.appspot.com",
    });

const bucket = getStorage(app).bucket();

export { app, bucket };

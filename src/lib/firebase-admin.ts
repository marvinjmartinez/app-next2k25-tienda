// src/lib/firebase-admin.ts
import { initializeApp, applicationDefault, getApps, getApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const app = !getApps().length
  ? initializeApp({
      credential: applicationDefault(),
      storageBucket: "distrimnin-tienda.appspot.com",
    })
  : getApp();

const bucket = getStorage().bucket();

export { app, bucket };

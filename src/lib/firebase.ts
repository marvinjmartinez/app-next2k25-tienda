// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDd_v-1kY5PTm0rk6Wv529CcYTdNRLV9_Q",
  authDomain: "distrimnin-tienda.firebaseapp.com",
  projectId: "distrimnin-tienda",
  storageBucket: "distrimnin-tienda.appspot.com",
  messagingSenderId: "360018288599",
  appId: "1:360018288599:web:35520e5e04e76e5c531d05",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app, firebaseConfig.storageBucket);

export { app, storage };

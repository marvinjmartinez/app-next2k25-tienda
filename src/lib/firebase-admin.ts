import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountJson || !storageBucket) {
    const missingVars = [
      !serviceAccountJson && "FIREBASE_SERVICE_ACCOUNT_JSON",
      !storageBucket && "FIREBASE_STORAGE_BUCKET"
    ].filter(Boolean).join(', ');
    throw new Error(`Firebase environment variables are not set. Missing: ${missingVars}. Please check your .env file in the project root.`);
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to initialize Firebase Admin SDK: Error parsing FIREBASE_SERVICE_ACCOUNT_JSON. Please ensure it's a valid JSON string (usually starts and ends with {}).`);
    }
    throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
  }
}

const bucket = admin.storage().bucket();

export { bucket };

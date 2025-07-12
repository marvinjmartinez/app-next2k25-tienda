import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  // Use a single environment variable for the whole service account JSON
  const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountJSON || !storageBucket) {
    const missingVars = [
      !serviceAccountJSON && "FIREBASE_SERVICE_ACCOUNT_JSON",
      !storageBucket && "FIREBASE_STORAGE_BUCKET"
    ].filter(Boolean).join(', ');
    throw new Error(`Firebase environment variables are not set. Missing: ${missingVars}. Please check your .env file.`);
  }

  try {
    // Parse the JSON string from the environment variable
    const serviceAccount = JSON.parse(serviceAccountJSON);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    // Provide more specific error feedback
    if (error.code === 'app/duplicate-app') {
      console.warn('Firebase app already initialized.');
    } else {
      console.error('Firebase Admin Initialization Error:', error);
       // Check if the error is due to JSON parsing
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to initialize Firebase Admin SDK: Error parsing FIREBASE_SERVICE_ACCOUNT_JSON. Please ensure it's a valid JSON string.`);
      }
      throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
  }
}

const bucket = admin.storage().bucket();

export { bucket };

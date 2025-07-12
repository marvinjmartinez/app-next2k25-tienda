import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.GCLOUD_PROJECT;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!serviceAccountKey || !clientEmail || !projectId || !storageBucket) {
    const missingVars = [
      !serviceAccountKey && "FIREBASE_PRIVATE_KEY",
      !clientEmail && "FIREBASE_CLIENT_EMAIL",
      !projectId && "GCLOUD_PROJECT",
      !storageBucket && "FIREBASE_STORAGE_BUCKET"
    ].filter(Boolean).join(', ');
    throw new Error(`Firebase environment variables are not set. Missing: ${missingVars}. Please check your .env file.`);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        // The key may be copied with surrounding quotes, and newlines are often escaped.
        // This removes quotes and replaces escaped newlines with actual newlines.
        privateKey: serviceAccountKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
      }),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    // Provide more specific error feedback
    if (error.code === 'app/duplicate-app') {
      console.warn('Firebase app already initialized.');
    } else {
      console.error('Firebase Admin Initialization Error:', error);
      throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
  }
}

const bucket = admin.storage().bucket();

export { bucket };

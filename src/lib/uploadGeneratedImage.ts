import { bucket } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a base64 encoded image to Firebase Storage and returns its public URL.
 * @param dataUri The image as a data URI string (e.g., "data:image/png;base64,...").
 * @returns A promise that resolves to the public URL of the uploaded image.
 */
export async function uploadImage(dataUri: string): Promise<string> {
  const base64 = dataUri.split(';base64,').pop();
  if (!base64) {
    throw new Error('Invalid data URI: does not contain base64 data.');
  }

  const storageFolder = process.env.FIREBASE_STORAGE_FOLDER || 'uploads';
  const buffer = Buffer.from(base64, 'base64');
  const filename = `${storageFolder.endsWith('/') ? storageFolder : storageFolder + '/'}${uuidv4()}.png`;
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: {
      contentType: 'image/png',
      // Set a long cache duration for the image
      cacheControl: 'public, max-age=31536000',
    },
    // Make the file publicly accessible
    public: true,
  });

  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}

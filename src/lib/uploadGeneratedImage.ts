// src/lib/uploadGeneratedImage.ts
import { bucket } from "./firebase-admin";
import { v4 as uuidv4 } from "uuid";

export async function uploadGeneratedImage(dataUri: string): Promise<string> {
  const mimeType = dataUri.match(/data:(.*);base64,/)?.[1];
  const base64Data = dataUri.split(",")[1];
  
  if (!mimeType || !base64Data) {
    throw new Error("Invalid data URI format.");
  }

  const fileBuffer = Buffer.from(base64Data, "base64");
  const fileName = `generated-products/${uuidv4()}.${mimeType.split("/")[1]}`;
  const file = bucket.file(fileName);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
  });

  // Make the file public and get the URL
  await file.makePublic();
  
  return file.publicUrl();
}

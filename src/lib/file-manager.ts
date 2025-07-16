// src/lib/file-manager.ts
"use server";

const API_BASE_URL = "https://api-files-2k25-main-fuu1xa.laravel.cloud/api";
const API_TOKEN = "06c89901e9109f28f9d6118bf09bf609baa53feba9640c7b6d307572760f0900";

/**
 * Convierte un Data URI (base64) a un objeto Blob.
 * @param dataURI El Data URI a convertir.
 * @returns Un objeto Blob.
 */
function dataURIToBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

interface FileUploadResponse {
    success: boolean;
    path: string;
    url: string;
}

/**
 * Sube un archivo a través de la API de Laravel.
 * @param file El archivo (Blob o File) a subir.
 * @param path La ruta de destino en el almacenamiento.
 * @returns Una promesa que se resuelve con la ruta y la URL del archivo subido.
 */
export async function uploadFile(file: Blob, path: string): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append('archivo', file, 'generated-image.png'); // Clave corregida a 'archivo'
  formData.append('path', path);

  const response = await fetch(`${API_BASE_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al subir archivo: ${response.statusText} - ${errorData.message || ''}`);
  }

  const result: FileUploadResponse = await response.json();
  if (!result.success) {
      throw new Error('La API indicó un fallo en la subida del archivo.');
  }

  return { path: result.path, url: result.url };
}

/**
 * Sube un archivo desde un Data URI (base64).
 * @param dataURI El Data URI de la imagen a subir.
 * @param path La ruta de destino.
 * @returns Una promesa que se resuelve con la ruta y la URL del archivo.
 */
export async function uploadFileFromDataURI(dataURI: string, path: string): Promise<{ path: string; url: string }> {
    const blob = dataURIToBlob(dataURI);
    return uploadFile(blob, path);
}

/**
 * Elimina un archivo a través de la API.
 * @param path La ruta del archivo a eliminar.
 * @returns Una promesa que indica si la operación fue exitosa.
 */
export async function deleteFile(path: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/files/${path}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al eliminar el archivo: ${response.statusText} - ${errorData.message || ''}`);
  }

  return response.json();
}

/**
 * Reemplaza un archivo existente a través de la API.
 * @param path La ruta del archivo a reemplazar.
 * @param newFile El nuevo archivo a subir.
 * @returns Una promesa que se resuelve con la nueva ruta y URL.
 */
export async function replaceFile(path: string, newFile: File): Promise<{ path: string; url: string }> {
  const formData = new FormData();
  formData.append('file', newFile);

  const response = await fetch(`${API_BASE_URL}/files/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
     const errorData = await response.json();
    throw new Error(`Error al reemplazar el archivo: ${response.statusText} - ${errorData.message || ''}`);
  }

  return response.json();
}

/**
 * Obtiene la URL (potencialmente firmada) para un archivo existente.
 * @param path La ruta del archivo en el almacenamiento.
 * @returns Una promesa que se resuelve con la URL del archivo.
 */
export async function getFileUrl(path: string): Promise<{ url: string }> {
  const response = await fetch(`${API_BASE_URL}/files/${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error al obtener la URL del archivo: ${response.statusText} - ${errorData.message || ''}`);
  }

  const result: { url: string } = await response.json();
  return result;
}

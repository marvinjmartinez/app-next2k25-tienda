// src/ai/flows/generate-product-image.ts
'use server';
/**
 * @fileOverview Un agente de IA para generar imágenes de productos a partir de una descripción.
 *
 * - generateProductImage - Una función que maneja la generación de la imagen.
 * - GenerateProductImageInput - El tipo de entrada para la función generateProductImage.
 * - GenerateProductImageOutput - El tipo de retorno para la función generateProductImage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductImageInputSchema = z.object({
  hint: z
    .string()
    .describe('Una breve descripción o pista sobre el producto para generar una imagen.'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('La URL de datos (data URI) de la imagen generada.'),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;

export async function generateProductImage(
  input: GenerateProductImageInput
): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

// Flujo de diagnóstico: En lugar de generar una imagen real,
// genera una URL de marcador de posición para probar la conectividad de la API.
const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    // Usamos el modelo de texto estándar para generar una URL de marcador de posición.
    // Esto nos ayuda a verificar si la clave API y la API de lenguaje generativo básica funcionan.
    const {text} = await ai.generate({
      model: 'googleai/gemini-pro', // Usar el modelo de texto por defecto.
      prompt: `Generate a placeholder image URL for a product described as: ${input.hint}. The url should be from placehold.co and be 600x400.`,
    });

    const url = text.trim();
    if (!url.startsWith('https://placehold.co')) {
        // Fallback en caso de que la IA no genere una URL válida
        return { imageUrl: 'https://placehold.co/600x400.png' };
    }

    return {
      imageUrl: url,
    };
  }
);

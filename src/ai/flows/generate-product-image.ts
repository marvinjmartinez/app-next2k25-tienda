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

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a high-quality, professional product photo on a clean white background for a hardware store product. The product is: ${input.hint}.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
        // Aspect ratio 4:3 for product images
        imageConfig: {
          height: 768,
          width: 1024
        }
      },
    });

    if (!media?.url) {
      throw new Error('La IA no pudo generar una imagen.');
    }

    return {
      imageUrl: media.url,
    };
  }
);

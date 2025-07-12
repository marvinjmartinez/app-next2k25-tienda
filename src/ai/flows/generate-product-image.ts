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
    // Llamada a la IA simplificada al máximo
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Product photo, ${input.hint}, clean, studio lighting, white background.`,
      config: {
        responseModalities: ['IMAGE'],
        safetySettings: [
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
            },
        ]
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

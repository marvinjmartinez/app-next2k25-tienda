// src/ai/flows/generate-product-description.ts
'use server';
/**
 * @fileOverview Un agente de IA para generar descripciones técnicas de productos.
 *
 * - generateProductDescription - Una función que maneja la generación de la descripción.
 * - GenerateProductDescriptionInput - El tipo de entrada para la función.
 * - GenerateProductDescriptionOutput - El tipo de retorno para la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  name: z.string().describe('El nombre del producto.'),
  category: z.string().describe('La categoría a la que pertenece el producto.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('La descripción técnica y de marketing generada para el producto.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `Eres un redactor técnico experto para una ferretería. Tu tarea es escribir una descripción de producto convincente y detallada.

Producto: {{{name}}}
Categoría: {{{category}}}

Genera una descripción de entre 40 y 60 palabras que sea:
- Atractiva: Captura la atención del cliente.
- Informativa: Describe sus características, materiales y usos principales.
- Profesional: Usa un tono adecuado para una ferretería.

La descripción debe ser un solo párrafo continuo.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

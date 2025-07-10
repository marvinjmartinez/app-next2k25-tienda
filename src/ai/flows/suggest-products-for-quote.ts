// src/ai/flows/suggest-products-for-quote.ts
'use server';
/**
 * @fileOverview Un agente de IA para sugerir productos para una cotización basada en las preferencias del cliente.
 *
 * - suggestProductsForQuote - Una función que maneja el proceso de sugerencia de productos.
 * - SuggestProductsForQuoteInput - El tipo de entrada para la función suggestProductsForQuote.
 * - SuggestProductsForQuoteOutput - El tipo de retorno para la función suggestProductsForQuote.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsForQuoteInputSchema = z.object({
  customerPreferences: z
    .string()
    .describe('Una descripción de las preferencias del cliente.'),
  pastInteractions: z
    .string()
    .optional()
    .describe('Una descripción de las interacciones pasadas con el cliente.'),
});
export type SuggestProductsForQuoteInput = z.infer<
  typeof SuggestProductsForQuoteInputSchema
>;

const SuggestProductsForQuoteOutputSchema = z.object({
  suggestedProducts: z
    .array(z.string())
    .describe('Una lista de nombres de productos sugeridos para la cotización.'),
  reasoning: z
    .string()
    .describe('El razonamiento detrás de los productos sugeridos.'),
});
export type SuggestProductsForQuoteOutput = z.infer<
  typeof SuggestProductsForQuoteOutputSchema
>;

export async function suggestProductsForQuote(
  input: SuggestProductsForQuoteInput
): Promise<SuggestProductsForQuoteOutput> {
  return suggestProductsForQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductsForQuotePrompt',
  input: {schema: SuggestProductsForQuoteInputSchema},
  output: {schema: SuggestProductsForQuoteOutputSchema},
  prompt: `Eres un asistente de IA útil que sugiere productos para que un agente de ventas los agregue a una cotización, basándose en las preferencias del cliente y las interacciones pasadas.

Preferencias del Cliente: {{{customerPreferences}}}
Interacciones Pasadas: {{{pastInteractions}}}

Sugiere una lista de nombres de productos que serían relevantes para la cotización y proporciona un breve razonamiento para cada sugerencia.

Formatea tu respuesta como un objeto JSON con los campos "suggestedProducts" y "reasoning".
`,
});

const suggestProductsForQuoteFlow = ai.defineFlow(
  {
    name: 'suggestProductsForQuoteFlow',
    inputSchema: SuggestProductsForQuoteInputSchema,
    outputSchema: SuggestProductsForQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

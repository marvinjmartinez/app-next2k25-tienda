// src/ai/flows/suggest-products-for-quote.ts
'use server';
/**
 * @fileOverview An AI agent to suggest products for a quote based on customer preferences.
 *
 * - suggestProductsForQuote - A function that handles the product suggestion process.
 * - SuggestProductsForQuoteInput - The input type for the suggestProductsForQuote function.
 * - SuggestProductsForQuoteOutput - The return type for the suggestProductsForQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsForQuoteInputSchema = z.object({
  customerPreferences: z
    .string()
    .describe('A description of the customer preferences.'),
  pastInteractions: z
    .string()
    .optional()
    .describe('A description of the past interactions with the customer.'),
});
export type SuggestProductsForQuoteInput = z.infer<
  typeof SuggestProductsForQuoteInputSchema
>;

const SuggestProductsForQuoteOutputSchema = z.object({
  suggestedProducts: z
    .array(z.string())
    .describe('A list of suggested product names for the quote.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested products.'),
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
  prompt: `You are a helpful AI assistant that suggests products for a sales agent to add to a quote, based on customer preferences and past interactions.

Customer Preferences: {{{customerPreferences}}}
Past Interactions: {{{pastInteractions}}}

Suggest a list of product names that would be relevant for the quote, and provide a brief reasoning for each suggestion.

Format your response as a JSON object with "suggestedProducts" and "reasoning" fields.
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

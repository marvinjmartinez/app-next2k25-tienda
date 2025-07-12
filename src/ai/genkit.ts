import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta configuración global puede estar vacía o usar una clave por defecto si existe.
// La clave real y válida se inyectará dinámicamente en la Server Action.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY || 'invalid-key-by-default',
    }),
  ],
});

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta configuración global se asegura de que la clave de API se lea
// desde las variables de entorno del servidor cada vez que se usa una acción de Genkit.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
});

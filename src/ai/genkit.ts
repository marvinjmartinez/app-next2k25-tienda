import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "POR_FAVOR_REEMPLAZA_CON_TU_NUEVA_CLAVE_SIN_RESTRICCIONES",
    }),
  ],
  model: 'googleai/gemini-pro',
});

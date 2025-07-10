import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSyCMNE22ggOfxihIWnBk4L7CcELznha5wWQ",
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

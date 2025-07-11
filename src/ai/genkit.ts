import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSyDd_v-1kY5PTm0rk6Wv529CcYTdNRLV9_Q",
    }),
  ],
  model: 'googleai/gemini-pro',
});

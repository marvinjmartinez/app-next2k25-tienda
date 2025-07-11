import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

export const API_KEY = "AIzaSyDd_v-1kY5PTm0rk6Wv529CcYTdNRLV9_Q";

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: API_KEY,
    }),
  ],
  model: 'googleai/gemini-pro',
});

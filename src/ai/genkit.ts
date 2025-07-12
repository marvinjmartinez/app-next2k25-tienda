import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Next.js handles .env.local automatically.
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("GOOGLE_API_KEY is not set in .env.local. AI features will not work.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});

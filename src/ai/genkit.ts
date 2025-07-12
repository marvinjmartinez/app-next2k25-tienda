import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Next.js handles .env.local automatically, so no need for dotenv.
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

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

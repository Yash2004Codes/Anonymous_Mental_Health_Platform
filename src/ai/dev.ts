import { config } from 'dotenv';
config();

import '@/ai/flows/ai-empathetic-response.ts';
import '@/ai/flows/generate-initial-post-text.ts';
import '@/ai/flows/summarize-post-feedback.ts';
import '@/ai/flows/suggest-emotional-tags.ts';
import '@/ai/flows/moderate-content.ts';

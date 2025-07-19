// This is an AI-generated file. Do not edit by hand.
'use server';

/**
 * @fileOverview An AI agent that generates empathetic responses, offering coping tips and validation.
 *
 * - aiEmpatheticResponse - A function that generates empathetic responses based on user input.
 * - AiEmpatheticResponseInput - The input type for the aiEmpatheticResponse function.
 * - AiEmpatheticResponseOutput - The return type for the aiEmpatheticResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEmpatheticResponseInputSchema = z.object({
  userInput: z.string().describe('The user input expressing their mental or emotional struggle.'),
});
export type AiEmpatheticResponseInput = z.infer<typeof AiEmpatheticResponseInputSchema>;

const AiEmpatheticResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated empathetic response, offering coping tips and validation.'),
});
export type AiEmpatheticResponseOutput = z.infer<typeof AiEmpatheticResponseOutputSchema>;

export async function aiEmpatheticResponse(input: AiEmpatheticResponseInput): Promise<AiEmpatheticResponseOutput> {
  return aiEmpatheticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiEmpatheticResponsePrompt',
  input: {schema: AiEmpatheticResponseInputSchema},
  output: {schema: AiEmpatheticResponseOutputSchema},
  prompt: `You are a compassionate and supportive AI assistant designed to provide empathetic responses to users expressing their mental and emotional struggles.

  Your goal is to offer comfort, guidance, and validation without judgment. Include coping tips and self-care suggestions where appropriate.

  User Input: {{{userInput}}}

  AI Response:`, // Ensure a newline after 'AI Response:' to start the AI's response cleanly
});

const aiEmpatheticResponseFlow = ai.defineFlow(
  {
    name: 'aiEmpatheticResponseFlow',
    inputSchema: AiEmpatheticResponseInputSchema,
    outputSchema: AiEmpatheticResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview AI flow that generates a detailed, empathetic starting point for a user's post based on a short description of their emotional state.
 *
 * - generateInitialPostText - A function that generates the initial post text.
 * - GenerateInitialPostTextInput - The input type for the generateInitialPostText function.
 * - GenerateInitialPostTextOutput - The return type for the generateInitialPostText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPostTextInputSchema = z.object({
  emotionalStateDescription: z
    .string()
    .describe(
      'A short description of the user\u2019s current emotional state.'
    ),
});
export type GenerateInitialPostTextInput = z.infer<typeof GenerateInitialPostTextInputSchema>;

const GenerateInitialPostTextOutputSchema = z.object({
  generatedPostText: z
    .string()
    .describe(
      'A more detailed, empathetic starting point for the user\u2019s post.'
    ),
});
export type GenerateInitialPostTextOutput = z.infer<typeof GenerateInitialPostTextOutputSchema>;

export async function generateInitialPostText(
  input: GenerateInitialPostTextInput
): Promise<GenerateInitialPostTextOutput> {
  return generateInitialPostTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialPostTextPrompt',
  input: {schema: GenerateInitialPostTextInputSchema},
  output: {schema: GenerateInitialPostTextOutputSchema},
  prompt: `You are a compassionate AI assistant designed to help users express their feelings in a supportive online community.

  Based on the user's short description of their emotional state, generate a more detailed and empathetic starting point for their post.

  Description of emotional state: {{{emotionalStateDescription}}}
  `,
});

const generateInitialPostTextFlow = ai.defineFlow(
  {
    name: 'generateInitialPostTextFlow',
    inputSchema: GenerateInitialPostTextInputSchema,
    outputSchema: GenerateInitialPostTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

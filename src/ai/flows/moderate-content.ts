'use server';

/**
 * @fileOverview An AI flow for content moderation to ensure community safety.
 *
 * - moderateContent - A function that analyzes text for harmful content.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  content: z.string().describe('The text content to be moderated.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  flagged: z.boolean().describe('Whether the content is flagged as inappropriate or harmful.'),
  reason: z
    .string()
    .optional()
    .describe('A brief explanation if the content is flagged.'),
  categories: z
    .array(z.string())
    .optional()
    .describe('A list of categories the flagged content falls into.'),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(input: ModerateContentInput): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are a content moderator for a mental health support platform called "FeelFree". Your primary responsibility is to ensure the safety and well-being of the community by identifying and flagging harmful content.

  Analyze the following content. The content should be flagged if it contains any of the following:
  - Explicit self-harm ideation or encouragement.
  - Threats of violence against others.
  - Bullying or harassment of individuals or groups.
  - Hate speech based on race, religion, gender, sexual orientation, etc.
  - Glorification of eating disorders or other harmful behaviors.
  - Graphic or violent descriptions.
  - Spam or malicious links.

  If the content is safe, set "flagged" to false.
  If the content violates any of these rules, set "flagged" to true, provide a brief, non-judgmental "reason" for the flag, and list the violated "categories".

  Content to analyze:
  {{{content}}}
  `,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    // For very short or empty content, we can skip the AI check.
    if (!input.content || input.content.trim().length < 10) {
        return { flagged: false };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

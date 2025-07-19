'use server';

/**
 * @fileOverview A flow to suggest relevant emotional tags for a user's post.
 *
 * - suggestEmotionalTags - A function that suggests emotional tags based on the post content.
 * - SuggestEmotionalTagsInput - The input type for the suggestEmotionalTags function.
 * - SuggestEmotionalTagsOutput - The return type for the suggestEmotionalTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmotionalTagsInputSchema = z.object({
  postContent: z.string().describe('The content of the user post.'),
});
export type SuggestEmotionalTagsInput = z.infer<typeof SuggestEmotionalTagsInputSchema>;

const SuggestEmotionalTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested emotional tags.'),
});
export type SuggestEmotionalTagsOutput = z.infer<typeof SuggestEmotionalTagsOutputSchema>;

export async function suggestEmotionalTags(input: SuggestEmotionalTagsInput): Promise<SuggestEmotionalTagsOutput> {
  return suggestEmotionalTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmotionalTagsPrompt',
  input: {schema: SuggestEmotionalTagsInputSchema},
  output: {schema: SuggestEmotionalTagsOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant emotional tags for user posts on a mental health support platform.

  Given the following post content, suggest up to 5 emotional tags that best categorize the user's feelings. The tags should be short, relevant, and commonly used to describe emotions.

  Post Content: {{{postContent}}}

  Output the tags as a JSON array of strings.`,
});

const suggestEmotionalTagsFlow = ai.defineFlow(
  {
    name: 'suggestEmotionalTagsFlow',
    inputSchema: SuggestEmotionalTagsInputSchema,
    outputSchema: SuggestEmotionalTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

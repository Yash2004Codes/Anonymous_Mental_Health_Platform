// Summarizes feedback received on a post, highlighting helpful advice and common themes.
//
// - summarizePostFeedback - A function that summarizes post feedback.
// - SummarizePostFeedbackInput - The input type for summarizePostFeedback.
// - SummarizePostFeedbackOutput - The return type for summarizePostFeedback.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePostFeedbackInputSchema = z.object({
  postId: z.string().describe('The ID of the post to summarize feedback for.'),
  feedback: z
    .array(z.string())
    .describe('An array of feedback strings received on the post.'),
});
export type SummarizePostFeedbackInput = z.infer<
  typeof SummarizePostFeedbackInputSchema
>;

const SummarizePostFeedbackOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the feedback, highlighting the most helpful advice and common themes.'
    ),
});
export type SummarizePostFeedbackOutput = z.infer<
  typeof SummarizePostFeedbackOutputSchema
>;

export async function summarizePostFeedback(
  input: SummarizePostFeedbackInput
): Promise<SummarizePostFeedbackOutput> {
  return summarizePostFeedbackFlow(input);
}

const summarizePostFeedbackPrompt = ai.definePrompt({
  name: 'summarizePostFeedbackPrompt',
  input: {schema: SummarizePostFeedbackInputSchema},
  output: {schema: SummarizePostFeedbackOutputSchema},
  prompt: `Summarize the following feedback received on post {{{postId}}}. Highlight the most helpful advice and common themes:

Feedback:
{{#each feedback}}
- {{{this}}}
{{/each}}

Summary:`,
});

const summarizePostFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizePostFeedbackFlow',
    inputSchema: SummarizePostFeedbackInputSchema,
    outputSchema: SummarizePostFeedbackOutputSchema,
  },
  async input => {
    const {output} = await summarizePostFeedbackPrompt(input);
    return output!;
  }
);

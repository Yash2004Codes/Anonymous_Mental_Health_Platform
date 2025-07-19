'use server';

import { summarizePostFeedback } from '@/ai/flows/summarize-post-feedback';

export async function getFeedbackSummary(postId: string, feedback: string[]) {
  if (feedback.length === 0) {
    return { summary: 'There is no feedback yet for this post.' };
  }
  
  try {
    const result = await summarizePostFeedback({ postId, feedback });
    return result;
  } catch (error) {
    console.error('Failed to get feedback summary:', error);
    throw new Error('Could not generate summary.');
  }
}

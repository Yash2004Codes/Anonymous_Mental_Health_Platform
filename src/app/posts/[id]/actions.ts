'use server';

import { aiEmpatheticResponse } from "@/ai/flows/ai-empathetic-response";
import { moderateContent } from "@/ai/flows/moderate-content";
import { addComment as dbAddComment } from "@/lib/mock-db";

export async function addComment(postId: string, comment: string) {
  if (!comment || !postId) {
    return { success: false, message: 'Comment cannot be empty.' };
  }

  const moderationResult = await moderateContent({ content: comment });

  if (moderationResult.flagged) {
    return { success: false, message: `This comment cannot be posted. Reason: ${moderationResult.reason}` };
  }
  
  try {
    const newComment = await dbAddComment(postId, comment);
    return { success: true, message: 'Comment posted!', newComment };
  } catch(error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to post comment: ${message}`};
  }
}

export async function rateComment(commentId: string, rating: 'helpful' | 'notHelpful') {
  console.log('Rating', rating, 'for comment', commentId);
  // In a real app, update rating in DB
  return { success: true };
}

export async function generateAiComment(postContent: string) {
  try {
    const result = await aiEmpatheticResponse({ userInput: postContent });
    return result;
  } catch (error) {
    console.error('AI response generation failed:', error);
    return { aiResponse: "I'm sorry, I couldn't generate a response at the moment. Please know that your feelings are valid." };
  }
}

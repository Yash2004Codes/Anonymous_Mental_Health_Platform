'use server';

import { aiEmpatheticResponse } from "@/ai/flows/ai-empathetic-response";
import { moderateContent } from "@/ai/flows/moderate-content";
import { revalidatePath } from "next/cache";

export async function addComment(prevState: any, formData: FormData) {
  const comment = formData.get('comment') as string;
  const postId = formData.get('postId') as string;

  if (!comment || !postId) {
    return { success: false, message: 'Comment cannot be empty.' };
  }

  // Moderate comment before saving
  const moderationResult = await moderateContent({ content: comment });

  if (moderationResult.flagged) {
    return { success: false, message: `This comment cannot be posted. Reason: ${moderationResult.reason}` };
  }
  
  console.log('New comment for post', postId, ':', comment);
  // In a real app, save to DB
  // For this mock, we can't update the central data store from a server action easily
  // so we revalidate to trigger a re-render. In a real app, you'd insert the comment
  // and then revalidate.
  
  revalidatePath(`/posts/${postId}`);
  return { success: true, message: 'Comment posted!' };
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

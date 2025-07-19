'use server';

import { aiEmpatheticResponse } from "@/ai/flows/ai-empathetic-response";

export async function addComment(formData: FormData) {
  const comment = formData.get('comment') as string;
  const postId = formData.get('postId') as string;

  if (!comment || !postId) {
    return { success: false, message: 'Comment cannot be empty.' };
  }
  
  console.log('New comment for post', postId, ':', comment);
  // In a real app, save to DB
  return { success: true };
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

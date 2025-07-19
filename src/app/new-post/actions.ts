'use server';

import { generateInitialPostText } from "@/ai/flows/generate-initial-post-text";
import { moderateContent } from "@/ai/flows/moderate-content";
import { suggestEmotionalTags } from "@/ai/flows/suggest-emotional-tags";
import { addPost } from "@/lib/mock-db";
import { revalidatePath } from "next/cache";

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tagsString = formData.get('tags') as string;

  if (!title || !content) {
    return { message: 'Title and content are required.' };
  }
  
  const moderationResult = await moderateContent({ content: `${title}\n${content}` });

  if (moderationResult.flagged) {
    return { message: `This post cannot be published. Reason: ${moderationResult.reason}` };
  }

  await addPost({ title, content, tags: tagsString ? tagsString.split(',') : [] });

  // Revalidate the home page to show the new post
  revalidatePath('/');
  
  return { message: 'success' };
}

export async function generatePostSuggestion(prompt: string) {
    const result = await generateInitialPostText({ emotionalStateDescription: prompt });
    return result;
}

export async function generateTagSuggestions(postContent: string) {
    const result = await suggestEmotionalTags({ postContent });
    return result;
}

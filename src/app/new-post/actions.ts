'use server';

import { generateInitialPostText } from "@/ai/flows/generate-initial-post-text";
import { moderateContent } from "@/ai/flows/moderate-content";
import { suggestEmotionalTags } from "@/ai/flows/suggest-emotional-tags";
import { redirect } from 'next/navigation';

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;

  if (!title || !content) {
    return { message: 'Title and content are required.' };
  }
  
  // Moderate content before saving
  const moderationResult = await moderateContent({ content: `${title}\n${content}` });

  if (moderationResult.flagged) {
    return { message: `This post cannot be published. Reason: ${moderationResult.reason}` };
  }

  // In a real app, you would save this to a database.
  console.log('New Post Submitted:', { title, content, tags });
  // await db.insert(posts).values({ title, content, tags: tags.split(',') });

  // Returning success and then redirecting is one way to handle this with useActionState
  // Another is to use the redirect function from next/navigation
  // For simplicity, we'll return a success message and let the client handle the redirect.
  // redirect('/'); // This would work if we didn't need to show a toast
  
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

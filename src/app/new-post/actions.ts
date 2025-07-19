'use server';

import { generateInitialPostText } from "@/ai/flows/generate-initial-post-text";
import { suggestEmotionalTags } from "@/ai/flows/suggest-emotional-tags";

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;

  console.log('New Post Submitted:', { title, content, tags });

  if (!title || !content) {
    return { message: 'Title and content are required.' };
  }

  // In a real app, you would save this to a database.
  // await db.insert(posts).values({ title, content, tags: tags.split(',') });

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

'use server';

/**
 * THIS IS A MOCK DATABASE.
 * In a real application, you would use a proper database like Firestore,
 * PostgreSQL, etc. This is a server-side in-memory cache to simulate
 * a database for this prototype.
 */
import type { Post, Comment, User } from './types';
import { posts as initialPosts, users } from './mock-data';

// Since this is a server-side module, we can use a simple variable
// to act as our in-memory store. This will persist across requests
// on the same server instance, but will be reset on server restart.
let posts: Post[] = [...initialPosts];

// To simulate real-world data, we'll assign the current user.
// In a real app, this would come from an auth session.
const currentUser = users[0]; 

export async function getPosts(): Promise<Post[]> {
  // Return a copy to prevent direct mutation of the "database"
  return JSON.parse(JSON.stringify(posts));
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const post = posts.find(p => p.id === id);
  return post ? JSON.parse(JSON.stringify(post)) : undefined;
}

export async function addPost(postData: { title: string; content: string; tags: string[] }): Promise<Post> {
  const newPost: Post = {
    id: `post-${Date.now()}`,
    ...postData,
    author: currentUser,
    createdAt: 'Just now',
    comments: [],
  };
  
  // Add to the beginning of the array to show newest first
  posts.unshift(newPost);
  return JSON.parse(JSON.stringify(newPost));
}

export async function addComment(postId: string, commentContent: string, isAI: boolean = false): Promise<Comment> {
  const post = posts.find(p => p.id === postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const author = isAI ? users.find(u => u.id === 'user-3')! : currentUser;

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    author,
    content: commentContent,
    createdAt: 'Just now',
    helpful: 0,
    notHelpful: 0,
    isAI: isAI,
  };
  
  post.comments.push(newComment);
  return JSON.parse(JSON.stringify(newComment));
}

import type { User, Post, Comment } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Anonymous Panda', avatar: 'https://placehold.co/40x40/E3F2FD/202A38?text=P' },
  { id: 'user-2', name: 'Anonymous Koala', avatar: 'https://placehold.co/40x40/E3F2FD/202A38?text=K' },
  { id: 'user-3', name: 'AI Assistant', avatar: 'https://placehold.co/40x40/A5D6A7/202A38?text=AI' },
];

export const comments: Comment[] = [
  {
    id: 'comment-1',
    author: users[1],
    content: "I'm sorry to hear you're going through this. Remember to be kind to yourself. Have you tried any mindfulness exercises? They sometimes help me when I feel overwhelmed.",
    createdAt: '2 days ago',
    helpful: 15,
    notHelpful: 1,
  },
  {
    id: 'comment-2',
    author: users[0],
    content: "It sounds really tough. What you're feeling is valid. Sending you support.",
    createdAt: '1 day ago',
    helpful: 12,
    notHelpful: 0,
  },
];

export const posts: Post[] = [
  {
    id: 'post-1',
    title: 'Feeling overwhelmed with anxiety lately',
    author: users[0],
    content: "Lately, I've been feeling a constant sense of dread and my anxiety has been through the roof. It's hard to focus on work or even things I usually enjoy. It feels like a heavy weight I can't shake off. Just wanted to share and see if anyone else has felt this way.",
    tags: ['Anxiety', 'Stress', 'Overwhelmed'],
    createdAt: '3 days ago',
    comments: comments,
  },
  {
    id: 'post-2',
    title: 'Struggling with loneliness after moving to a new city',
    author: users[1],
    content: "I moved for a new job a few months ago and I'm finding it incredibly hard to connect with people. The loneliness is starting to get to me, and it's making me question my decision. Any advice on making friends in a new place would be appreciated.",
    tags: ['Loneliness', 'Relationships', 'Depression'],
    createdAt: '5 days ago',
    comments: [
      {
        id: 'comment-3',
        author: users[0],
        content: 'Moving to a new city is so hard! Maybe you could try joining local groups for hobbies you enjoy? That helped me meet like-minded people.',
        createdAt: '4 days ago',
        helpful: 25,
        notHelpful: 2,
      },
    ],
  },
  {
    id: 'post-3',
    title: 'Is it normal to feel this lost in your 20s?',
    author: users[0],
    content: "I feel like all my friends have their lives figured out, and I'm just... floating. I don't know what I want to do with my career or my life in general. It's causing a lot of stress and self-doubt.",
    tags: ['Stress', 'Self-doubt', 'Career'],
    createdAt: '1 week ago',
    comments: [],
  },
];

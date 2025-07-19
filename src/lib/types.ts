export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Comment = {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  helpful: number;
  notHelpful: number;
  isAI?: boolean;
};

export type Post = {
  id:string;
  title: string;
  content: string;
  author: User;
  tags: string[];
  createdAt: string;
  comments: Comment[];
};

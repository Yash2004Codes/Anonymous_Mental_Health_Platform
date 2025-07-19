'use client';

import { useState, useTransition } from 'react';
import { notFound } from 'next/navigation';
import { posts, users as allUsers } from '@/lib/mock-data';
import type { Post, Comment as CommentType } from '@/lib/types';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ThumbsUp, ThumbsDown, Sparkles, Flag, Loader2 } from 'lucide-react';
import { addComment, generateAiComment, rateComment } from './actions';
import { useToast } from '@/hooks/use-toast';

function CommentCard({ comment }: { comment: CommentType }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRate = (rating: 'helpful' | 'notHelpful') => {
    startTransition(async () => {
      const result = await rateComment(comment.id, rating);
      if (result.success) {
        toast({ title: 'Thanks for your feedback!' });
        // In a real app, you would re-fetch or optimistically update the UI.
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  return (
    <Card className={` ${comment.isAI ? 'bg-accent/50 border-accent' : 'bg-card'}`}>
      <CardHeader className="flex flex-row items-start space-x-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
          </div>
          <p className="text-sm text-foreground/80 pt-2">{comment.content}</p>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-end items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleRate('helpful')} disabled={isPending}>
            <ThumbsUp className="h-4 w-4 mr-2" /> Helpful ({comment.helpful})
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleRate('notHelpful')} disabled={isPending}>
            <ThumbsDown className="h-4 w-4 mr-2" /> Not Helpful ({comment.notHelpful})
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Flag className="h-4 w-4 mr-2" /> Report
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [isAiPending, startAiTransition] = useTransition();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | undefined>(posts.find((p) => p.id === params.id));

  const handleGenerateAiResponse = () => {
    if (!post) return;
    startAiTransition(async () => {
      const { aiResponse } = await generateAiComment(post.content);
      const aiComment: CommentType = {
        id: `ai-comment-${Date.now()}`,
        author: allUsers.find(u => u.id === 'user-3')!, // AI Assistant user
        content: aiResponse,
        createdAt: 'Just now',
        helpful: 0,
        notHelpful: 0,
        isAI: true,
      };
      setPost(prevPost => prevPost ? { ...prevPost, comments: [...prevPost.comments, aiComment] } : undefined);
      toast({ title: "AI Assistant has replied.", description: "A supportive message has been added to the comments." });
    });
  };

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
                <span>&middot;</span>
                <span>{post.createdAt}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </CardFooter>
          </Card>

          <div className="my-8">
            <Button onClick={handleGenerateAiResponse} disabled={isAiPending}>
              {isAiPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get AI Support
            </Button>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comments ({post.comments.length})</h2>
            {post.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>

          <Separator className="my-8" />

          <div>
            <h3 className="text-xl font-bold mb-4">Leave a comment</h3>
            <form action={async (formData) => {
              const result = await addComment(formData);
              if (result.success) {
                toast({ title: "Comment added!" });
                // Optimistic UI update or re-fetch would go here
              } else {
                toast({ title: "Error", description: result.message, variant: "destructive" });
              }
            }}>
              <input type="hidden" name="postId" value={post.id} />
              <Textarea name="comment" placeholder="Share your thoughts or offer support..." className="mb-4 min-h-[120px]" />
              <Button type="submit">Post Comment</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

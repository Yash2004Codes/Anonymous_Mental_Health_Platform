'use client';

import { useState, useTransition, useActionState, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import { getPostById, addComment as dbAddComment } from '@/lib/mock-db';
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
import { Skeleton } from '@/components/ui/skeleton';

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
        toast({ title: 'Error', variant: 'destructive' });
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

function CommentForm({ postId, onCommentAdded }: { postId: string, onCommentAdded: (newComment: CommentType) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [commentText, setCommentText] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    startTransition(async () => {
        const { success, message, newComment } = await addComment(postId, commentText);
        toast({
            title: success ? 'Success!' : 'Error',
            description: message,
            variant: success ? 'default' : 'destructive'
        });
        if (success && newComment) {
            onCommentAdded(newComment);
            setCommentText('');
            formRef.current?.reset();
        }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Textarea name="comment" placeholder="Share your thoughts or offer support..." className="mb-4 min-h-[120px]" required value={commentText} onChange={(e) => setCommentText(e.target.value)} />
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Post Comment
      </Button>
    </form>
  )
}


export default function PostPage({ params }: { params: { id: string } }) {
  const [isAiPending, startAiTransition] = useTransition();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await getPostById(params.id);
        if (fetchedPost) {
          setPost(fetchedPost);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);


  const handleGenerateAiResponse = () => {
    if (!post) return;
    startAiTransition(async () => {
      const { aiResponse } = await generateAiComment(post.content);
      const newComment = await dbAddComment(post.id, aiResponse, true);
      setPost(prevPost => prevPost ? { ...prevPost, comments: [...prevPost.comments, newComment] } : null);
      toast({ title: "AI Assistant has replied.", description: "A supportive message has been added to the comments." });
    });
  };

  if (isLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
          <Header />
           <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
            <div className="container mx-auto max-w-3xl space-y-8">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
           </main>
        </div>
    )
  }

  if (!post) {
    notFound();
  }
  
  const handleCommentAdded = (newComment: CommentType) => {
    setPost(prevPost => prevPost ? { ...prevPost, comments: [...prevPost.comments, newComment] } : null);
  };

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
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      </main>
    </div>
  );
}

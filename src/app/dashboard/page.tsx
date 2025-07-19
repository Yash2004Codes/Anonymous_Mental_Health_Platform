'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { posts as allPosts } from '@/lib/mock-data';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, MessageSquare, ThumbsUp, Sparkles } from 'lucide-react';
import { getFeedbackSummary } from './actions';
import { useToast } from '@/hooks/use-toast';

// Assuming the logged-in user is 'user-1' for this prototype
const myPosts = allPosts.filter(p => p.author.id === 'user-1');

function PostSummary({ post }: { post: Post }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary('');
    try {
      const commentContents = post.comments.map(c => c.content);
      const result = await getFeedbackSummary(post.id, commentContents);
      setSummary(result.summary);
    } catch (error) {
      toast({
        title: 'Error summarizing feedback',
        description: 'Could not generate a summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.createdAt}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments.length} comments</span>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4" />
          <span>{post.comments.reduce((acc, c) => acc + c.helpful, 0)} helpful ratings</span>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleSummarize} disabled={!post.comments.length}>
              <Sparkles className="mr-2 h-4 w-4" />
              Summarize Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Feedback Summary for "{post.title}"</DialogTitle>
              <DialogDescription>
                AI-powered summary of the comments and advice you received.
              </DialogDescription>
            </DialogHeader>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto p-1">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground md:text-lg">
              Here's a summary of your activity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader><CardTitle>Total Posts</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{myPosts.length}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Comments</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">42</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Helpful Replies</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">18</p></CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Posts</h2>
            {myPosts.length > 0 ? (
                myPosts.map(post => <PostSummary key={post.id} post={post} />)
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        You haven't created any posts yet.
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { PostCard } from '@/components/PostCard';
import { Header } from '@/components/Header';
import { getPosts } from '@/lib/mock-db';
import type { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await getPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const allTags = [...new Set(allPosts.flatMap((p) => p.tags))];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredPosts =
    selectedTags.length > 0
      ? allPosts.filter((post) =>
          selectedTags.every((tag) => post.tags.includes(tag))
        )
      : allPosts;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Community Feed
            </h1>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Find support and connect with others. You are not alone.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Filter by tags:</span>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                    onClick={() => toggleTag(tag)}
                    className="cursor-pointer transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {isLoading ? (
                <>
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No posts found.
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

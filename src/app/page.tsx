'use client';

import { useState } from 'react';
import { PostCard } from '@/components/PostCard';
import { Header } from '@/components/Header';
import { posts as allPosts } from '@/lib/mock-data';
import type { Post } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const allTags = [...new Set(allPosts.flatMap((p) => p.tags))];

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

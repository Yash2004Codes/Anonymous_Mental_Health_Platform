import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { MessageSquare } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle>
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 text-xs">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{post.author.name}</span>
            <span>&middot;</span>
            <span>{post.createdAt}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {post.content}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

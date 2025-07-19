'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import { createPost, generatePostSuggestion, generateTagSuggestions } from './actions';
import { Badge } from '@/components/ui/badge';

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [initialState, formAction] = useFormState(createPost, { message: '' });

  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const handleGeneratePost = async () => {
    if (!content) {
      toast({ title: 'Please enter a short description first.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    try {
      const { generatedPostText } = await generatePostSuggestion(content);
      setContent(generatedPostText);
    } catch (error) {
      toast({ title: 'Failed to generate post.', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSuggestTags = async () => {
    if (!content) {
      toast({ title: 'Please write your post content first.', variant: 'destructive' });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const { tags } = await generateTagSuggestions(content);
      setSuggestedTags(tags);
    } catch (error) {
       toast({ title: 'Failed to suggest tags.', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
        setTags([...tags, tag]);
    }
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
  };

  if (initialState.message === 'success') {
    toast({ title: 'Post created successfully!' });
    router.push('/');
  } else if (initialState.message) {
    toast({ title: 'Error', description: initialState.message, variant: 'destructive' });
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Create a New Post</CardTitle>
                <CardDescription>Share what's on your mind. You are in a safe space.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" placeholder="A short, descriptive title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Your thoughts</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Describe what you're feeling. Start with a few words and let our AI help you elaborate."
                    className="min-h-[200px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleGeneratePost} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Help me get started
                  </Button>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="tags">Tags</Label>
                   <div className="flex flex-wrap gap-2">
                     {tags.map(tag => (
                       <Badge key={tag} variant="secondary">
                         {tag}
                         <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full p-0.5 hover:bg-destructive/20">&times;</button>
                       </Badge>
                     ))}
                   </div>
                   <Input 
                    id="tags"
                    name="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tags and press Enter"
                   />
                   <input type="hidden" name="tags" value={tags.join(',')} />
                   <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggestingTags}>
                    {isSuggestingTags ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Suggest Tags
                   </Button>
                   {suggestedTags.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2">
                       {suggestedTags.map(tag => (
                         <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => addSuggestedTag(tag)}>
                           {tag}
                         </Badge>
                       ))}
                     </div>
                   )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  Post Anonymously
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}

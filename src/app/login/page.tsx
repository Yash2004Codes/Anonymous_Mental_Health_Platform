import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wind } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Wind className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to FeelFree</CardTitle>
          <CardDescription>A safe space for you to share and heal.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-muted-foreground">
            Your privacy is our priority. Sign in anonymously to join our supportive community. No personal information required.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/">Continue Anonymously</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

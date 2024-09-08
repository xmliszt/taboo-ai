'use client';

import { useRouter } from 'next/navigation';
import { BsGoogle } from 'react-icons/bs';
import { toast } from 'sonner';

import { signIn } from '@/components/header/server/sign-in';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type SignInPageProps = {
  searchParams: {
    redirect?: string;
  };
};

export default function SignInPage(props: SignInPageProps) {
  const router = useRouter();
  const { redirect } = props.searchParams;

  const handleSignIn = async () => {
    try {
      await signIn({ redirectTo: redirect });
      if (redirect) router.push(redirect);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to sign in');
    }
  };

  return (
    <main className='flex h-full w-full items-center justify-center'>
      <Card className='w-96'>
        <CardHeader>
          <CardTitle>Sign in to Taboo AI</CardTitle>
          <CardDescription>
            Sign in to Taboo AI to access your account and start playing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className='w-full grow text-center' variant='outline' onClick={handleSignIn}>
            <BsGoogle className='mr-2' />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

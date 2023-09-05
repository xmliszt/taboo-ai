'use client';

import { Spinner } from '@/components/custom/spinner';
import DevToggle from '@/components/custom/dev-toggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { signInWithGoogle } from '@/lib/services/authService';
import { Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import ContactMe from '../components/custom/contact-me';
import InstallButton from '../components/custom/install-button';
import FeatureUpdatesLink from './../components/FeatureUpdatesLink';
import Footer from '@/components/Footer';
import SocialLinkButton from '../components/custom/social-link-button';
import { useAuth } from './AuthProvider';

interface HomePageProps {}

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default function HomePage(props: HomePageProps) {
  const { toast } = useToast();
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState(false);
  const { user, status, setStatus } = useAuth();
  const router = useRouter();
  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleAddTopic = () => {
    if (status === 'authenticated') {
      navigateTo('/add-level');
    } else {
      setIsSignInPromptOpen(true);
    }
  };

  const signIn = async () => {
    setIsSignInPromptOpen(false);
    try {
      setStatus('loading');
      await signInWithGoogle();
      setStatus('authenticated');
    } catch (error) {
      console.error(error.message);
      toast({ title: 'Failed to sign in!' });
      setStatus('unauthenticated');
    }
  };

  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      {status === 'loading' && (
        <div className='w-screen h-screen fixed z-[60] top-0 left-0 flex justify-center items-center backdrop-blur-md'>
          <Spinner />
        </div>
      )}
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex flex-col justify-center items-center overflow-y-scroll scrollbar-hide w-screen gap-2 pt-24 lg:pt-24 pb-32 lg:pb-44'>
        <div className='w-full relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl lg:text-8xl drop-shadow-lg'
          >
            {title} <span className='text-lg'>{versionNumber}</span>
          </h1>
          <FeatureUpdatesLink />
        </div>
        <InstallButton />
        <section className='mt-4 mb-2 flex-col flex gap-8 text-center w-4/5 max-w-[400px]'>
          <Button
            id='start'
            data-testid='link-start'
            data-style='none'
            aria-label='Click to choose a topic to play'
            onClick={() => {
              navigateTo('/levels');
            }}
          >
            Choose Topics
          </Button>
          <Button
            id='edit'
            data-testid='link-edit'
            data-style='none'
            aria-label='Click to contribute new topic'
            onClick={handleAddTopic}
          >
            Contribute New Topics
          </Button>
          {user?.email === 'xmliszt@gmail.com' && status === 'authenticated' ? (
            <Button
              id='edit'
              data-testid='link-dev-review-words'
              data-style='none'
              aria-label='Click to review topics as dev'
              onClick={() => {
                navigateTo('/x/review-words');
              }}
            >
              Review Words
            </Button>
          ) : (
            <></>
          )}
        </section>
        <DevToggle />
        <section className='w-4/5 mt-10'>
          <ContactMe />
        </section>
      </section>

      <div className='fixed bottom-20 lg:bottom-28 w-full flex flex-row gap-2 justify-center z-10'>
        <SocialLinkButton
          content='Buy Me Coffee'
          icon={<Coffee />}
          href='/buymecoffee'
        />
        <SocialLinkButton
          content='Join Discord!'
          icon={<BsDiscord />}
          href='https://discord.gg/dgqs29CHC2'
          newTab={true}
        />
      </div>
      <Footer />
      <div className='h-28 lg:h-36 bw-full fixed bottom-0 z-0 gradient-blur-up'></div>
      <AlertDialog
        open={isSignInPromptOpen}
        onOpenChange={(open) => {
          setIsSignInPromptOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You need to sign in to contribute a topic!
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={signIn}>Sign In Here</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

'use client';

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
import { Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import ContactMe from '../components/custom/contact-me';
import SocialLinkButton from '../components/custom/social-link-button';
import { useAuth } from './AuthProvider';
import Link from 'next/link';
import Header from '@/components/header/Header';

interface HomePageProps {}

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default function HomePage(props: HomePageProps) {
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState(false);
  const { user, status, login } = useAuth();
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
    login && (await login());
  };

  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      <Header isTransparent />
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex flex-col justify-center items-center overflow-y-scroll scrollbar-hide w-screen gap-2 pt-24 lg:pt-24 pb-4'>
        <div className='w-full relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl lg:text-8xl drop-shadow-lg'
          >
            {title}
          </h1>
        </div>
        <span className='text-lg'>{versionNumber}</span>
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
        <section className='mt-10 w-11/12'>
          <ContactMe />
        </section>
        <div className='px-4 my-2 w-full flex flex-col lg:flex-row gap-2 justify-center'>
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
        <p className='px-4 my-2 w-full text-primary text-xs leading-tight text-center'>
          We improve our products and advertising by using Microsoft Clarity to
          see how you use our website. By using our site, you agree that we and
          Microsoft can collect and use this data. Our{' '}
          <Link href='/privacy' className='underline'>
            privacy statement
          </Link>{' '}
          has more details.
        </p>
      </section>

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

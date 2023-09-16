'use client';

import DevToggle from '@/components/custom/dev-toggle';
import { Coffee, PenSquare, Quote, ScrollText, View } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import ContactMe from '../components/custom/contact-me';
import SocialLinkButton from '../components/custom/social-link-button';
import { useAuth } from '../components/auth-provider';
import Header from '@/components/header/header';
import { HomeMenuButton } from '@/components/custom/home-menu-button';
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { AdminManager } from '@/lib/admin-manager';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { IDisplayScore } from '@/lib/types/score.interface';
import { HASH } from '@/lib/hash';

interface HomePageProps {}

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default function HomePage(props: HomePageProps) {
  const [isSignInPromptOpen, setIsSignInPromptOpen] = useState(false);
  const { user, status, login } = useAuth();
  const router = useRouter();
  const { item: scores } = useLocalStorage<IDisplayScore[]>(HASH.scores);

  const handleAddTopic = () => {
    if (status === 'authenticated') {
      router.push('/add-level');
    } else {
      setIsSignInPromptOpen(true);
    }
  };

  const signIn = async () => {
    setIsSignInPromptOpen(false);
    if (login) {
      try {
        await login();
        router.push('/add-level');
      } catch (error) {
        console.error(error);
        EventManager.fireEvent(CustomEventKey.LOGIN_ERROR, error.message);
      }
    }
  };

  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      <Header
        isTransparent
        additionLeftItems={[<DevToggle key='dev-toggle' />]}
      />
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
        <section className='mt-4 mb-2 flex-col flex gap-4 mx-4 max-w-[400px]'>
          <HomeMenuButton
            icon={<Quote size={20} />}
            title='Choose A Topic'
            subtitle='Start playing Taboo AI by choosing one topic that you like.'
            aria-label='Click to choose a topic to start playing'
            href='/levels'
          />
          <HomeMenuButton
            icon={<PenSquare size={20} />}
            title='Contribute New Topics'
            subtitle='Be a contributor! Your creative topic will be played by all Taboo AI players around the world!'
            onClick={handleAddTopic}
            aria-label='Click to contribute a new topic to Taboo AI'
          />
          {scores !== undefined && scores.length > 0 && (
            <HomeMenuButton
              icon={<ScrollText size={20} />}
              title='See my last result'
              subtitle='We found your last played result is cached in the app. You can revisit it here!'
              href='/result'
              aria-label='Click to revisit last game results'
            />
          )}
          {AdminManager.checkIsAdmin(user) && status === 'authenticated' && (
            <HomeMenuButton
              icon={<View size={20} />}
              title='Review Topics & Words'
              subtitle='This mode is only open for admin access. You can review and verify topics and worlds submitted.'
              href='/x/review-words'
              aria-label='Click to review topics as dev'
            />
          )}
        </section>
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
          <a href='/privacy' className='underline'>
            privacy statement
          </a>{' '}
          has more details.
        </p>
      </section>

      <Dialog
        open={isSignInPromptOpen}
        onOpenChange={(open) => {
          setIsSignInPromptOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='leading-snug'>
              You need to sign in to contribute a topic!
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={signIn}>Sign In Here</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

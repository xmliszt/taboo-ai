'use client';

import {
  ArrowUp,
  Coffee,
  Github,
  PenSquare,
  Quote,
  ScrollText,
  View,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { BsDiscord } from 'react-icons/bs';
import ContactMe from '../components/custom/contact-me';
import SocialLinkButton from '../components/custom/social-link-button';
import { useAuth } from '../components/auth-provider';
import { HomeMenuButton } from '@/components/custom/home-menu-button';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { AdminManager } from '@/lib/admin-manager';
import { useAppSelector } from '@/lib/redux/hook';
import { selectScoreStorage } from '@/lib/redux/features/scoreStorageSlice';
import { LoginReminderProps } from '@/components/custom/login-reminder-dialog';
import { useAppStats } from '@/lib/hooks/useAppStats';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';

interface HomePageProps {}

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default function HomePage(props: HomePageProps) {
  const { stats } = useAppStats();
  const { user, status } = useAuth();
  const router = useRouter();
  const scores = useAppSelector(selectScoreStorage);
  const pageViewRef = useRef<number>(0);
  const [isViewsIncreasing, setIsViewsIncreasing] = useState(false);

  useEffect(() => {
    if (stats && !isViewsIncreasing && stats.views > pageViewRef.current) {
      setIsViewsIncreasing(true);
      setTimeout(() => {
        setIsViewsIncreasing(false);
      }, 1000);
      pageViewRef.current = stats.views;
    }
  }, [stats, isViewsIncreasing, pageViewRef]);

  const handleAddTopic = () => {
    if (status === 'authenticated') {
      router.push('/add-level');
    } else {
      EventManager.fireEvent<LoginReminderProps>(
        CustomEventKey.LOGIN_REMINDER,
        {
          title: 'You need to login to contribute a topic',
          redirectHref: '/add-level',
        }
      );
    }
  };

  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex flex-col justify-center items-center overflow-y-scroll scrollbar-hide w-screen gap-2 pt-24 lg:pt-24 pb-4'>
        <div className='relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl lg:text-8xl drop-shadow-lg'
          >
            {title}
          </h1>
          <span className='text-lg absolute -top-6 right-0'>
            {versionNumber}
          </span>
        </div>
        <div className='flex flex-row gap-4 items-center relative'>
          {isViewsIncreasing && (
            <ArrowUp
              size={16}
              className='absolute -right-4 -top-1 animate-ping-once'
            />
          )}
          <Badge>Total Views: {stats?.views}</Badge>
        </div>
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
        <div className='my-6 w-11/12 flex flex-col gap-4 relative'>
          <div className='absolute top-4 left-0 flex flex-row justify-center items-center w-full px-4'>
            <span className='font-semibold text-lg text-center'>
              Subscribe to receive the latest updates about Taboo AI, and many
              more about EdTech! 🚀
            </span>
          </div>
          <iframe
            src='https://liyuxuan.substack.com/embed'
            width='100%'
            height='550'
            style={{ fontFamily: 'lora' }}
            className='border-[1px] rounded-lg bg-card text-card-foreground w-full shadow-lg'
            scrolling='no'
          ></iframe>
        </div>
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
          <SocialLinkButton
            content='Open Source'
            icon={<Github />}
            href='https://github.com/xmliszt/Taboo-AI'
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
    </main>
  );
}

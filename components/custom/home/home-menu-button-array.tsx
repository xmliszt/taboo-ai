'use client';

import React, { MouseEventHandler, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BookPlus, BrainCircuit, CircleUser, PenSquare, Quote, User, View } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/auth-provider';
import { SignInReminderProps } from '@/components/custom/globals/sign-in-reminder-dialog';
import { signIn } from '@/components/header/server/sign-in';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

import { HomeMenuButton } from '../home-menu-button';

interface HomeMenuButtonData {
  key: string;
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: MouseEventHandler;
  ariaLabel: string;
  visible: boolean;
  cta?: boolean;
}

export default function HomeMenuButtonArray() {
  const { user } = useAuth();
  const router = useRouter();

  const handleAddTopic = () => {
    if (user) {
      router.push('/add-level');
    } else {
      EventManager.fireEvent<SignInReminderProps>(CustomEventKey.SIGN_IN_REMINDER, {
        title: 'You need to sign in to contribute a topic',
        redirectHref: '/add-level',
      });
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to sign in');
    }
  };

  const homeMenuButtonData = useMemo<HomeMenuButtonData[]>(
    () => [
      {
        key: 'sign in',
        // eslint-disable-next-line react/jsx-no-undef
        icon: <CircleUser size={20} />,
        title: 'Sign in',
        subtitle:
          'Unlock personal profile, game history, join topic rankings, and contribute new topics!',
        ariaLabel: 'Click to sign in',
        onClick: handleSignIn,
        visible: user === undefined,
      },
      {
        key: 'play a topic',
        icon: <Quote size={20} />,
        title: 'Play public topics',
        subtitle: 'Start playing with public topics contributed by players around the world!',
        ariaLabel: 'Click to choose a topic to start playing',
        href: '/levels',
        visible: true,
      },
      {
        key: 'ai mode',
        icon: <BrainCircuit size={20} />,
        title: 'Play AI generated topic',
        subtitle: 'Play with AI generated topics for endless possibilities!',
        ariaLabel: 'Click to play with AI generated topics',
        href: '/ai',
        visible: true,
        cta: true,
      },
      {
        key: 'contribute a topic',
        icon: <PenSquare size={20} />,
        title: 'Contribute new topics',
        subtitle:
          'Be a contributor! Your creative topic will be played by all Taboo AI players around the world!',
        ariaLabel: 'Click to contribute a new topic to Taboo AI',
        onClick: handleAddTopic,
        visible: user !== undefined,
      },
      {
        key: 'view my profile',
        icon: <User size={20} />,
        title: 'View my profile',
        subtitle:
          'Access your game history, statistics, edit nickname, manage privacy settings, and more!',
        ariaLabel: 'Click to visit your personal profile',
        href: '/profile',
        visible: user !== undefined,
      },
      {
        key: 'upgrade plan',
        icon: <BookPlus size={20} />,
        title: 'Upgrade my plan',
        subtitle: 'Become a PRO. Upgrade your plan to enjoy more exclusive PRO features.',
        ariaLabel: 'Click to upgrade your plan',
        href: '/pricing',
        visible: !user || user.subscription?.customer_plan_type === 'free',
      },
      {
        key: 'review topic and words',
        icon: <View size={20} />,
        title: 'Review topics & words',
        subtitle: 'Review and verify topics and worlds submitted. Only available for admin!',
        ariaLabel: 'Click to review topics as dev',
        href: '/x/review-words',
        visible: user?.is_dev ?? false,
      },
    ],
    [user]
  );

  return (
    <section className='mx-4 mb-2 mt-4 flex max-w-[400px] flex-col gap-4'>
      {homeMenuButtonData.map(
        (data) =>
          data.visible && (
            <HomeMenuButton
              key={data.key}
              icon={data.icon}
              title={data.title}
              subtitle={data.subtitle}
              href={data.href}
              onClick={data.onClick}
              aria-label={data.ariaLabel}
              cta={data.cta}
            />
          )
      )}
    </section>
  );
}

'use client';

import React, { MouseEventHandler, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BookMarked, BookPlus, CircleUser, PenSquare, Quote, User, View } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/auth-provider';
import { LoginReminderProps } from '@/components/custom/globals/login-reminder-dialog';
import { login } from '@/components/header/server/login';
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
}

export default function HomeMenuButtonArray() {
  const { user } = useAuth();
  const router = useRouter();

  const handleAddTopic = () => {
    if (user) {
      router.push('/add-level');
    } else {
      EventManager.fireEvent<LoginReminderProps>(CustomEventKey.LOGIN_REMINDER, {
        title: 'You need to login to contribute a topic',
        redirectHref: '/add-level',
      });
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to log in');
    }
  };

  const homeMenuButtonData = useMemo<HomeMenuButtonData[]>(
    () => [
      {
        key: 'log in',
        // eslint-disable-next-line react/jsx-no-undef
        icon: <CircleUser size={20} />,
        title: 'Log in',
        subtitle:
          'Unlock personal profile, game history, join topic rankings, and contribute new topics!',
        ariaLabel: 'Click to log in',
        onClick: handleLogin,
        visible: user === undefined,
      },
      {
        key: 'play a topic',
        icon: <Quote size={20} />,
        title: 'Choose a topic',
        subtitle: 'Start playing Taboo AI by choosing one topic that you like.',
        ariaLabel: 'Click to choose a topic to start playing',
        href: '/levels',
        visible: true,
      },
      {
        key: 'contribute a topic',
        icon: <PenSquare size={20} />,
        title: 'Contribute new topics',
        subtitle:
          'Be a contributor! Your creative topic will be played by all Taboo AI players around the world!',
        ariaLabel: 'Click to contribute a new topic to Taboo AI',
        onClick: handleAddTopic,
        visible: true,
      },
      {
        key: 'view pricing',
        icon: <BookMarked size={20} />,
        title: 'Taboo AI pricing',
        subtitle:
          'Taboo AI offers both free and paid plans. Choose a plan that suits you the best! PRO plan offers more exclusive features, including AI Mode!',
        ariaLabel: 'Click to upgrade your subscription',
        href: '/pricing',
        visible: user === undefined,
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
        visible: user?.subscription?.customer_plan_type === 'free',
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
            />
          )
      )}
    </section>
  );
}

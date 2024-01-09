'use client';

import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUser, PenSquare, Quote, ScrollText, User, View } from 'lucide-react';

import { useAuth } from '@/components/auth-provider';
import { LoginErrorEventProps } from '@/components/custom/login-error-dialog';
import { AdminManager } from '@/lib/admin-manager';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { bindPersistence, getPersistence } from '@/lib/persistence/persistence';
import IGame from '@/lib/types/game.type';
import { isGameFinished } from '@/lib/utils/gameUtils';

import { HomeMenuButton } from '../home-menu-button';
import { LoginReminderProps } from '../login-reminder-dialog';

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
  const { user, status, login } = useAuth();
  const router = useRouter();
  const [game, setGame] = useState<IGame | null>(null);

  useEffect(() => {
    const game = getPersistence<IGame>(HASH.game);
    setGame(game);
    const unbind = bindPersistence<IGame>(HASH.game, setGame);
    return () => {
      unbind();
    };
  }, []);

  const handleAddTopic = () => {
    if (status === 'authenticated') {
      router.push('/add-level');
    } else {
      EventManager.fireEvent<LoginReminderProps>(CustomEventKey.LOGIN_REMINDER, {
        title: 'You need to login to contribute a topic',
        redirectHref: '/add-level',
      });
    }
  };

  const handleLogin = async () => {
    if (!login) return;
    try {
      await login();
    } catch (error) {
      console.error(error);
      EventManager.fireEvent<LoginErrorEventProps>(CustomEventKey.LOGIN_ERROR, {
        error: error.message,
      });
    }
  };

  const homeMenuButtonData = useMemo<HomeMenuButtonData[]>(
    () => [
      {
        key: 'log in',
        icon: <CircleUser size={20} />,
        title: 'Log In',
        subtitle:
          'Log in to Taboo AI to unlock your personal profile, game history, and contribute a topic to us!',
        ariaLabel: 'Click to log in',
        onClick: handleLogin,
        visible: status !== 'authenticated',
      },
      {
        key: 'play a topic',
        icon: <Quote size={20} />,
        title: 'Choose A Topic',
        subtitle: 'Start playing Taboo AI by choosing one topic that you like.',
        ariaLabel: 'Click to choose a topic to start playing',
        href: '/levels',
        visible: true,
      },
      {
        key: 'contribute a topic',
        icon: <PenSquare size={20} />,
        title: 'Contribute New Topics',
        subtitle:
          'Be a contributor! Your creative topic will be played by all Taboo AI players around the world!',
        ariaLabel: 'Click to contribute a new topic to Taboo AI',
        onClick: handleAddTopic,
        visible: true,
      },
      {
        key: 'see last result',
        icon: <ScrollText size={20} />,
        title: 'See my last result',
        subtitle: 'We found your last played result is cached in the app. You can revisit it here!',
        ariaLabel: 'Click to revisit last game results',
        href: '/result',
        visible: isGameFinished(game) && status !== 'authenticated',
      },
      {
        key: 'view my profile',
        icon: <User size={20} />,
        title: 'View My Profile',
        subtitle:
          'Access your personal profile to see your game history, game statistics, edit your nickname, manage privacy settings, delete yoru account, and more!',
        ariaLabel: 'Click to visit your personal profile',
        href: '/profile',
        visible: user !== undefined && status === 'authenticated',
      },
      {
        key: 'review topic and words',
        icon: <View size={20} />,
        title: 'Review Topics & Words',
        subtitle: 'Review and verify topics and worlds submitted. Only available for admin!',
        ariaLabel: 'Click to review topics as dev',
        href: '/x/review-words',
        visible: AdminManager.checkIsAdmin(user) && status === 'authenticated',
      },
    ],
    [user, status, game]
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { bindPersistence, getPersistence } from '@/lib/persistence/persistence';
import IGame from '@/lib/types/game.type';
import { isGameFinished } from '@/lib/utils/gameUtils';

import { useAuth } from '../auth-provider';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import AccessLinkCard, { MenuItem } from './common/access-link-card';
import { LoginErrorEventProps } from './globals/login-error-dialog';
import { LoginReminderProps } from './globals/login-reminder-dialog';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [game, setGame] = useState<IGame | null>(null);
  const { user, status, login } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const game = getPersistence<IGame>(HASH.game);
    setGame(game);
    const unbind = bindPersistence<IGame>(HASH.game, setGame);
    return () => {
      unbind();
    };
  }, []);

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.TOGGLE_MENU,
      ({ detail }: { detail: boolean }) => {
        const isOpen = detail as boolean;
        setIsOpen(isOpen ?? false);
      }
    );
    return () => {
      EventManager.removeListener(CustomEventKey.TOGGLE_MENU, listener);
    };
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const currentSelectedIndex = Math.max(
      0,
      menuItems.findIndex((item) => item.path === pathname)
    );
    const currentSelectedElement = document.getElementById(`menu-${currentSelectedIndex}`);
    currentSelectedElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [isFocused, pathname]);

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

  const handleContributeTopic = () => {
    if (user && status === 'authenticated') {
      router.push('/add-level');
    } else {
      EventManager.fireEvent<LoginReminderProps>(CustomEventKey.LOGIN_REMINDER, {
        title: 'You need to login to contribute a topic',
        redirectHref: '/add-level',
      });
    }
  };

  const menuItems: MenuItem[] = useMemo<MenuItem[]>(
    () => [
      {
        path: '/',
        title: 'Home',
        subtitle: 'Go back to home page',
        visible: pathname !== '/',
        href: '/',
      },
      {
        path: 'login',
        title: 'Login',
        subtitle:
          'Login to enjoy much more features! Contribute topics, personal profile, view game statistics, join rankings, and more!',
        visible: user === undefined || status !== 'authenticated',
        highlight: true,
        onClick: handleLogin,
      },
      {
        path: '/levels',
        title: 'Choose A Topic',
        subtitle:
          'Start playing Taboo AI by choosing any of the listed topic as you like. Can\'t find the topic you are looking for? Give "AI Mode" a try!',
        visible: true,
        href: '/levels',
      },
      {
        path: '/add-level',
        title: 'Contribute A Topic',
        subtitle:
          'Be a contributor! Your creative topic will be played by all Taboo AI players around the world!',
        visible: true,
        onClick: handleContributeTopic,
      },
      {
        path: '/result',
        title: 'See my last result',
        subtitle: 'We found your last played result is cached in the app. You can revisit it here!',
        visible: status != 'authenticated' && isGameFinished(game),
        href: '/result',
      },
      {
        path: '/profile',
        title: 'My Profile',
        subtitle:
          'Access your personalized profile here. Change your nickname, view past results, game statistics, manage privacy settings, delete your account...',
        visible: user !== undefined && status === 'authenticated',
        href: '/profile',
      },
      {
        path: '/pricing',
        title: 'Pricing',
        subtitle:
          'Taboo AI is free to play. However, you can choose to subscribe to our PRO plan to enjoy exclusive features!',
        visible: true,
        href: '/pricing',
      },
      {
        path: 'separator',
        title: 'separator',
        subtitle: '',
        visible: true,
      },
      {
        path: '/about',
        title: 'About Taboo AI',
        subtitle: 'New to Taboo AI? Here is all you need to know!',
        visible: true,
        href: '/about',
      },
      {
        path: '/rule',
        title: 'Rules of Taboo AI',
        subtitle: 'Find out about how to play Taboo AI here!',
        visible: true,
        href: '/rule',
      },
      {
        path: '/pwa',
        title: 'Install Taboo AI',
        subtitle: 'Taboo AI is available to install on your device as a PWA(Progressive Web App)!',
        visible: true,
        href: '/pwa',
      },
      {
        path: '/whatsnew',
        title: 'Latest Features',
        subtitle: "Take a look at Taboo AI's latest features!",
        visible: true,
        href: '/whatsnew',
      },
      {
        path: '/roadmap',
        title: 'Project Roadmap',
        subtitle:
          'Taboo AI has come a long way so far. Join me together to review the exciting journey!',
        visible: true,
        href: '/roadmap',
      },
    ],
    [user, status, game, pathname]
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <SheetContent
        side='left'
        className={`${isMobile ? 'w-full' : 'w-auto'}`}
        onOpenAutoFocus={() => {
          setIsFocused(true);
        }}
        onCloseAutoFocus={() => {
          setIsFocused(false);
        }}
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Explore the various functionalities of Taboo AI!</SheetDescription>
        </SheetHeader>
        <Separator className='mt-2' />
        <div className='flex h-full flex-col gap-4 overflow-y-scroll p-4 pb-16 scrollbar-hide'>
          {menuItems.map((item, idx) =>
            item.title === 'separator' ? (
              <Separator key={`sep-${idx}`} />
            ) : (
              item.visible && (
                <AccessLinkCard
                  key={`menu-${item.path}`}
                  idx={idx}
                  item={item}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                />
              )
            )
          )}
          <Separator />
          <article className='mt-4'>
            <p>
              <i>Powered by </i>
              <Link href='https://beta.nextjs.org/docs/getting-started' target='_blank'>
                NextJS
              </Link>
              <i> &amp; </i>
              <Link href='https://openai.com/api/' target='_blank'>
                OpenAI
              </Link>
              <i> &amp; </i>
              <Link
                href='https://deepmind.google/technologies/gemini/#introduction'
                target='_blank'
              >
                Gemini Pro
              </Link>
            </p>
            <p>
              <i>Developed by </i>
              <Link href='https://xmliszt.github.io/' target='_blank'>
                Li Yuxuan
              </Link>
            </p>
            <p>
              <Link
                href='/pricing'
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Pricing
              </Link>
            </p>
            <p>
              <Link href='/privacy'>Privacy Policy</Link>
            </p>
            <p>
              <Link href='/cookie-policy'>Cookie Policy</Link>
            </p>
            <p>
              <Link
                href='/sitemap'
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Sitemap
              </Link>
            </p>
            <p>
              <Link href='https://liyuxuan.substack.com'>Newsletters</Link>
            </p>
            <p>
              <i>Taboo AI is an open-source project. Feel free to </i>
              <Link href='https://github.com/xmliszt/Taboo-AI' target='_blank'>
                contribute on GitHub.
              </Link>{' '}
            </p>
          </article>
        </div>
      </SheetContent>
    </Sheet>
  );
}

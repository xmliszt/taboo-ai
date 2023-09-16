'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { isMobile } from 'react-device-detect';
import { Construction } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '../auth-provider';
import { IDisplayScore } from '@/lib/types/score.interface';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { HASH } from '@/lib/hash';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import Link from 'next/link';

interface MenuItem {
  title: string;
  subtitle: string;
  visible: boolean;
  isUpcoming?: boolean;
  highlight?: boolean;
  href?: string;
  onClick?: MouseEventHandler;
}

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { item: scores } = useLocalStorage<IDisplayScore[]>(HASH.scores);
  const { user, status, login } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    EventManager.bindEvent(CustomEventKey.TOGGLE_MENU, ({ detail }) => {
      const isOpen = detail as boolean;
      setIsOpen(isOpen ?? false);
    });
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    const currentSelectedIndex = Math.max(
      0,
      menuItems.findIndex((item) => item.href === pathname)
    );
    const currentSelectedElement = document.getElementById(
      `menu-${currentSelectedIndex}`
    );
    currentSelectedElement?.scrollIntoView({ behavior: 'smooth' });
  }, [isFocused]);

  const handleLogin = async () => {
    if (!login) return;
    try {
      await login();
    } catch (error) {
      console.error(error);
      EventManager.fireEvent(CustomEventKey.LOGIN_ERROR, error.message);
    }
  };

  const menuItems: MenuItem[] = useMemo<MenuItem[]>(
    () => [
      {
        title: 'Home',
        subtitle: 'Go back to home page',
        visible: pathname !== '/',
        href: '/',
      },
      {
        title: 'Login',
        subtitle:
          'Login to Taboo AI to enjoy more features! You can contribute more topics for others to play. Personal profile and flashcards are coming soon!',
        visible: user === undefined || status !== 'authenticated',
        highlight: true,
        onClick: handleLogin,
      },
      {
        title: 'Choose A Topic',
        subtitle:
          'Start playing Taboo AI by choosing any of the listed topic as you like. Can\'t find the topic you are looking for? Give "AI Mode" a try!',
        visible: true,
        href: '/levels',
      },
      {
        title: 'Contribute A Topic',
        subtitle:
          'Be a contributor! Your creative topic will be played by all Taboo AI players around the world!',
        visible: user !== undefined && status === 'authenticated',
        href: '/add-level',
      },
      {
        title: 'See my last result',
        subtitle:
          'We found your last played result is cached in the app. You can revisit it here!',
        visible: scores !== undefined && scores.length > 0,
        href: '/result',
      },
      {
        title: 'My Profile',
        subtitle:
          'Access your personalized profile here. Manage your flashcards. Play custom games. And much more...',
        visible: user !== undefined && status === 'authenticated',
        isUpcoming: true,
        href: '/profile',
      },
      {
        title: 'separator',
        subtitle: '',
        visible: true,
      },
      {
        title: 'Rules of Taboo AI',
        subtitle: 'Find out about how to play Taboo AI here!',
        visible: true,
        href: '/rule',
      },
      {
        title: 'Install Taboo AI',
        subtitle:
          'Taboo AI is available to install on your device as a PWA(Progressive Web App)!',
        visible: true,
        href: '/pwa',
      },
      {
        title: 'Latest Features',
        subtitle: "Take a look at Taboo AI's latest features!",
        visible: true,
        href: '/whatsnew',
      },
      {
        title: 'Project Roadmap',
        subtitle:
          'Taboo AI has come a long way so far. Join me together to review the exciting journey!',
        visible: true,
        href: '/roadmap',
      },
    ],
    [user, status, scores, pathname]
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
          <SheetDescription>
            Explore the various functionalities of Taboo AI!
          </SheetDescription>
        </SheetHeader>
        <Separator className='mt-2' />
        <div className='p-4 pb-16 flex flex-col gap-4 h-full overflow-y-scroll scrollbar-hide'>
          {menuItems.map((item, idx) =>
            item.title === 'separator' ? (
              <Separator key={`sep-${idx}`} />
            ) : (
              item.visible && (
                <Card
                  key={item.title}
                  id={`menu-${idx}`}
                  className={cn(
                    item.highlight ? 'border-green-500' : '',
                    pathname === item.href
                      ? 'border-4 border-primary font-bold'
                      : '',
                    item.isUpcoming && 'opacity-20',
                    'hover:shadow-lg hover:cursor-pointer hover:scale-105 transition-all ease-in-out'
                  )}
                  onClick={(e) => {
                    if (item.isUpcoming || item.href === pathname) {
                      return;
                    }
                    setIsOpen(false);
                    item.onClick && item.onClick(e);
                    item.href && router.push(item.href);
                  }}
                >
                  <CardHeader>
                    {item.isUpcoming === true && <Construction />}
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>
                      {item.isUpcoming
                        ? 'Taboo AI is still developing this feature for you. Stay tuned for more updates!'
                        : item.subtitle}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            )
          )}
          <Separator />
          <article className='mt-4'>
            <p>
              <i>Powered by </i>
              <Link
                href='https://beta.nextjs.org/docs/getting-started'
                target='_blank'
              >
                NextJS
              </Link>
              <i> &amp; </i>
              <Link href='https://openai.com/api/' target='_blank'>
                OpenAI
              </Link>
            </p>
            <p>
              <i>Developed by </i>
              <Link href='https://xmliszt.github.io/' target='_blank'>
                Li Yuxuan
              </Link>
            </p>
            <p>
              <Link href='/privacy'>Privacy Policy</Link>
            </p>
            <p>
              <Link href='/cookie-policy'>Cookie Policy</Link>
            </p>
          </article>
        </div>
      </SheetContent>
    </Sheet>
  );
}

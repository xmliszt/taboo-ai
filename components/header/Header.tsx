'use client';

import { useAuth } from '@/app/AuthProvider';
import { cn } from '@/lib/utils';
import { ArrowLeft, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactMarkdown from 'react-markdown';
import content from './content.md';
import { UserLoginPortal } from '../custom/user-login-portal';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import IconButton from '../ui/icon-button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import { ThemeToggle } from '../custom/theme-toggle';

interface HeaderProps {
  title?: string;
  hideMenu?: boolean;
  hideUserMenu?: boolean;
  hideThemeToggle?: boolean;
  isTransparent?: boolean;
  hasBackButton?: boolean;
  additionLeftItems?: React.ReactElement[];
  additionRightItems?: React.ReactElement[];
}

interface MenuItem {
  title: string;
  subtitle: string;
  visible: boolean;
  highlight?: boolean;
  href?: string;
  onClick?: MouseEventHandler;
}

const Header = ({
  title = '',
  hideMenu = false,
  hideUserMenu = false,
  hideThemeToggle = false,
  isTransparent = false,
  hasBackButton = false,
  additionLeftItems = [],
  additionRightItems = [],
}: HeaderProps) => {
  const { user, status, login } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
          'Login to Taboo AI to enjoy more features! You can contribute topics for other players to play, own customized profile to manage your word flashcards, and much more!',
        visible: user === undefined || status !== 'authenticated',
        highlight: true,
        onClick: login,
      },
      {
        title: 'Choose A Topic',
        subtitle:
          'Start playing Taboo AI by choosing any of the listed topic as you like. Can\'t find the topic you are looking for? Give "AI Mode" a try!',
        visible: true,
        href: '/levels',
      },
      {
        title: 'My Profile',
        subtitle:
          'Access your personalized profile here. Manage your flashcards. Play custom games. And much more...',
        visible: user !== undefined && status === 'authenticated',
        href: '/profile',
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
    [user, status]
  );

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
    console.log(`Scroll to ${currentSelectedIndex}`);
    console.log(currentSelectedElement);
    currentSelectedElement?.scrollIntoView({ behavior: 'smooth' });
  }, [isFocused]);

  return (
    <header
      id='header-section'
      className={cn(
        isTransparent ? '' : 'bg-card',
        'w-full fixed top-0 h-16 lg:h-20 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center'
      )}
    >
      <div id='left-header-slot' className='flex justify-start gap-1'>
        {hideMenu === true ? (
          <></>
        ) : (
          <Sheet
            open={menuOpen}
            onOpenChange={(isOpen) => {
              setMenuOpen(isOpen);
            }}
          >
            <SheetTrigger asChild>
              <IconButton tooltip='Open Menu'>
                <Menu />
              </IconButton>
            </SheetTrigger>
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
                {menuItems.map(
                  (item, idx) =>
                    item.visible && (
                      <Card
                        key={item.title}
                        id={`menu-${idx}`}
                        className={cn(
                          item.highlight ? 'animate-pulse' : '',
                          pathname === item.href
                            ? 'border-4 border-primary font-bold'
                            : '',
                          'hover:shadow-lg hover:cursor-pointer hover:scale-105 transition-all ease-in-out'
                        )}
                        onClick={(e) => {
                          setMenuOpen(false);
                          item.onClick && item.onClick(e);
                          item.href && router.push(item.href);
                        }}
                      >
                        <CardHeader>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription>{item.subtitle}</CardDescription>
                        </CardHeader>
                      </Card>
                    )
                )}
                <Separator />
                <article className='mt-4'>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </article>
              </div>
            </SheetContent>
          </Sheet>
        )}
        {hasBackButton === true ? (
          <IconButton
            tooltip='Go Back'
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft />
          </IconButton>
        ) : (
          <></>
        )}
        {!hideThemeToggle && <ThemeToggle />}
        {additionLeftItems.map((item) => item)}
      </div>
      <h1
        data-testid='heading-rule-title'
        className='absolute -z-10 left-0 w-full text-center text-xl'
      >
        {title}
      </h1>
      <div id='right-header-slot' className='flex justify-end gap-1'>
        {additionRightItems.reverse().map((item) => item)}
        {!hideUserMenu && <UserLoginPortal />}
      </div>
    </header>
  );
};

export default Header;

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import { BiBook, BiCart, BiCoffeeTogo, BiCookie, BiMapAlt, BiMask } from 'react-icons/bi';
import { BsDiscord } from 'react-icons/bs';
import { toast } from 'sonner';

import { feedback } from '@/components/custom/globals/generic-feedback-dialog';
import { signIn } from '@/components/header/server/sign-in';
import { Button } from '@/components/ui/button';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

import { useAuth } from '../auth-provider';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import AccessLinkCard, { MenuItem } from './common/access-link-card';
import { SignInReminderProps } from './globals/sign-in-reminder-dialog';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to sign in');
    }
  };

  const handleContributeTopic = () => {
    if (user) {
      router.push('/add-level');
    } else {
      EventManager.fireEvent<SignInReminderProps>(CustomEventKey.SIGN_IN_REMINDER, {
        title: 'You need to sign in to contribute a topic',
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
        path: 'sign-in',
        title: 'Sign in',
        subtitle:
          'Sign in to enjoy much more features! Contribute topics, personal profile, view game statistics, join rankings, and more!',
        visible: user === undefined,
        highlight: true,
        onClick: handleSignIn,
      },
      {
        path: '/levels',
        title: 'Play public topics',
        subtitle:
          'Start playing Taboo AI with public topics contributed by players around the world!',
        visible: true,
        href: '/levels',
      },
      {
        path: '/ai',
        title: 'Play AI generated topics',
        subtitle:
          'Play with AI generated topics for endless possibilities! Exclusive to pro plan subscribers!',
        visible: true,
        href: '/ai',
        cta: true,
      },
      {
        path: '/add-level',
        title: 'Contribute a topic',
        subtitle:
          'Be a contributor! Your creative topic will be played by all Taboo AI players around the world!',
        visible: true,
        onClick: handleContributeTopic,
      },
      {
        path: '/profile',
        title: 'My profile',
        subtitle:
          'Access your personalized profile here. Change your nickname, view past results, game statistics, manage privacy settings, delete your account...',
        visible: user !== undefined,
        href: '/profile',
      },
      {
        path: '/pricing',
        title:
          !user || user.subscription?.customer_plan_type === 'free'
            ? 'Become a pro player'
            : 'Pricing',
        subtitle:
          !user || user.subscription?.customer_plan_type === 'free'
            ? 'Taboo AI is free to play. However, you can enjoy more exclusive features by subscribing to our pro plan!'
            : 'View pricing plans to discover what exclusive features you can enjoy as a pro player!',
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
        title: 'Latest features',
        subtitle: "Take a look at Taboo AI's latest features!",
        visible: true,
        href: '/whatsnew',
      },
      {
        path: '/roadmap',
        title: 'Project roadmap',
        subtitle:
          'Taboo AI has come a long way so far. Join me together to review the exciting journey!',
        visible: true,
        href: '/roadmap',
      },
    ],
    [user, pathname]
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
                  cta={item.cta}
                />
              )
            )
          )}
          <Button
            variant={'outline'}
            onClick={() => {
              feedback({
                title: 'Feedback',
                description: 'How do you feel about our app? Any suggestions or bugs? Let us know!',
                user: user,
              });
            }}
          >
            Feedback to us <ArrowRight size={15} className={'ml-2'} />{' '}
          </Button>
          <Separator />
          <article className='flex flex-col gap-1 py-1'>
            <Link
              className='group/pricing'
              href={'/pricing'}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Pricing{' '}
              <BiCart className='ml-2 inline-block transition-transform ease-in-out group-hover/pricing:rotate-[30deg]' />
            </Link>
            <Link className='group/privacy-policy' href={'/privacy'} target='_blank'>
              Privacy policy{' '}
              <BiMask className='ml-2 inline-block transition-transform ease-in-out group-hover/privacy-policy:rotate-[30deg]' />
            </Link>
            <Link className='group/cookie-policy' href={'/cookie-policy'} target='_blank'>
              Cookie policy{' '}
              <BiCookie className='ml-2 inline-block transition-transform ease-in-out group-hover/cookie-policy:rotate-[30deg]' />
            </Link>
            <Link
              className='group/sitemap'
              href={'/sitemap'}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Sitemap{' '}
              <BiMapAlt className='ml-2 inline-block transition-transform ease-in-out group-hover/sitemap:rotate-[30deg]' />
            </Link>
            <Link
              className='group/publications'
              href={'/publications'}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Publications{' '}
              <BiBook className='ml-2 inline-block transition-transform ease-in-out group-hover/publications:rotate-[30deg]' />
            </Link>
            <Link
              className='group/buymecoffee'
              href={'/buymecoffee'}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Buy me a coffee{' '}
              <BiCoffeeTogo className='ml-2 inline-block transition-transform ease-in-out group-hover/buymecoffee:rotate-[30deg]' />
            </Link>
            <Link
              className='group/discord'
              href='https://discord.gg/dgqs29CHC2'
              target='_blank'
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Join Taboo AI Discord community{' '}
              <BsDiscord className='ml-2 inline-block transition-transform ease-in-out group-hover/discord:rotate-[30deg]' />
            </Link>

            <Separator className='my-1' />

            <span>
              <i>Powered by </i>
              <Link href='https://beta.nextjs.org/docs/getting-started' target='_blank'>
                NextJS
              </Link>
              <i> &amp; </i>
              <Link
                href='https://deepmind.google/technologies/gemini/#introduction'
                target='_blank'
              >
                Gemini Pro
              </Link>
            </span>
            <span>
              <i>Developed by </i>
              <Link href='https://liyuxuan.dev/' target='_blank'>
                Li Yuxuan
              </Link>
            </span>
            <span>
              <i>Taboo AI is an open-source project. Feel free to </i>
              <Link href='https://github.com/xmliszt/Taboo-AI' target='_blank'>
                contribute on GitHub.
              </Link>{' '}
            </span>
          </article>
        </div>
      </SheetContent>
    </Sheet>
  );
}

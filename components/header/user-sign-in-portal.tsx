'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { AlignJustify, CircleUser, Construction, LogOut, PenTool, User } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/auth-provider';
import { signIn } from '@/components/header/server/sign-in';
import { signOut } from '@/components/header/server/sign-out';
import { Button } from '@/components/ui/button';
import { useLogSnag } from '@/lib/logsnag/use-controlled-logsnag';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import IconButton from '../ui/icon-button';

function shouldShowSignInIconWithLabel(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/levels' ||
    pathname === '/ai' ||
    pathname === '/profile' ||
    pathname === '/result' ||
    pathname === '/pricing'
  );
}

type UserMenuItem = {
  label: string;
  icon: React.ReactElement;
  isVisible: boolean;
  isUpcoming?: boolean;
  onClick: ((event: Event) => void) | ((event: Event) => Promise<void>);
};

let hasGreeted = false;

export function UserSignInPortal() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { setUserId, identify, track } = useLogSnag();

  useEffect(() => {
    if (user && !hasGreeted) {
      if (user.login_times <= 1) {
        toast(`Welcome to Taboo AI 🎉 ${user.nickname ?? user.name}!`);
      } else {
        toast(`Welcome back, ${user.nickname ?? user.name}!`);
      }
      setUserId(user.id);
      identify({
        user_id: user.id,
        properties: {
          email: user.email,
          name: user.name,
          nickname: user.nickname ?? 'no nickname',
          photo_url: user.photo_url ?? 'no photo',
          first_login_at: user.first_login_at,
          last_login_at: user.last_login_at,
        },
      });
      track({
        channel: 'auth',
        event: 'login',
        user_id: user.id,
        icon: '👋',
        tags: {
          env: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'no env identified',
        },
      });
      hasGreeted = true;
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to sign in');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast(`Bye bye, ${user?.nickname ?? user?.name}! 👋`);
      user &&
        track({
          channel: 'auth',
          event: 'logout',
          user_id: user.id,
          icon: '👋',
          tags: {
            env: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'no env identified',
          },
        });
      hasGreeted = false;
      setTimeout(() => {
        window.location.href = '/';
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error('Sorry, we are unable to log you out. Please try again!');
    }
  };

  const userMenuItems: UserMenuItem[] = useMemo(() => {
    return [
      {
        label: 'Contribute topics',
        icon: <PenTool />,
        isVisible: pathname !== '/add-level',
        onClick: () => {
          router.push('/add-level');
        },
      },
      {
        label: 'Profile',
        icon: <User />,
        isVisible: pathname !== '/profile',
        onClick: () => {
          router.push('/profile');
        },
      },
      {
        label: 'Sign out',
        icon: <LogOut />,
        isVisible: true,
        onClick: handleSignOut,
      },
    ];
  }, [pathname, user]);

  return user ? (
    <div className='flex flex-row items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Click to access user menu'
            className='group/user-login-portal flex h-[32px] flex-row items-center gap-1 p-1'
          >
            <Image
              className='rounded-[7px] transition-transform ease-in-out group-hover/user-login-portal:-rotate-12'
              src={user.photo_url || '/images/placeholder.png'}
              alt='user avatar'
              width={23}
              height={23}
            />
            <AlignJustify
              size={20}
              className='transition-transform ease-in-out group-hover/user-login-portal:rotate-12 group-aria-[expanded=true]/user-login-portal:rotate-90'
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent loop sideOffset={10} align='end'>
          <DropdownMenuLabel className='flex flex-col'>
            <span className='font-light italic'>You are logged in as</span>
            <span>{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userMenuItems.map(
            (item) =>
              item.isVisible && (
                <DropdownMenuItem
                  key={item.label}
                  className={cn('gap-2 hover:cursor-pointer', item.isUpcoming && 'opacity-20')}
                  onSelect={(e) => {
                    if (item.isUpcoming) {
                      e.preventDefault();
                      return;
                    }
                    item.onClick(e);
                  }}
                >
                  {item.isUpcoming ? <Construction /> : item.icon}
                  <span>{item.label + (item.isUpcoming ? ' (coming soon)' : '')}</span>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div>
      {shouldShowSignInIconWithLabel(pathname) ? (
        <Button aria-label='Click to sign in' onClick={handleSignIn} className='h-[32px] px-2 py-1'>
          <div className='flex flex-row items-center gap-1'>
            <CircleUser size='23' />
            Sign in
          </div>
        </Button>
      ) : (
        <IconButton aria-label='Click to sign in' tooltip='Sign in' onClick={handleSignIn}>
          <CircleUser />
        </IconButton>
      )}
    </div>
  );
}

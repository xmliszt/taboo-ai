'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Construction, LogIn, LogOut, PenTool, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth-provider';
import { signOut } from '@/components/header/server/sign-out';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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

  useEffect(() => {
    if (user && !hasGreeted) {
      if (user.login_times <= 1) {
        toast(`Welcome to Taboo AI 🎉 ${user.nickname ?? user.name}!`);
      } else {
        toast(`Welcome back, ${user.nickname ?? user.name}!`);
      }
      hasGreeted = true;
    }
  }, [user]);

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast(`Bye bye, ${user?.nickname ?? user?.name}! 👋`);
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
          <button
            aria-label='Click to access user menu'
            className='group/user-login-portal relative flex size-6 flex-row items-center gap-x-1 p-0'
          >
            <Image
              className='rounded-[7px]'
              src={user.photo_url || '/images/placeholder.png'}
              alt='user avatar'
              width={24}
              height={24}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent loop sideOffset={10} align='end'>
          {userMenuItems.map(
            (item) =>
              item.isVisible && (
                <DropdownMenuItem
                  key={item.label}
                  className={cn(
                    'gap-2 text-sm font-normal [&_svg]:size-4',
                    item.isUpcoming && 'opacity-20'
                  )}
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
      <button
        aria-label='Click to sign in'
        onClick={handleSignIn}
        className='h-[32px] px-3 py-1 text-sm text-foreground transition-colors hover:text-foreground/70'
      >
        <LogIn className='size-4' />
      </button>
    </div>
  );
}

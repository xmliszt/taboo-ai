'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  AlignJustify,
  BookMarked,
  CircleUser,
  Construction,
  LogOut,
  PenTool,
  User,
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

import { createStripeCustomerPortal } from '@/app/profile/server/create-stripe-customer-portal';
import { useAuth } from '@/components/auth-provider';
import { login } from '@/components/header/server/login';
import { logout } from '@/components/header/server/logout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Spinner } from '../custom/spinner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import IconButton from '../ui/icon-button';

function shouldShowLoginIconWithLabel(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/levels' ||
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

export function UserLoginPortal() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.login_times <= 1) {
        toast(`Welcome to Taboo AI 🎉 ${user.nickname ?? user.name}!`);
      } else {
        toast(`Welcome back, ${user.nickname ?? user.name}!`);
      }
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Failed to log in');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast(`Bye bye, ${user?.nickname ?? user?.name}! 👋`);
      setTimeout(() => {
        window.location.href = '/';
      }, 2500);
    } catch (error) {
      console.error(error);
      toast.error('Sorry, we are unable to log you out. Please try again!');
    }
  };

  const handleManageSubscription = async () => {
    if (!user?.subscription?.customer_id) return;
    try {
      const portalSessionUrl = await createStripeCustomerPortal(
        user.subscription.customer_id,
        `${window.location.origin}/profile?anchor=subscription`
      );
      router.push(portalSessionUrl);
    } catch (error) {
      console.error(error);
      toast.error('Sorry, we are unable to manage your subscription. Please try again!');
    }
  };

  const userMenuItems: UserMenuItem[] = useMemo(() => {
    return [
      {
        label: 'Manage Billing & Plan',
        icon: <BookMarked />,
        isVisible:
          user?.subscription?.customer_id !== undefined && user?.subscription?.customer_id !== null,
        onClick: handleManageSubscription,
      },
      {
        label: 'Contribute A Topic',
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
        label: 'Logout',
        icon: <LogOut />,
        isVisible: true,
        onClick: handleLogout,
      },
    ];
  }, [pathname, user]);

  if (isLoading) return <Spinner />;

  return user ? (
    <div className='flex flex-row items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Click to access user menu'
            className='flex h-[32px] flex-row items-center gap-1 p-1'
          >
            {user.photo_url && (
              <Image
                className='rounded-[7px]'
                src={user.photo_url}
                alt='user avatar'
                width={23}
                height={23}
              />
            )}
            <AlignJustify size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent loop sideOffset={10} align='end'>
          <DropdownMenuLabel className='flex flex-col'>
            <span className='font-light italic'>You are logged in as</span>
            <span>{user.email}</span>
          </DropdownMenuLabel>
          {user?.subscription?.customer_plan_type && (
            <>
              <Badge className='mb-2 ml-2'>
                {user.subscription.customer_plan_type.toUpperCase()}
              </Badge>
              {user?.stripeSubscription?.trial_end &&
                // trial end date is later than now
                moment.unix(user.stripeSubscription.trial_end).isAfter(moment()) && (
                  <Badge variant='secondary' className='mb-2 ml-2'>
                    Trial
                  </Badge>
                )}
            </>
          )}
          {user?.subscription?.customer_plan_type === 'free' && (
            <Button
              variant='link'
              size='sm'
              className='h-auto animate-pulse underline'
              onClick={() => {
                router.push('/pricing');
              }}
            >
              Upgrade My Plan
            </Button>
          )}
          {user?.stripeSubscription?.trial_end && // trial end date is later than now
            moment.unix(user.stripeSubscription.trial_end).isAfter(moment()) && (
              <>
                <DropdownMenuSeparator />
                <p className='p-2 text-sm font-light'>
                  Trial ends on{' '}
                  {moment.unix(user.stripeSubscription.trial_end).format('DD MMM YYYY, hh:mm A')}
                </p>
              </>
            )}
          {user?.stripeSubscription?.cancel_at && (
            <>
              <DropdownMenuSeparator />
              <p className='p-2 text-sm font-light'>
                Your PRO plan will end on{' '}
                {
                  // if is today, show 'today'
                  moment.unix(user.stripeSubscription.cancel_at).isSame(moment(), 'day')
                    ? 'today'
                    : moment.unix(user.stripeSubscription.cancel_at).format('DD MMM YYYY')
                }
              </p>
            </>
          )}
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
      {shouldShowLoginIconWithLabel(pathname) ? (
        <Button aria-label='Click to login' onClick={handleLogin} className='h-[32px] px-2 py-1'>
          <div className='flex flex-row items-center gap-1'>
            <CircleUser size='23' />
            Log in
          </div>
        </Button>
      ) : (
        <IconButton aria-label='Click to login' tooltip='Log in' onClick={handleLogin}>
          <CircleUser />
        </IconButton>
      )}
    </div>
  );
}

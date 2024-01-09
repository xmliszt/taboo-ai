'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  AlignJustify,
  CircleUser,
  Construction,
  LogOut,
  PenTool,
  ScrollText,
  User,
} from 'lucide-react';

import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { bindPersistence, getPersistence } from '@/lib/persistence/persistence';
import IGame from '@/lib/types/game.type';
import { cn } from '@/lib/utils';
import { isGameFinished } from '@/lib/utils/gameUtils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import IconButton from '../ui/icon-button';
import { toast } from '../ui/use-toast';
import { LoginErrorEventProps } from './login-error-dialog';
import { Spinner } from './spinner';

interface UserMenuItem {
  label: string;
  icon: React.ReactElement;
  isVisible: boolean;
  isUpcoming?: boolean;
  onClick: (event: Event) => void;
}

export function UserLoginPortal() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, login, logout } = useAuth();
  const [game, setGame] = useState<IGame | null>(null);

  useEffect(() => {
    const game = getPersistence<IGame>(HASH.game);
    setGame(game);
    const unbind = bindPersistence<IGame>(HASH.game, setGame);
    return () => {
      unbind();
    };
  }, []);

  const handleLogout = async () => {
    try {
      logout && (await logout());
    } catch (error) {
      console.error(error);
      toast({
        title: 'Sorry, we are unable to log you out. Please try again!',
        variant: 'destructive',
      });
    }
  };

  const userMenuItems: UserMenuItem[] = useMemo(() => {
    return [
      {
        label: 'Contribute A Topic',
        icon: <PenTool />,
        isVisible: pathname !== '/add-level',
        onClick: () => {
          router.push('/add-level');
        },
      },
      {
        label: 'My Last Result',
        icon: <ScrollText />,
        isVisible: status !== 'authenticated' && isGameFinished(game) && pathname !== '/result',
        onClick: () => {
          router.push('/result');
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
  }, [pathname, game, status]);

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

  const renderUserLoginComponent = () => {
    return user && status === 'authenticated' ? (
      <div className='flex flex-row items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label='Click to access user menu'
              className='flex h-[32px] flex-row items-center gap-1 p-1'
            >
              {user.photoUrl && (
                <Image
                  className='rounded-[7px]'
                  src={user.photoUrl}
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
    ) : status === 'loading' ? (
      <Spinner />
    ) : (
      <div>
        {pathname === '/' || pathname === '/levels' ? (
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
  };

  return renderUserLoginComponent();
}

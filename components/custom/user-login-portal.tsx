'use client';

import { useAuth } from '@/components/auth-provider';
import { Construction, LogIn, LogOut, PenTool, User } from 'lucide-react';
import { Spinner } from './spinner';
import IconButton from '../ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useState } from 'react';

interface UserMenuItem {
  label: string;
  icon: React.ReactElement;
  isVisible: boolean;
  isUpcoming?: boolean;
  onClick: (event: Event) => void;
}

export function UserLoginPortal() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, setStatus, login, logout } = useAuth();

  const userMenuItems: UserMenuItem[] = [
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
      isUpcoming: true,
      onClick: () => {
        router.push('/profile');
      },
    },
    {
      label: 'Logout',
      icon: <LogOut />,
      isVisible: true,
      onClick: () => {
        logout && logout();
      },
    },
  ];

  const handleLogin = async () => {
    if (!login) return;
    try {
      await login();
    } catch (error) {
      console.error(error);
      setAlertHeader(error.message);
      setAlertOpen(true);
    }
  };

  const handleCancel = () => {
    setStatus && setStatus('unauthenticated');
  };

  const renderUserLoginComponent = () => {
    return user && status === 'authenticated' ? (
      <div className='flex flex-row gap-2 items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label='Click to access user menu'
              tooltip='Access user menu'
            >
              <User strokeWidth={1.5} />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent loop sideOffset={10} align='end'>
            <DropdownMenuLabel className='flex flex-col'>
              <span className='italic font-light'>You are logged in as</span>
              <span>{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userMenuItems.map(
              (item) =>
                item.isVisible === true && (
                  <DropdownMenuItem
                    key={item.label}
                    className={cn(
                      'gap-2 hover:cursor-pointer',
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
                    <span>
                      {item.label + (item.isUpcoming ? ' (coming soon)' : '')}
                    </span>
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
        <IconButton
          aria-label='Click to login'
          onClick={handleLogin}
          tooltip='Login'
        >
          <LogIn />
        </IconButton>
      </div>
    );
  };

  return (
    <>
      <AlertDialog
        open={alertOpen}
        onOpenChange={(open) => {
          setAlertOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertHeader}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              autoFocus
              onClick={() => {
                setAlertOpen(false);
                handleLogin();
              }}
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {renderUserLoginComponent()}
    </>
  );
}

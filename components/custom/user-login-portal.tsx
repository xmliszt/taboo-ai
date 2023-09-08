import { useAuth } from '@/app/AuthProvider';
import { LogIn, LogOut, User } from 'lucide-react';
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
import { useRouter } from 'next/navigation';

interface UserMenuItem {
  label: string;
  icon: React.ReactElement;
  onClick: (event: Event) => void;
}

export function UserLoginPortal() {
  const router = useRouter();
  const { user, status, login, logout } = useAuth();

  const userMenuItems: UserMenuItem[] = [
    {
      label: 'Profile',
      icon: <User />,
      onClick: () => {
        router.push('/profile');
      },
    },
    {
      label: 'Logout',
      icon: <LogOut />,
      onClick: () => {
        logout && logout();
      },
    },
  ];

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
          {userMenuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className='gap-2 hover:cursor-pointer'
              onSelect={item.onClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : status === 'loading' ? (
    <Spinner />
  ) : (
    <div>
      <IconButton aria-label='Click to login' onClick={login} tooltip='Login'>
        <LogIn />
      </IconButton>
    </div>
  );
}

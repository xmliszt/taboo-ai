'use client';

import { usePathname } from 'next/navigation';
import BackButton from './BackButton';
import LightDarkToggle from './LightDarkToggle';
import UserDisplay from './UserDisplay';

interface HeaderProps {
  maintenanceOn: boolean;
}

const Header = ({ maintenanceOn }: HeaderProps) => {
  const pathName = usePathname();
  return maintenanceOn ? (
    <header
      id='header-section'
      className={
        'w-full fixed top-0 h-12 lg:h-20 gap-2 z-40 p-4 text-center bg-black dark:bg-neon-black'
      }
    >
      {/* <LightDarkToggle /> */}
    </header>
  ) : (
    <header
      id='header-section'
      className={`w-full fixed top-0 h-12 lg:h-20 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center ${
        pathName === '/daily-challenge' ||
        pathName === '/level' ||
        pathName === '/ai'
          ? ''
          : 'bg-black dark:bg-neon-black'
      } `}
    >
      <BackButton />
      <UserDisplay />
      {/* <LightDarkToggle /> */}
    </header>
  );
};

export default Header;

'use client';

import { usePathname } from 'next/navigation';
import BackButton from './BackButton';

interface HeaderProps {
  maintenanceOn: boolean;
}

const Header = ({ maintenanceOn }: HeaderProps) => {
  const pathName = usePathname();
  const noBackdropRoutes = ['/level', '/ai'];
  return (
    <header
      id='header-section'
      className={`w-full fixed top-0 h-16 lg:h-20 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center ${
        noBackdropRoutes.includes(pathName ?? '')
          ? ''
          : 'backdrop-blur-lg gradient-blur-mask'
      } `}
    >
      {maintenanceOn ? <></> : <BackButton />}
    </header>
  );
};

export default Header;

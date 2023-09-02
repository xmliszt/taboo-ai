'use client';

import { usePathname } from 'next/navigation';
import NavBarLeftItem from './NavBarLeftItem';
import { UserLoginPortal } from './UserLoginPortal';

interface HeaderProps {
  maintenanceOn: boolean;
}

const Header = ({ maintenanceOn }: HeaderProps) => {
  const pathName = usePathname();
  const noBackdropSolidBGRoutes = ['/add-level'];
  const noBackdropNoBGRoutes = ['/level', '/ai'];
  return (
    <header
      id='header-section'
      className={`w-full fixed top-0 h-16 lg:h-20 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center ${
        noBackdropSolidBGRoutes.includes(pathName ?? '')
          ? 'bg-black'
          : noBackdropNoBGRoutes.includes(pathName ?? '')
          ? ''
          : 'backdrop-blur-lg gradient-blur-mask'
      } `}
    >
      {maintenanceOn ? <></> : <NavBarLeftItem />}
      {maintenanceOn ? <></> : <UserLoginPortal />}
    </header>
  );
};

export default Header;

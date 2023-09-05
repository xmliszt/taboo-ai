'use client';

import { usePathname } from 'next/navigation';
import NavBarLeftItem from './custom/navbar-left-item';
import { UserLoginPortal } from './custom/user-login-portal';

interface HeaderProps {
  maintenanceOn: boolean;
}

const Header = ({ maintenanceOn }: HeaderProps) => {
  const pathName = usePathname();
  const hasUserLoginPortal = ['/', '/x/review-words'];
  const noBackdropSolidBGRoutes = ['/add-level'];
  const noBackdropNoBGRoutes = ['/level', '/ai'];
  return (
    <header
      id='header-section'
      className={`w-full fixed top-0 h-16 lg:h-20 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center ${
        noBackdropSolidBGRoutes.includes(pathName ?? '')
          ? 'bg-primary'
          : noBackdropNoBGRoutes.includes(pathName ?? '')
          ? ''
          : 'backdrop-blur-lg'
      } `}
    >
      {maintenanceOn ? <></> : <NavBarLeftItem />}
      {maintenanceOn ? (
        <></>
      ) : hasUserLoginPortal.includes(pathName ?? '') ? (
        <UserLoginPortal />
      ) : (
        <></>
      )}
    </header>
  );
};

export default Header;

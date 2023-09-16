'use client';

import { cn } from '@/lib/utils';
import { RouteManager } from '@/lib/utils/routeUtils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeaderLeftElements from './header-left-elements';
import HeaderRightElements from './header-right-elements';

export interface HeaderProps {
  title?: string;
  hideMenu?: boolean;
  hideUserMenu?: boolean;
  hideThemeToggle?: boolean;
  hideDevToggle?: boolean;
  hideShareScoreButton?: boolean;
  isTransparent?: boolean;
  hasBackButton?: boolean;
  customBackHref?: string;
}

export default function Header() {
  const [
    {
      title,
      hideUserMenu,
      isTransparent,
      hideMenu,
      hideThemeToggle,
      hideDevToggle,
      hideShareScoreButton,
      hasBackButton,
      customBackHref,
    },
    setConfig,
  ] = useState<HeaderProps>({
    title: '',
    hideUserMenu: false,
    isTransparent: false,
    hideMenu: false,
    hideThemeToggle: false,
    hideDevToggle: true,
    hideShareScoreButton: true,
    hasBackButton: false,
  });
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const config = RouteManager.getHeaderPropsFromPath(pathname);
      setConfig(config);
    }
  }, [pathname]);

  return (
    <header
      id='header-section'
      className={cn(
        isTransparent ? '' : 'bg-card',
        'w-full fixed top-0 h-16 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center'
      )}
    >
      <HeaderLeftElements
        hideMenu={hideMenu}
        hideThemeToggle={hideThemeToggle}
        hideDevToggle={hideDevToggle}
        hasBackButton={hasBackButton}
        customBackHref={customBackHref}
      />
      <h1
        data-testid='heading-rule-title'
        className='absolute -z-10 left-0 w-full text-center text-xl'
      >
        {title}
      </h1>
      <HeaderRightElements
        hideUserMenu={hideUserMenu}
        hideShareScoreButton={hideShareScoreButton}
      />
    </header>
  );
}

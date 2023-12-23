'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { RouteManager } from '@/lib/utils/routeUtils';

import HeaderLeftElements from './header-left-elements';
import HeaderRightElements from './header-right-elements';

export interface HeaderProps {
  title?: string;
  hideMenu?: boolean;
  hideUserMenu?: boolean;
  hideThemeToggle?: boolean;
  hideDevToggle?: boolean;
  hideShareScoreButton?: boolean;
  hasBackButton?: boolean;
  customBackHref?: string;
}

export default function Header() {
  const [
    {
      title,
      hideUserMenu,
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
        'flex h-16 w-full flex-row items-center justify-between gap-2 p-4 text-center',
        'border-b bg-card'
      )}
    >
      <HeaderLeftElements
        hideMenu={hideMenu}
        hideThemeToggle={hideThemeToggle}
        hideDevToggle={hideDevToggle}
        hasBackButton={hasBackButton}
        customBackHref={customBackHref}
      />
      <div
        data-testid='heading-rule-title'
        className='pointer-events-none absolute left-0 z-10 w-full text-center text-lg'
      >
        {title}
      </div>
      <HeaderRightElements
        hideUserMenu={hideUserMenu}
        hideShareScoreButton={hideShareScoreButton}
      />
    </header>
  );
}

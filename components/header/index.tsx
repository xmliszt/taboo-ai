'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { BackButton } from '@/components/custom/back-button';
import DevToggle from '@/components/header/dev-toggle';
import { MenuButton } from '@/components/header/menu-button';
import ThemeToggle from '@/components/header/theme-toggle';
import { UserLoginPortal } from '@/components/header/user-login-portal';
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
      id="header-section"
      className={cn(
        'flex h-16 w-full flex-row items-center justify-between gap-2 p-4 text-center',
        'border-b bg-card',
      )}
    >
      <HeaderLeftElements>
        {!hideMenu && <MenuButton />}
        {hasBackButton === true && <BackButton customBackHref={customBackHref} />}
        {!hideThemeToggle && <ThemeToggle />}
        {!hideDevToggle && <DevToggle key="dev-toggle" />}
      </HeaderLeftElements>
      <h1
        data-testid="heading-rule-title"
        className="pointer-events-none absolute left-0 z-10 w-full text-center text-lg"
      >
        {title}
      </h1>
      <HeaderRightElements>{!hideUserMenu && <UserLoginPortal />}</HeaderRightElements>
    </header>
  );
}

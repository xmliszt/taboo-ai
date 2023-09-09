'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { BackButton } from './back-button';
interface NavBarItemProps {}

export default function NavBarLeftItem(props: NavBarItemProps) {
  const pathname = usePathname();

  const backHref = useMemo(() => {
    if (
      [
        '/roadmap',
        '/whatsnew',
        '/buymecoffee',
        '/pwa',
        '/rule',
        '/levels',
        '/result',
        '/add-level',
        '/x/review-words',
      ].includes(pathname ?? '')
    ) {
      return '/';
    } else {
      return undefined;
    }
  }, [pathname]);

  return (
    <div className='flex flex-row gap-2'>
      {pathname === '/' ? <></> : <BackButton href={backHref} />}
    </div>
  );
}

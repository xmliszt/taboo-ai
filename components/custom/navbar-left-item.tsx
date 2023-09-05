'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BackButton } from './back-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Download, HelpCircle } from 'lucide-react';
interface NavBarItemProps {}

export default function NavBarLeftItem(props: NavBarItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const backHref = useMemo(() => {
    if (
      [
        '/roadmap',
        '/whatsnew',
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
      {pathname === '/' ? (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label='Click to see the rules on how to play Taboo AI'
                onClick={() => {
                  navigateTo('/rule');
                }}
              >
                <HelpCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>How to play Taboo AI?</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label='Click to learn how to install Taboo AI as PWA'
                onClick={() => {
                  navigateTo('/pwa');
                }}
              >
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Install Taboo AI as App</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <BackButton href={backHref} />
      )}
    </div>
  );
}

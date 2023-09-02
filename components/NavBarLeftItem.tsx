/**
 * /levels -> [Home]
 * /daily-challenge -> [Home]
 * /level -> [/levels]
 * /leaderboard -> [Home]
 * /result -> [Home]
 * /whatsnew -> [Home]
 * /roadmap -> [Home]
 * /rule -> [Home]
 * /buymecoffee -> [Home]
 * /signup -> [Home]
 * /recovery -> [Home]
 * /ai -> [/levels]
 */
'use client';

import { IconButton, Stack, Tooltip } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { BackButton } from './BackButton';
import { QuestionIcon, DownloadIcon } from '@chakra-ui/icons';
import { useMemo } from 'react';
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
    <Stack direction='row' gap={2}>
      {pathname === '/' ? (
        <>
          <Tooltip
            label='How to play Taboo AI?'
            aria-label='How to play Taboo AI?'
            className='p-2'
            hasArrow
          >
            <IconButton
              size='sm'
              aria-label='Click to see the rules on how to play Taboo AI'
              icon={<QuestionIcon />}
              onClick={() => {
                navigateTo('/rule');
              }}
            />
          </Tooltip>
          <Tooltip
            label='Install Taboo AI as App'
            aria-label='How to play Taboo AI?'
            className='p-2'
            hasArrow
          >
            <IconButton
              size='sm'
              aria-label='Click to learn how to install Taboo AI as PWA'
              icon={<DownloadIcon />}
              onClick={() => {
                navigateTo('/pwa');
              }}
            />
          </Tooltip>
        </>
      ) : (
        <BackButton href={backHref} />
      )}
    </Stack>
  );
}

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

import { Stack, Tooltip } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BiHomeAlt, BiLeftArrowAlt } from 'react-icons/bi';
import {
  BsFillArrowDownSquareFill,
  BsFillQuestionSquareFill,
} from 'react-icons/bs';

interface BackButtonProps {}

export default function BackButton(props: BackButtonProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const back = () => {
    switch (pathname) {
      case '/ai':
      case '/level':
        router.push('/levels');
        break;
      default:
        router.push('/');
        break;
    }
  };

  const renderIcon = () => {
    switch (pathname) {
      case '/ai':
      case '/level':
        return <BiLeftArrowAlt />;
      default:
        return <BiHomeAlt />;
    }
  };

  return pathname === '/' ? (
    <Stack direction='row' gap={2}>
      <Tooltip
        label='How to play Taboo AI?'
        aria-label='How to play Taboo AI?'
        className='p-2'
        hasArrow
      >
        <Link
          href='/rule'
          aria-label='Link to rule page'
          className='text-white text-xl lg:text-3xl'
        >
          <div className='flex flex-row gap-2 items-center'>
            <BsFillQuestionSquareFill data-testid='rule-icon' />
          </div>
        </Link>
      </Tooltip>
      <Tooltip
        label='Install Taboo AI as App'
        aria-label='How to play Taboo AI?'
        className='p-2'
        hasArrow
      >
        <Link
          href='/pwa'
          aria-label='Link to how to install Taboo AI as PWA'
          className='text-white text-xl lg:text-3xl'
        >
          <div className='flex flex-row gap-2 items-center'>
            <BsFillArrowDownSquareFill data-testid='rule-icon' />
          </div>
        </Link>
      </Tooltip>
    </Stack>
  ) : (
    <button
      id='back'
      data-style='none'
      aria-label='back button'
      className='text-2xl lg:text-4xl hover:cursor-pointer shadow-lg dark:text-neon-blue'
      onClick={() => {
        back();
      }}
    >
      {renderIcon()}
    </button>
  );
}

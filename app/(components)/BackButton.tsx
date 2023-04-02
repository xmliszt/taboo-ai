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

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiHomeAlt, BiLeftArrowAlt } from 'react-icons/bi';
import { BsFillQuestionSquareFill } from 'react-icons/bs';

interface BackButtonProps {}

export default function BackButton(props: BackButtonProps = {}) {
  const [buttonStyle, setButtonStyle] = useState<'HOME' | 'BACK'>('HOME');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case '/ai':
      case '/level':
        setButtonStyle('BACK');
        break;
      default:
        setButtonStyle('HOME');
        break;
    }
  }, [pathname]);

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
    switch (buttonStyle) {
      case 'BACK':
        return <BiLeftArrowAlt />;
      case 'HOME':
        return <BiHomeAlt />;
    }
  };

  return pathname === '/' ? (
    <Link
      href='/rule'
      aria-label='Link to rule page'
      className='text-white dark:text-neon-red-light text-xl dark:text-sm lg:dark:text-2xl lg:text-3xl'
    >
      <div className='flex flex-row gap-2 items-center'>
        <BsFillQuestionSquareFill data-testid='rule-icon' />
        <span>Help</span>
      </div>
    </Link>
  ) : (
    <button
      id='back'
      data-style='none'
      aria-label='back button'
      className='hover:animate-pulse text-2xl lg:text-4xl hover:cursor-pointer drop-shadow-lg dark:text-neon-blue'
      onClick={() => {
        back();
      }}
    >
      {renderIcon()}
    </button>
  );
}

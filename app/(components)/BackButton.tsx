'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiHomeAlt, BiLeftArrowAlt } from 'react-icons/bi';

interface BackButtonProps {}

export default function BackButton(props: BackButtonProps = {}) {
  const [buttonStyle, setButtonStyle] = useState<'BACK' | 'HOME'>('BACK');

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case '/result':
      case '/whatsnew':
      case '/roadmap':
      case '/leaderboard':
        setButtonStyle('HOME');
        break;
      default:
        setButtonStyle('BACK');
        break;
    }
  }, [pathname]);

  const back = () => {
    switch (buttonStyle) {
      case 'BACK':
        router.back();
        break;
      case 'HOME':
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

  return (
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

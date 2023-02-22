'use client';
import { MdDarkMode, MdOutlineWbTwilight } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

interface LightDarkSwitchButtonProps {
  onThemeChanged: (theme: Theme) => void;
}

const LightDarkSwitchButton = (props: LightDarkSwitchButtonProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onToggle = () => {
    const dark = !isDark;
    setIsDark(dark);
    const theme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    props.onThemeChanged(theme === 'dark' ? Theme.Dark : Theme.Light);
  };

  useEffect(() => {
    if (isMounted) {
      const theme = localStorage.getItem('theme') ?? 'light';
      setIsDark(theme === 'dark');
    }
  }, [isMounted]);

  return (
    <button
      id='theme'
      aria-label='toggle light/dark button'
      data-testid='light-dark-toggle-button'
      className={`fixed z-50 ${
        pathName === '/'
          ? 'top-5 left-5'
          : (pathName?.match(/^\/level$/)?.length ?? 0 > 0) ||
            pathName === '/result' ||
            pathName === '/whatsnew' ||
            pathName === '/buymecoffee'
          ? 'top-4 lg:top-3.5 left-12 lg:left-20'
          : pathName === '/levels' || pathName === '/ai' || pathName === '/rule'
          ? 'top-4 right-5 lg:top-3.5'
          : 'bottom-5 left-5'
      } opacity-100 hover:animate-pulse transition-all text-2xl lg:text-5xl dark:text-neon-blue
      }`}
      onClick={onToggle}
    >
      {isDark ? <MdDarkMode /> : <MdOutlineWbTwilight />}
    </button>
  );
};

export default LightDarkSwitchButton;

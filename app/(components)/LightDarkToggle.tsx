'use client';

import { useEffect, useState } from 'react';
import { MdDarkMode, MdOutlineWbTwilight } from 'react-icons/md';

interface LightDarkToggleProps {}

const LightDarkToggle = (props: LightDarkToggleProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('theme');
    const isDark = darkMode === 'dark';
    setIsDark(isDark);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    isDark ? setDarkTheme() : setLightTheme();
  }, [isDark]);

  const setDarkTheme = () => {
    document.getElementsByTagName('html')[0].classList.add('dark');
    document.getElementsByTagName('html')[0].classList.remove('light');
  };

  const setLightTheme = () => {
    document.getElementsByTagName('html')[0].classList.add('light');
    document.getElementsByTagName('html')[0].classList.remove('dark');
  };

  const onToggle = () => {
    setIsDark((dark) => !dark);
  };

  return (
    <button
      id='theme'
      data-style='none'
      aria-label='toggle light/dark button'
      data-testid='light-dark-toggle-button'
      className='opacity-100 transition-all text-2xl lg:text-5xl dark:text-neon-blue'
      onClick={onToggle}
    >
      {isDark ? <MdDarkMode /> : <MdOutlineWbTwilight />}
    </button>
  );
};

export default LightDarkToggle;

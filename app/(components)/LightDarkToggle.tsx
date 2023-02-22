'use client';
import { useEffect, useState } from 'react';
import { MdDarkMode, MdOutlineWbTwilight } from 'react-icons/md';

interface LightDarkToggleProps {
  onToggle: (isDark: boolean) => void;
}

const LightDarkToggle = (props: LightDarkToggleProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    !isMounted && setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const dark = localStorage.getItem('theme') === 'dark';
      setIsDark(dark);
      props.onToggle(dark);
    }
  }, [isMounted]);

  const onToggle = () => {
    const dark = !isDark;
    setIsDark(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    props.onToggle(dark);
  };

  return (
    <button
      id='theme'
      aria-label='toggle light/dark button'
      data-testid='light-dark-toggle-button'
      className='fixed z-50 top-4 right-5 lg:top-3.5 opacity-100 hover:animate-pulse transition-all text-2xl lg:text-5xl dark:text-neon-blue'
      onClick={onToggle}
    >
      {isDark ? <MdDarkMode /> : <MdOutlineWbTwilight />}
    </button>
  );
};

export default LightDarkToggle;

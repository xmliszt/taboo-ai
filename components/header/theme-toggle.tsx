import { MonitorSmartphone, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '../ui/icon-button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getToolTip = (theme: string | undefined): string => {
    switch (theme) {
      case 'light':
        return 'Set to dark mode';
      case 'dark':
        return 'Set to follow system';
      case 'system':
        return 'Set to light mode';
      default:
        return '';
    }
  };

  const loopTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        return;
      case 'dark':
        setTheme('system');
        return;
      case 'system':
        setTheme('light');
        return;
      default:
        setTheme('system');
        return;
    }
  };

  return (
    <AnimatePresence mode='popLayout' initial={false}>
      <motion.div
        key={theme}
        className='flex items-center justify-center'
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          tooltip={getToolTip(theme)}
          onClick={loopTheme}
          variant='link'
          className='[&_svg]:size-5'
        >
          {theme === 'light' ? <Sun /> : theme === 'dark' ? <MoonStar /> : <MonitorSmartphone />}
        </IconButton>
      </motion.div>
    </AnimatePresence>
  );
}

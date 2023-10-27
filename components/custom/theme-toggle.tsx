import { MoonStar, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import IconButton from '../ui/icon-button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getToolTip = (theme: string | undefined): string => {
    switch (theme) {
      case 'light':
        return 'Set to Dark Mode';
      case 'dark':
        return 'Set to Follow System';
      case 'system':
        return 'Set to Light Mode';
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
    <IconButton tooltip={getToolTip(theme)} onClick={loopTheme}>
      {theme === 'light' ? (
        <Sun />
      ) : theme === 'dark' ? (
        <MoonStar />
      ) : (
        <SunMoon />
      )}
    </IconButton>
  );
}

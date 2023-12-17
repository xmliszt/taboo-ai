import { MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface HomeMenuButtonProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: MouseEventHandler;
  'aria-label'?: string;
}

export function HomeMenuButton({
  icon,
  title,
  subtitle,
  href,
  onClick,
  'aria-label': ariaLabel,
}: HomeMenuButtonProps) {
  const router = useRouter();

  return (
    <Alert
      aria-label={ariaLabel}
      className='border-2 border-primary shadow-lg transition-all ease-in-out hover:scale-[1.02] hover:cursor-pointer'
      onClick={(e) => {
        onClick && onClick(e);
        href && router.push(href);
      }}
    >
      {icon}
      <AlertTitle className='font-bold'>{title}</AlertTitle>
      <AlertDescription>{subtitle}</AlertDescription>
    </Alert>
  );
}

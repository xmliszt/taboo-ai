import { MouseEventHandler } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface HomeMenuButtonProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  href?: string;
  onClick?: MouseEventHandler;
  'aria-label'?: string;
  cta?: boolean;
}

export function HomeMenuButton({
  icon,
  title,
  subtitle,
  href,
  onClick,
  'aria-label': ariaLabel,
  cta = false,
}: HomeMenuButtonProps) {
  const router = useRouter();

  return (
    <div className='group relative rounded-lg shadow-lg transition-all ease-in-out hover:scale-105 hover:cursor-pointer'>
      <Alert
        aria-label={ariaLabel}
        onClick={(e) => {
          onClick && onClick(e);
          href && router.push(href);
        }}
      >
        {icon}
        <AlertTitle className='font-bold'>{title}</AlertTitle>
        <AlertDescription>{subtitle}</AlertDescription>
      </Alert>
      <div
        className={cn(
          'absolute left-0 top-0 -z-10 h-full w-full rounded-lg',
          !!cta && 'unicorn-color transition-colors ease-out after:blur-md'
        )}
      ></div>
      <div className='rotating-mono-border-trace pointer-events-none absolute left-0 top-0 -z-10 h-full w-full rounded-lg opacity-0 transition-[transform_opacity_0.3s_ease-in-out] after:blur-lg group-hover:opacity-100'></div>
    </div>
  );
}

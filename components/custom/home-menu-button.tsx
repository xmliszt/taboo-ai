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
    <div className='group relative select-none rounded-lg shadow-lg transition-all ease-in-out'>
      <Alert
        aria-label={ariaLabel}
        className='[&_svg]:size-5'
        onClick={(e) => {
          onClick && onClick(e);
          href && router.push(href);
        }}
      >
        {icon}
        <AlertTitle className='line-clamp-1 text-sm font-medium'>{title}</AlertTitle>
        <AlertDescription className='line-clamp-2 text-xs font-normal text-muted-foreground'>
          {subtitle}
        </AlertDescription>
      </Alert>
      <div
        className={cn(
          'absolute left-0 top-0 -z-10 h-full w-full rounded-lg',
          !!cta && 'unicorn-color transition-colors ease-out after:blur-md'
        )}
      ></div>
      <div className='rotating-mono-border-trace pointer-events-none absolute left-0 top-0 -z-10 h-full w-full rounded-lg opacity-0 transition-[transform_opacity_0.3s_ease-in-out] after:blur-sm group-hover:opacity-70'></div>
    </div>
  );
}

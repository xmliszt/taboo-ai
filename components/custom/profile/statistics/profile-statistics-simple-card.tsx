import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileStatisticsSimpleCardProps {
  title: string;
  value: string;
  actionLabel?: string;
  href?: string;
  className?: string;
  titleFontSize?: string;
}

export function ProfileStatisticsSimpleCardView({
  title,
  value,
  actionLabel,
  href,
  titleFontSize,
}: ProfileStatisticsSimpleCardProps) {
  return (
    <div
      className={cn(
        'relative flex snap-center flex-col gap-2 rounded-lg border p-4 leading-snug',
        'min-h-[150px] w-full min-w-[250px] lg:w-fit lg:min-w-[150px]'
      )}
    >
      <div className='text-xs italic text-muted-foreground'>{title}</div>
      <div
        className={cn(
          'flex w-full flex-grow items-center justify-center text-center',
          titleFontSize ?? (isNaN(Number(value)) ? 'text-2xl' : 'text-5xl')
        )}
      >
        {value}
      </div>
      {href && (
        <Link href={href}>
          <Button size='sm' className='w-full' variant='secondary'>
            {actionLabel ?? 'View Details'}
          </Button>
        </Link>
      )}
    </div>
  );
}

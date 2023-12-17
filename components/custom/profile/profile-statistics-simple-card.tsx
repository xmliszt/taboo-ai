import { MousePointerClick } from 'lucide-react';
import { isMobile, isTablet } from 'react-device-detect';

import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

interface ProfileStatisticsSimpleCardProps {
  key: string;
  title: string;
  value: string;
  tooltip?: string;
  onClick?: () => void;
}

export default function ProfileStatisticsSimpleCardView({
  title,
  value,
  tooltip,
  onClick,
}: ProfileStatisticsSimpleCardProps) {
  return (
    <div
      className={cn(
        'relative flex snap-center flex-col gap-2 rounded-lg border p-4 leading-snug',
        isMobile ? 'h-[200px]  min-w-[200px] max-w-[200px]' : 'h-[150px] min-w-[150px] max-w-full'
      )}
    >
      <div className='text-xs italic text-muted-foreground'>{title}</div>
      <div
        className={cn(
          'flex w-full max-w-[200px] flex-grow items-center justify-center text-center',
          isNaN(Number(value)) ? 'text-2xl' : 'text-5xl'
        )}
      >
        {value}
      </div>
      {onClick &&
        (isMobile || isTablet ? (
          <Button size='sm' className='' variant='secondary' onClick={onClick}>
            Play Again
          </Button>
        ) : (
          <IconButton
            tooltip={tooltip}
            variant='ghost'
            className='absolute bottom-2 right-2'
            asChild
            onClick={onClick}
          >
            <MousePointerClick />
          </IconButton>
        ))}
    </div>
  );
}

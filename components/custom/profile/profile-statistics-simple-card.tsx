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
        'border rounded-lg leading-snug relative p-4 flex flex-col gap-2 snap-center',
        isMobile
          ? 'max-w-[200px]  min-w-[200px] h-[200px]'
          : 'h-[150px] max-w-full min-w-[150px]'
      )}
    >
      <div className='text-xs italic text-muted-foreground'>{title}</div>
      <div
        className={cn(
          'w-full flex flex-grow justify-center items-center text-center',
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

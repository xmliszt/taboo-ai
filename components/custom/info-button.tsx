'use client';

import { Info } from 'lucide-react';
import IconButton from '../ui/icon-button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface InfoButtonProps {
  title?: string;
  description?: string;
  tooltip?: string;
  className?: string;
}

export const InfoButton = ({
  title,
  description,
  tooltip = 'View Info',
  className = '',
}: InfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          asChild
          className={cn(className, '')}
          variant='link'
          tooltip={tooltip}
        >
          <Info color='black' size={20} />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent className='leading-snug bg-muted text-card-foreground'>
        <h4 className='font-bold text-lg'>{title}</h4>
        <p className='leading-tight text-base'>{description}</p>
      </PopoverContent>
    </Popover>
  );
};

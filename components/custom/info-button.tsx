'use client';

import { HelpCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import IconButton from '../ui/icon-button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface InfoButtonProps {
  title?: string;
  description?: string;
  tooltip?: string;
  className?: string;
  size?: number;
}

export const InfoButton = ({
  title,
  description,
  tooltip = 'View info',
  className = '',
  size = 20,
}: InfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton asChild className={cn(className, '')} variant='link' tooltip={tooltip}>
          <HelpCircle size={size} />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent className='bg-muted leading-snug text-card-foreground'>
        <h4 className='text-lg font-bold'>{title}</h4>
        <p className='text-base leading-tight'>{description}</p>
      </PopoverContent>
    </Popover>
  );
};

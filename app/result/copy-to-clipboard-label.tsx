'use client';

import { useState } from 'react';
import copy from 'clipboard-copy';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type CopyToClipboardLabelProps = {
  text: string;
  className?: string;
};

export function CopyToClipboardLabel(props: CopyToClipboardLabelProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'rounded-lg bg-muted px-2 py-1 text-muted-foreground',
            'hover:cursor-pointer hover:opacity-75',
            props.className
          )}
          onClick={async () => {
            await copy(props.text);
            toast.info('Hint copied to clipboard');
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 2000);
          }}
        >
          {props.text}{' '}
          {isCopied ? (
            <Check size={15} className='inline h-[15px] w-[15px]' />
          ) : (
            <Copy size={15} className='inline h-[15px] w-[15px]' />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent align='end'>Click to copy to clipboard</TooltipContent>
    </Tooltip>
  );
}

'use client';

import { Info } from 'lucide-react';
import { AspectRatio } from '../ui/aspect-ratio';
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import IconButton from '../ui/icon-button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { DialogTriggerProps } from '@radix-ui/react-dialog';
import { ButtonProps } from '../ui/button';

export const ScoreInfoDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listener = EventManager.bindEvent(
      CustomEventKey.OPEN_SCORE_INFO_DIALOG,
      () => {
        setIsOpen(true);
      }
    );
    return () => {
      EventManager.removeListener(
        CustomEventKey.OPEN_SCORE_INFO_DIALOG,
        listener
      );
    };
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogContent className='p-0 rounded-lg'>
        <AspectRatio ratio={16 / 9}>
          <Image
            fill
            alt='scoring system explained'
            src='https://github.com/xmliszt/resources/blob/main/taboo-ai/images/Artboard-Rule.png?raw=true'
            className='object-cover rounded-lg'
          />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
};

export const ScoreInfoButton = ({ className = '', ...props }: ButtonProps) => {
  const onClick = () => {
    EventManager.fireEvent(CustomEventKey.OPEN_SCORE_INFO_DIALOG);
  };
  return (
    <IconButton
      {...props}
      className={cn(className, '')}
      variant='link'
      tooltip='How do we calculate the scores?'
      onClick={onClick}
    >
      <Info size={20} />
    </IconButton>
  );
};

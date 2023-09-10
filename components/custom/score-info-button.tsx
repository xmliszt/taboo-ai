import { Info } from 'lucide-react';
import { AspectRatio } from '../ui/aspect-ratio';
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import IconButton from '../ui/icon-button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const ScoreInfoButton = ({ className = '' }: { className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton
          className={cn(className, '')}
          variant='link'
          tooltip='How do we calculate the scores?'
        >
          <Info size={20} />
        </IconButton>
      </DialogTrigger>
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

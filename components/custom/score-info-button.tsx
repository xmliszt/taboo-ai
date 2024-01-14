import Image from 'next/image';
import { Info } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import IconButton from '@/components/ui/icon-button';

export const ScoreInfoButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton asChild variant='link' tooltip='How do we calculate the scores?'>
          <Info size={20} />
        </IconButton>
      </DialogTrigger>
      <DialogContent className='rounded-lg p-0'>
        <AspectRatio ratio={16 / 9}>
          <Image
            fill
            alt='scoring system explained'
            src='https://github.com/xmliszt/resources/blob/main/taboo-ai/images/Artboard-Rule.png?raw=true'
            className='rounded-lg object-cover'
          />
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
};

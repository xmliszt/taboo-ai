'use client';

import { useState } from 'react';
import { BookX, X } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ProfileAlertInfo() {
  const [hideAlert, setHideAlert] = useState(false);
  if (hideAlert) return null;
  return (
    <Alert className='relative -my-10 border-gray-500 text-gray-500 opacity-70'>
      <BookX size={20} />
      <AlertTitle className='leading-snug'>
        <X
          size={15}
          className='absolute right-2 top-2 hover:cursor-pointer'
          onClick={() => {
            setHideAlert(true);
          }}
        />
        Custom AI generated games will not be included in the records.
      </AlertTitle>
      <AlertDescription>
        If you would like to see your custom games here, first play the game via AI Mode, and then
        follow the prompt to contribute your AI custom topic to us. Then once your topic is
        officially added to Taboo AI, you can play again and your game will be saved to your
        records.
      </AlertDescription>
    </Alert>
  );
}

'use client';

import { useState } from 'react';
import { Construction, X } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ProfileAlertInfo() {
  const [hideAlert, setHideAlert] = useState(false);
  if (hideAlert) return null;
  return (
    <Alert className='relative -my-10 border-gray-500 text-gray-500 opacity-70'>
      <Construction size={20} />
      <AlertTitle className='leading-snug'>
        <X
          size={15}
          className='absolute right-2 top-2 transition-transform duration-200 ease-in-out hover:rotate-180 hover:scale-125'
          onClick={() => {
            setHideAlert(true);
          }}
        />
        Custom AI-generated games are not saved to your profile
      </AlertTitle>
      <AlertDescription>
        We are still working on the feature to save your custom games. For now, your custom
        AI-generated games will not be saved to your profile. We are sorry for the inconvenience.
      </AlertDescription>
    </Alert>
  );
}

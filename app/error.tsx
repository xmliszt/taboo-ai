'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-10 bg-card'>
      <div className='flex flex-col justify-center gap-4'>
        <h1 className='text-primary text-center'>Something went wrong!</h1>
        <h4 className='text-muted'>[{error.message}]</h4>
      </div>

      <Button
        id='reset'
        aria-label='reset button'
        onClick={() => {
          reset();
        }}
      >
        Try Again
      </Button>
    </div>
  );
}

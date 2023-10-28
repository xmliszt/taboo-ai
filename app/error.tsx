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
      <div className='flex flex-col justify-center gap-4 px-10'>
        <h1 className='text-primary text-center animate-pulse'>
          S̷̛̲͌̚o̷̻̳̣̐̚m̸̮̔̂́ė̷̪ţ̷̤̤̂̿h̶̘͈́ͅi̷͍̪͝n̶̛̬͉̰g̴̡͆̃̃ ̴̻̑͘͜͝W̶̥͉̏̉͝e̷̮̅ͅn̶̝̠͎̊t̸̛͎ ̵̙̻̊Ẁ̸̜͖͆͜r̷̹̘͎͒̈́o̶͚̓̄̚ṉ̴̱̅̍͑g̸͇̮͘ͅ
        </h1>
        <h4 className='mt-4 text-primary italic font-extralight leading-snug border-red-500 border-[1px] rounded-lg px-6 py-4 shadow-lg'>
          {error.message}
        </h4>
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

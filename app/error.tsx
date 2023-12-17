'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-10 bg-card'>
      <div className='w-full flex-col justify-center gap-4 px-10 backdrop:flex'>
        <h1 className='animate-pulse text-center text-primary'>S̷̛̲͌̚o̷̻̳̣̐̚m̸̮̔̂́ė̷̪ţ̷̤̤̂̿h̶̘͈́ͅi̷͍̪͝n̶̛̬͉̰g̴̡͆̃̃ ̴̻̑͘͜͝W̶̥͉̏̉͝e̷̮̅ͅn̶̝̠͎̊t̸̛͎ ̵̙̻̊Ẁ̸̜͖͆͜r̷̹̘͎͒̈́o̶͚̓̄̚ṉ̴̱̅̍͑g̸͇̮͘ͅ</h1>
        <h4 className='mt-10 whitespace-normal break-words rounded-lg border-[1px] border-red-500 px-6 py-4 font-extralight italic leading-snug text-primary shadow-lg'>
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

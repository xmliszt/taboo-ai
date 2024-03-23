'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { useAskForFeedback } from '@/components/ask-for-feedback-provider';

type ProfileScrollControlProps = {
  children: React.ReactNode;
};
export function ProfileScrollControl(props: ProfileScrollControlProps) {
  useAskForFeedback();
  const searchParams = useSearchParams();

  useEffect(() => {
    const anchor = searchParams.get('anchor');
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1000);
      }
    }
  }, []);

  return (
    <main className='flex flex-col items-center gap-16 bg-background px-10 py-8 text-foreground'>
      <div className='flex w-full flex-col items-center gap-16 md:max-w-xl'>{props.children}</div>
    </main>
  );
}

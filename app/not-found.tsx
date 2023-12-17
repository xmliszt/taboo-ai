'use client';

import { useRouter } from 'next/navigation';
import { Pilcrow } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-6 bg-primary text-primary-foreground'>
      <div className='text-center text-8xl'>404</div>
      <div className='flex flex-row items-center gap-2'>
        <Pilcrow />
        <span>Page Not Found &gt;_&lt;</span>
      </div>
      <Button
        id='reset'
        className='invert'
        aria-label='Click to go back to home'
        onClick={() => {
          router.push('/');
        }}
      >
        Go Back To Home
      </Button>
    </div>
  );
}

'use client';

import { Button } from '@chakra-ui/react';
import { Special_Elite } from 'next/font/google';
import { useRouter } from 'next/navigation';

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
});

export default function NotFound() {
  const router = useRouter();
  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center gap-6 bg-black`}
    >
      <pre className='text-white text-center text-8xl lg:text-8xl'>404</pre>
      <p className='text-white text-center'>Ooops page not found &gt;_&lt;!</p>
      <Button
        id='reset'
        data-style='none'
        aria-label='reset button'
        onClick={() => {
          router.push('/');
        }}
      >
        Back To Home
      </Button>
    </div>
  );
}

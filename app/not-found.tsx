'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center gap-6 bg-primary`}
    >
      <pre className='text-primary text-center text-8xl lg:text-8xl'>404</pre>
      <p className='text-primary text-center'>
        Ooops page not found &gt;_&lt;!
      </p>
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

'use client';

import BackButton from './(components)/BackButton';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-10'>
      <BackButton href='/' />
      <h1 className='text-white text-center'>Something went wrong!</h1>
      <button
        id='reset'
        aria-label='reset button'
        className='text-2xl lg:text-4xl text-red hover:text-white transition-all'
        onClick={() => {
          router.push('/');
        }}
      >
        Back To Home
      </button>
    </div>
  );
}

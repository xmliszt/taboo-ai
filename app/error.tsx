'use client';

import BackButton from './(components)/BackButton';
import { useRouter } from 'next/navigation';

export default function Error({ error }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-10'>
      <BackButton href='/' />
      <h1 className='text-white text-center !text-xl lg:!text-3xl'>
        Something went wrong!
      </h1>
      <span className='text-gray text-base lg:text-xl'>[{error.message}]</span>
      <button
        id='reset'
        aria-label='reset button'
        className='text-2xl lg:text-4xl text-red-light hover:text-yellow transition-all'
        onClick={() => {
          router.push('/');
        }}
      >
        Back To Home
      </button>
    </div>
  );
}

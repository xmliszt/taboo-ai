'use client';

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
    <div className='w-full h-screen flex flex-col justify-center items-center gap-10 dark:bg-neon-black'>
      <h1 className='text-3xl lg:text-5xl text-white dark:text-neon-white'>
        Something went wrong!
      </h1>
      <button
        id='reset'
        className='text-2xl lg:text-4xl text-red dark:text-neon-red hover:dark:text-neon-white hover:text-white transition-all'
        onClick={() => reset()}
      >
        Reset
      </button>
    </div>
  );
}

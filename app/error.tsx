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
    <div className='w-full h-screen flex flex-col justify-center items-center gap-10'>
      <h1 className='text-white text-center !text-xl lg:!text-3xl'>
        Something went wrong!
      </h1>
      <span className='text-gray text-base lg:text-xl'>[{error.message}]</span>
      <button
        id='reset'
        data-style='none'
        aria-label='reset button'
        className='text-2xl lg:text-4xl text-red-light hover:text-yellow transition-all'
        onClick={() => {
          reset();
        }}
      >
        Try Again
      </button>
    </div>
  );
}

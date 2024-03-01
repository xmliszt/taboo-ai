'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

import ThemeToggle from '../header/theme-toggle';
import { HoverPerspectiveContainer } from './common/hover-perspective-container';

const Maintenance = () => {
  return (
    <main className='flex h-full w-full items-center justify-center px-4 leading-normal'>
      <article className='flex max-w-xl flex-col items-center gap-2'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <h1 className='mb-2'>Maintenance</h1>
          <ThemeToggle />
        </div>
        <HoverPerspectiveContainer className='group relative w-full max-w-[300px] border border-primary hover:shadow-2xl'>
          <Image
            src='https://i.ibb.co/7zJ4yHD/maintenance.png'
            alt='Taboo AI is under maintenance'
            width={400}
            height={400}
            className='rounded-lg bg-background'
          />
          <span
            className={cn(
              'rotating-mono-border-trace absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card opacity-0 transition-[transform_opacity_0.3s_ease-in-out] after:blur-lg group-hover:scale-[1.02] group-hover:opacity-100'
            )}
          ></span>
        </HoverPerspectiveContainer>
        <p className='text-center'>
          Taboo AI is currently under maintenance. Please check back later.
        </p>
      </article>
    </main>
  );
};

export default Maintenance;

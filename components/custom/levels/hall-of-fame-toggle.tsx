'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';

export function HallOfFameToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isToggledOn = searchParams.has('rank');

  return (
    <button
      onClick={() => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (isToggledOn) newSearchParams.delete('rank');
        else newSearchParams.set('rank', 'true');
        router.replace(`${pathname}?${newSearchParams}`);
      }}
      className='group relative z-10 h-6 rounded-sm border text-xs transition-transform ease-in-out hover:scale-105'
    >
      <div className='h-full w-full rounded-sm bg-background px-2 py-1'>HALL OF FAME</div>
      <span
        className={cn(
          'rotating-golden-border-trace absolute left-0 top-0 -z-10 h-full w-full rounded-sm transition-[transform_opacity] ease-out after:blur-sm group-hover:opacity-100',
          isToggledOn ? 'opacity-100' : 'opacity-0'
        )}
      />
    </button>
  );
}

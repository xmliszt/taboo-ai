'use client';

import { useRef } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileStatisticsSimpleCardProps {
  title: string;
  value: string;
  actionLabel?: string;
  href?: string;
  className?: string;
  titleFontSize?: string;
}

export function ProfileStatisticsSimpleCardView({
  title,
  value,
  actionLabel,
  href,
  titleFontSize,
}: ProfileStatisticsSimpleCardProps) {
  const boundingRef = useRef<DOMRect | null>(null);
  return (
    <div
      className={cn(
        'group relative flex snap-center flex-col gap-2 rounded-lg border p-4 leading-snug',
        'min-h-[150px] w-full min-w-[250px] shrink grow lg:w-fit lg:min-w-[150px]',
        'transform transition-[transoform_border_box-shadow] duration-300 ease-out hover:scale-105 hover:border-primary hover:shadow-lg'
      )}
      onMouseEnter={(event) => {
        boundingRef.current = event.currentTarget.getBoundingClientRect();
      }}
      onMouseLeave={(event) => {
        boundingRef.current = null;
        // Restore rotation
        event.currentTarget.style.transform = '';
      }}
      onMouseMove={(event) => {
        if (!boundingRef.current) return;
        const x = event.clientX - boundingRef.current.left;
        const y = event.clientY - boundingRef.current.top;
        const xPercentage = x / boundingRef.current.width;
        const yPercentage = y / boundingRef.current.height;
        const xRotation = (xPercentage - 0.5) * 20;
        const yRotation = (0.5 - yPercentage) * -20;
        event.currentTarget.style.transform = `perspective(1000px) rotateX(${yRotation}deg) rotateY(${xRotation}deg)`;
        // set glare x, y position
        event.currentTarget.style.setProperty('--x', `${xPercentage * 100}%`);
        event.currentTarget.style.setProperty('--y', `${yPercentage * 100}%`);
      }}
    >
      <div className='text-xs italic text-muted-foreground'>{title}</div>
      <div
        className={cn(
          'flex w-full flex-grow items-center justify-center text-center',
          titleFontSize ?? (isNaN(Number(value)) ? 'text-2xl' : 'text-5xl')
        )}
      >
        {value}
      </div>
      {href && (
        <Link href={href}>
          <Button size='sm' className='w-full' variant='secondary'>
            {actionLabel ?? 'View Details'}
          </Button>
        </Link>
      )}
      <div className='pointer-events-none absolute inset-0 group-hover:bg-[radial-gradient(at_var(--x)_var(--y),hsl(var(--glare))_20%,transparent_80%)]'></div>
    </div>
  );
}

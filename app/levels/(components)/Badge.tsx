import { ReactNode } from 'react';

interface BadgeProps {
  label: string;
  customClass?: string;
  children: ReactNode;
}

export default function Badge(props: BadgeProps) {
  return (
    <div className='relative'>
      <span
        className={`absolute drop-shadow-lg -top-4 -right-8 h-6 lg:h-8 text-md lg:text-xl w-auto px-4 z-10 text-white dark:text-neon-black rounded-full font-mono ${
          props.customClass ?? 'bg-black dark:bg-neon-black'
        }`}
      >
        {props.label}
      </span>
      {props.children}
    </div>
  );
}

import { ReactNode } from 'react';

interface BadgeProps {
  label: string;
  customClass?: string;
  children: ReactNode;
}

export default function AuthorBadge(props: BadgeProps) {
  return (
    <div className='relative'>
      <span
        className={`absolute drop-shadow-lg -bottom-3 lg:-bottom-4 -right-2 h-5 lg:h-8 text-xs lg:text-xl w-auto px-2 lg:px-4 z-10 rounded-full font-mono ${
          props.customClass ??
          'bg-black dark:bg-neon-black text-white dark:text-neon-white !border-2 !border-white !dark:border-neon-white'
        } whitespace-nowrap`}
      >
        by {props.label}
      </span>
      {props.children}
    </div>
  );
}

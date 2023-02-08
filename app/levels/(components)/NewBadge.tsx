import { ReactNode } from 'react';

interface BadgeProps {
  customClass?: string;
  children: ReactNode;
}

export default function NewBadge(props: BadgeProps) {
  return (
    <div className='relative'>
      <span
        className={`absolute drop-shadow-lg -top-2 lg:-top-4 -left-0 h-4 lg:h-8 text-xs lg:text-xl w-auto px-2 lg:px-4 z-10 text-white dark:text-neon-black rounded-full font-mono ${
          props.customClass ?? 'bg-yellow dark:bg-neon-yellow z-10'
        }`}
      >
        NEW
        <span
          className={`absolute w-full drop-shadow-lg left-0 top-0 h-4 lg:h-8 text-xs lg:text-xl px-2 lg:px-4 z-20 text-white dark:text-neon-black rounded-full font-mono ${
            props.customClass ?? 'bg-yellow dark:bg-neon-yellow animate-ping'
          }`}
        ></span>
      </span>
      {props.children}
    </div>
  );
}

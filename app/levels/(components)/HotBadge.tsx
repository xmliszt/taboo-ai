import { ReactNode } from 'react';

interface BadgeProps {
  customClass?: string;
  children: ReactNode;
}

export default function HotBadge(props: BadgeProps) {
  return (
    <div className='relative'>
      <span
        className={`absolute drop-shadow-lg -top-2 lg:-top-4 -right-4 h-4 lg:h-8 text-xs lg:text-xl w-auto px-2 lg:px-4 z-10 text-white dark:text-neon-black rounded-full font-mono ${
          props.customClass ?? 'bg-red-light dark:bg-neon-red-light z-10'
        }`}
      >
        HOT
        <span
          className={`absolute w-full drop-shadow-lg left-0 top-0 h-4 lg:h-8 text-xs lg:text-xl px-2 lg:px-4 z-20 text-white dark:text-neon-black rounded-full font-mono ${
            props.customClass ?? 'bg-red dark:bg-neon-red animate-ping'
          }`}
        ></span>
      </span>
      {props.children}
    </div>
  );
}

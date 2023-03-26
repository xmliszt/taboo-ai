import { ReactNode } from 'react';

interface BadgeProps {
  customClass?: string;
  location?: 'TOP-LEFT' | 'TOP-RIGHT' | 'BOTTOM-LEFT' | 'BOTTOM-RIGHT';
  children: ReactNode;
}

export default function NewBadge(props: BadgeProps) {
  let locationClass = '-top-2 lg:-top-4 -left-0';
  switch (props.location) {
    case 'TOP-LEFT':
      locationClass = '-top-2 lg:-top-4 -left-0';
      break;
    case 'TOP-RIGHT':
      locationClass = '-top-2 lg:-top-4 -right-4';
      break;
    case 'BOTTOM-LEFT':
      locationClass = '-bottom-2 lg:-bottom-4 -left-0';
      break;
    case 'BOTTOM-RIGHT':
      locationClass = '-bottom-2 lg:-bottom-4 -right-4';
      break;
  }
  return (
    <div className='relative'>
      <span
        className={`absolute drop-shadow-lg ${locationClass} h-4 lg:h-8 text-xs lg:text-xl w-auto px-2 lg:px-4 z-10 text-white dark:text-neon-black rounded-full font-mono ${
          props.customClass ?? 'bg-yellow dark:bg-neon-yellow z-10'
        } whitespace-nowrap`}
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

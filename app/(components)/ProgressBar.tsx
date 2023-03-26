'use client';

import { uniqueId } from 'lodash';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  const makeProgressNode = (n: number, c: number) => {
    return (
      <span
        key={uniqueId(n.toString())}
        className={`font-serif transition-all h-8 w-8 shadow-lg lg:w-12 lg:h-12 aspect-square rounded-full text-center flex items-center justify-center text-base lg:text-xl ease-in-out ${
          n < c
            ? 'bg-green text-white dark:bg-neon-green dark:text-neon-gray border-2 border-white'
            : n == c
            ? 'bg-yellow border-white border-4 text-black dark:bg-neon-yellow dark:text-neon-black dark:border-neon-green'
            : 'bg-white text-black dark:bg-neon-gray dark:text-neon-white'
        }`}
      >
        {n}
      </span>
    );
  };

  const makeLinkage = (n: number, c: number) => {
    return (
      <div
        key={uniqueId(n.toString())}
        className={`w-auto flex-grow shadow-lg transition-colors ease-in-out rounded-full h-2 ${
          n < c ? 'bg-white' : 'border-2 border-white dark:border-neon-black'
        }`}
      ></div>
    );
  };

  const renderProgress = () => {
    const current = props.current;
    const total = props.total;

    const parts = [];
    for (let i = 1; i <= total; i++) {
      parts.push(makeProgressNode(i, current));
      i < total && parts.push(makeLinkage(i, current));
    }
    return parts;
  };

  return (
    <section className='w-full flex flex-grow flex-row justify-between items-center gap-2 px-6 overflow-x-scroll scrollbar-hide'>
      {renderProgress()}
    </section>
  );
}

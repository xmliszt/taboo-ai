'use client';

import { QuickAccessLevelCard } from './quick-access-level-card';

export function QuickAccessLevelCardGroup(props: {
  levels: { id: string; author: string | null }[];
}) {
  return (
    <div className='flex w-full flex-wrap items-center justify-center gap-4 px-4 text-center'>
      {props.levels.map((level) => (
        <QuickAccessLevelCard key={level.id} levelId={level.id} author={level.author} />
      ))}
    </div>
  );
}

'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { updateLevel } from '@/app/x/review-words/[level_id]/server/update-level';
import { Button } from '@/components/ui/button';

type LevelControlButtonGroupProps = {
  levelId: string;
};

export function NewLevelButtonGroup(props: LevelControlButtonGroupProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <div className={'flex flex-row justify-evenly'}>
      <Button
        disabled={isPending}
        className={'h-6 w-full rounded-none'}
        onClick={() => {
          startTransition(async () => {
            await updateLevel(props.levelId, { is_new: true });
            router.refresh();
          });
        }}
      >
        Set is new
      </Button>
      <Button
        disabled={isPending}
        className={'h-6 w-full rounded-none'}
        variant={'destructive'}
        onClick={() => {
          startTransition(async () => {
            await updateLevel(props.levelId, { is_new: false });
            router.refresh();
          });
        }}
      >
        Set is not new
      </Button>
    </div>
  );
}

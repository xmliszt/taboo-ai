'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { rejectTarget, verifyTarget } from '@/app/x/review-words/[level_id]/server/update-word';
import { Button } from '@/components/ui/button';

type LevelWordVerificationSectionProps = {
  targetWord: string;
};

export function LevelWordVerificationSection(props: LevelWordVerificationSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function verifyWord() {
    startTransition(async () => {
      await verifyTarget(props.targetWord);
      toast.success(`Verified target word for ${props.targetWord}`);
      router.refresh();
    });
  }

  function rejectWord() {
    startTransition(async () => {
      await rejectTarget(props.targetWord);
      toast.success(`Rejected target word for ${props.targetWord}`);
      router.refresh();
    });
  }

  return (
    <div className={'mt-2 flex flex-row items-center'}>
      <Button
        disabled={isPending}
        size={'sm'}
        className={'h-6 w-full rounded-none'}
        onClick={verifyWord}
      >
        Verify word
      </Button>
      <Button
        disabled={isPending}
        size={'sm'}
        variant={'destructive'}
        className={'h-6 w-full rounded-none'}
        onClick={rejectWord}
      >
        Un-verify word
      </Button>
    </div>
  );
}

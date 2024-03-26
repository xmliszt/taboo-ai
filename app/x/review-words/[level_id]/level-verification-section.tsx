'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AsyncReturnType } from 'type-fest';

import { deleteLevel } from '@/app/x/review-words/[level_id]/server/delete-level';
import { fetchLevel } from '@/app/x/review-words/[level_id]/server/fetch-level';
import { sendSecureEmail } from '@/app/x/review-words/[level_id]/server/send-email';
import { updateLevel } from '@/app/x/review-words/[level_id]/server/update-level';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RejectionReason, REJECTIONS } from '@/lib/constants';

type LevelVerificationSectionProps = {
  level: AsyncReturnType<typeof fetchLevel>;
};

export function LevelVerificationSection(props: LevelVerificationSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('ambiguous');

  function verifyTopic() {
    confirmAlert({
      title: 'Verify Topic',
      description: `Are you sure you want to verify the topic "${props.level.name}"?`,
      confirmLabel: 'Verify',
      onConfirm: () => performVerifyLevelAction(),
    });
  }

  function performVerifyLevelAction() {
    startTransition(async () => {
      if (props.level.author) {
        const authorEmail = props.level.author?.email;
        if (!authorEmail) {
          toast.error('Author email is not available');
          return;
        }
        await sendSecureEmail(
          `Congratulations! Your Taboo AI contribution "${props.level.name}" is now live 🎉`,
          authorEmail,
          'verify'
        );
        toast.success(`Sent an email to the author of the topic "${props.level.name}".`);
      }
      await updateLevel(props.level.id, { is_verified: true });
      toast.success(`Verified the topic "${props.level.name}".`);
      router.replace('/x/review-words');
    });
  }

  function performRejectLevelAction() {
    const authorEmail = props.level.author?.email;
    if (!authorEmail) {
      toast.error('Author email is not available. Cannot send rejection email');
      return;
    }
    startTransition(async () => {
      await deleteLevel(props.level.id);
      await sendSecureEmail(
        "Hi! Let's elevate your topic! Resubmit your Taboo AI entry 🚀",
        authorEmail,
        'reject',
        rejectionReason
      );
      toast.success(`Rejected the topic "${props.level.name}" and sent an email to the author`);
      router.replace('/x/review-words');
    });
  }

  return (
    <div className={'mt-4 flex w-full flex-row items-center'}>
      <Button
        disabled={isPending}
        size={'sm'}
        className={'w-full rounded-none'}
        onClick={verifyTopic}
      >
        Verify Topic
      </Button>
      {/* For rejection */}
      <AlertDialog>
        <AlertDialogTrigger className={'w-full rounded-none'}>
          <Button
            disabled={isPending}
            size={'sm'}
            variant={'destructive'}
            className={'w-full rounded-none'}
          >
            Reject Topic
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject the topic</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to reject the topic "${props.level.name}"? The topic will be deleted.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>Select the rejection reason:</div>
          <RadioGroup
            value={rejectionReason}
            onValueChange={(value) => {
              setRejectionReason(value as RejectionReason);
            }}
          >
            {Object.entries(REJECTIONS).map(([key, value]) => (
              <div key={key} className='flex items-center space-x-2'>
                <RadioGroupItem id={key} value={key}>
                  {value.title}
                </RadioGroupItem>
                <Label htmlFor={key}>{value.title}</Label>
              </div>
            ))}
          </RadioGroup>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={'bg-destructive text-destructive-foreground hover:bg-red-400'}
              disabled={isPending}
              onClick={performRejectLevelAction}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

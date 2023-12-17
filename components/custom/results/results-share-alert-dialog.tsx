import { ForwardedRef, forwardRef, MouseEventHandler } from 'react';
import { isMobile } from 'react-device-detect';

import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CONSTANTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

import { StarRatingBar } from '../star-rating-bar';

interface ResultsShareAlertDialogProps {
  isOpen: boolean;
  totalScore: number;
  topicName: string;
  scores: {
    key: string;
    target: string;
    calculatedScore: number;
  }[];
  onOpenChange: (open: boolean) => void;
  onGenerateShareCardImage: MouseEventHandler;
}

export const ResultsShareAlertDialog = forwardRef(
  (
    {
      isOpen,
      totalScore,
      topicName,
      scores,
      onOpenChange,
      onGenerateShareCardImage,
    }: ResultsShareAlertDialogProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className='flex w-11/12 items-center justify-center !rounded-none !border-none !bg-transparent p-0 !shadow-none'>
          <div
            ref={ref}
            className={cn(
              isMobile ? 'w-full' : 'w-[500px]',
              'border-card-border flex flex-col gap-3 rounded-lg border-[1px] bg-card p-6 text-card-foreground shadow-lg'
            )}
          >
            <AlertDialogTitle>
              <div
                className={cn(
                  'flex',
                  isMobile
                    ? 'flex-col-reverse items-center justify-start gap-4'
                    : 'flex-row items-center justify-between gap-4'
                )}
              >
                <h2 className='text-xl italic'>
                  Topic: <b>{topicName}</b>
                </h2>
                <StarRatingBar size={25} rating={(totalScore * 6) / 300} maxRating={6} />
              </div>
            </AlertDialogTitle>
            <div className='mt-4 leading-snug'>
              <p>
                Hey! I scored a total of <b>{totalScore.toFixed(2)}</b> out of 300 in Taboo AI!
              </p>
            </div>
            <Separator />
            {scores && scores.length === CONSTANTS.numberOfQuestionsPerGame && (
              <div className='flex flex-col gap-2'>
                {scores.map((score) => (
                  <div
                    key={score.key}
                    className='flex w-full flex-row items-center justify-between gap-4 leading-none'
                  >
                    <b>{score.target}</b>
                    <StarRatingBar rating={(score.calculatedScore * 5) / 100} maxRating={5} />
                  </div>
                ))}
              </div>
            )}
            <div className='mt-6 w-full text-right text-xl font-bold italic'>Taboo AI</div>
          </div>

          <div className='absolute -bottom-16 flex w-full flex-row gap-4'>
            <Button className='w-full' onClick={onGenerateShareCardImage}>
              Share
            </Button>
            <Button
              className='w-full border-[1px] border-card-foreground'
              variant='secondary'
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Dismiss
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

ResultsShareAlertDialog.displayName = 'ResutlsShareAlertDialog';

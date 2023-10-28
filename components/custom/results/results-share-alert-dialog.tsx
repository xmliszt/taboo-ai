import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CONSTANTS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ForwardedRef, forwardRef, MouseEventHandler, useState } from 'react';
import { isMobile } from 'react-device-detect';
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
        <AlertDialogContent className='p-0 !rounded-none !bg-transparent !border-none !shadow-none flex justify-center items-center w-11/12'>
          <div
            ref={ref}
            className={cn(
              isMobile ? 'w-full' : 'w-[500px]',
              'flex flex-col gap-3 rounded-lg bg-card text-card-foreground p-6 shadow-lg border-[1px] border-card-border'
            )}
          >
            <AlertDialogTitle>
              <div
                className={cn(
                  'flex',
                  isMobile
                    ? 'flex-col-reverse justify-start gap-4 items-center'
                    : 'flex-row justify-between items-center gap-4'
                )}
              >
                <h2 className='text-xl italic'>
                  Topic: <b>{topicName}</b>
                </h2>
                <StarRatingBar
                  size={25}
                  rating={(totalScore * 6) / 300}
                  maxRating={6}
                />
              </div>
            </AlertDialogTitle>
            <div className='mt-4 leading-snug'>
              <p>
                Hey! I scored a total of <b>{totalScore}</b> out of 300 in Taboo
                AI!
              </p>
            </div>
            <Separator />
            {scores && scores.length === CONSTANTS.numberOfQuestionsPerGame && (
              <div className='flex flex-col gap-2'>
                {scores.map((score) => (
                  <div
                    key={score.key}
                    className='flex flex-row gap-4 items-center w-full justify-between'
                  >
                    <b>{score.target}</b>
                    <StarRatingBar
                      rating={(score.calculatedScore * 5) / 100}
                      maxRating={5}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className='mt-6 w-full text-xl text-right italic font-bold'>
              Taboo AI
            </div>
          </div>

          <div className='absolute -bottom-16 w-full flex flex-row gap-4'>
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

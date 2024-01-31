'use client';

import React, { useRef, useState } from 'react';
import copy from 'clipboard-copy';
import { startCase } from 'lodash';
import { isMobile } from 'react-device-detect';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { toast } from 'sonner';

import { Game } from '@/app/result/server/fetch-game';
import { StarRatingBar } from '@/components/custom/star-rating-bar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CONSTANTS } from '@/lib/constants';
import { b64toBlob, getDifficulty, shareImage } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getCalculatedScore } from '@/lib/utils/gameUtils';

type ShareScoreButtonProps = {
  gameToShare?: Game;
};

export function ShareScoreButton(props: ShareScoreButtonProps) {
  const [open, setOpen] = useState(false);
  const shareCardRef = useRef(null);

  return (
    <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
      <AlertDialogTrigger
        asChild
        className='group/trigger absolute right-2 top-3 h-[24px] border drop-shadow-md'
      >
        <Button
          variant='secondary'
          disabled={props.gameToShare === undefined}
          size='sm'
          className='flex flex-row items-center gap-2'
        >
          <FaArrowUpRightFromSquare
            size={12}
            className='transition-transform ease-in-out group-hover/trigger:-rotate-45'
          />
          Share your result
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='flex w-11/12 items-center justify-center !rounded-none !border-none !bg-transparent p-0 !shadow-none'>
        {props.gameToShare && (
          <>
            <div
              className={cn(
                isMobile ? 'w-full' : 'w-[500px]',
                'border-card-border flex flex-col gap-3 rounded-lg border-[1px] bg-card p-6 text-card-foreground shadow-lg'
              )}
              ref={shareCardRef}
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
                    Topic: <b>{startCase(props.gameToShare.level_name)}</b>
                  </h2>
                  <StarRatingBar
                    size={25}
                    rating={(props.gameToShare.total_score * 6) / 300}
                    maxRating={6}
                  />
                </div>
                <div
                  className={cn(
                    'w-full font-extrabold italic text-muted-foreground',
                    isMobile ? 'text-center' : 'text-left'
                  )}
                >
                  {getDifficulty(props.gameToShare.level_difficulty, false)}
                </div>
              </AlertDialogTitle>
              <div className='mt-4 leading-snug'>
                <p>
                  Hey! I scored a total of <b>{props.gameToShare.total_score.toFixed(2)}</b> out of
                  300 in Taboo AI!
                </p>
              </div>
              <Separator />
              {props.gameToShare.scores.length === CONSTANTS.numberOfQuestionsPerGame && (
                <div className='flex flex-col gap-2'>
                  {props.gameToShare.scores.map((score) => (
                    <div
                      key={score.score_id}
                      className='flex w-full flex-row items-center justify-between gap-4 leading-none'
                    >
                      <b>{startCase(score.target_word)}</b>
                      <StarRatingBar
                        rating={
                          (getCalculatedScore(
                            score.duration,
                            score.ai_score ?? 0,
                            props.gameToShare?.level_difficulty ?? 0
                          ) *
                            5) /
                          100
                        }
                        maxRating={5}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className='mt-6 w-full text-right text-xl font-bold italic'>Taboo AI</div>
            </div>

            <div className='absolute -bottom-16 flex w-full flex-row gap-4'>
              <Button
                className='w-full'
                onClick={async () => {
                  if (!shareCardRef.current) return;
                  const shareResult = await shareImage(shareCardRef.current);
                  performNavigatorShare(
                    '',
                    props.gameToShare?.total_score ?? 0,
                    shareResult.href,
                    shareResult.downloadName
                  );
                }}
              >
                Share
              </Button>
              <Button
                className='w-full border-[1px] border-card-foreground'
                variant='secondary'
                onClick={() => {
                  setOpen(false);
                }}
              >
                Dismiss
              </Button>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}

const performNavigatorShare = (
  title: string,
  totalScore: number,
  imageLink?: string,
  imageName?: string
) => {
  const link = document.createElement('a');
  if (imageLink && imageName) {
    link.href = imageLink;
    link.download = imageName;
    if (navigator.share) {
      navigator
        .share({
          title: title,
          files: [
            new File([b64toBlob(imageLink.split(',')[1], 'image/octet-stream')], imageName, {
              type: 'image/png',
            }),
          ],
        })
        .then(() => console.log('Shared'))
        .catch((error) => {
          link.click();
          throw error;
        });
    } else {
      link.click();
    }
  } else {
    // Plain Text Sharing
    if (navigator.share) {
      navigator
        .share({
          title:
            totalScore > 0
              ? `I scored ${totalScore.toFixed(2)} in Taboo AI!`
              : 'Look at my results at Taboo AI!',
          text: title,
        })
        .then(() => {
          console.log('Shared');
          return;
        })
        .catch((error) => {
          throw error;
        });
    }
    copy(title)
      .then(() => {
        toast.success('Sharing content has been copied to clipboard!');
      })
      .catch((error) => {
        throw error;
      });
  }
};

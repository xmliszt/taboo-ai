'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import copy from 'clipboard-copy';
import { startCase } from 'lodash';
import { Share } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import { toast } from 'sonner';

import { Level } from '@/app/level/[id]/server/fetch-level';
import { ScoreToUpload } from '@/app/level/[id]/server/upload-game';
import { fetchGame, Game } from '@/app/result/server/fetch-game';
import { StarRatingBar } from '@/components/custom/star-rating-bar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import { Separator } from '@/components/ui/separator';
import { CONSTANTS } from '@/lib/constants';
import { b64toBlob, getDifficulty, shareImage } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getCalculatedScore } from '@/lib/utils/gameUtils';

export function ShareScoreButton() {
  const searchParams = useSearchParams();
  const [game, setGame] = useState<Game>();
  const [open, setOpen] = useState(false);
  const shareCardRef = useRef(null);

  const gameId = searchParams.get('id');
  const levelRawString = searchParams.get('level');
  const savedScoresRawString = searchParams.get('scores');

  useEffect(() => {
    async function fetch(gameId: string) {
      if (gameId) {
        const game = await fetchGame(gameId);
        setGame(game);
      }
    }

    gameId && fetch(gameId);
    // If savedScoresRawString present, we read from the savedScoresRawString.
    if (savedScoresRawString && levelRawString) {
      const savedLevel: Level = JSON.parse(levelRawString);
      if (!savedLevel) throw new Error('No level found so we cannot load the result.');
      const savedScores: ScoreToUpload[] = JSON.parse(savedScoresRawString);
      const totalScore = savedScores.reduce(
        (acc, score) =>
          acc +
          getCalculatedScore(score.duration, score.ai_evaluation.ai_score, savedLevel.difficulty),
        0
      );
      const totalDuration = savedScores.reduce((acc, score) => acc + score.duration, 0);
      const gameScores: Game['scores'] = savedScores.map((score) => ({
        game_id: '',
        score_id: '',
        ...score,
        ...score.ai_evaluation,
      }));
      const game = {
        game_id: '',
        level_id: savedLevel.id,
        level_difficulty: savedLevel.difficulty,
        level_name: savedLevel.name,
        level: savedLevel,
        scores: gameScores,
        total_score: totalScore,
        total_time_taken: totalDuration,
        is_custom_game: savedLevel.is_ai_generated ?? false,
      };
      setGame(game);
    }
  }, [gameId, savedScoresRawString, levelRawString]);

  if (!game) {
    return null;
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
        <AlertDialogTrigger asChild>
          <IconButton tooltip='Share your scores'>
            <Share />
          </IconButton>
        </AlertDialogTrigger>
        <AlertDialogContent className='flex w-11/12 items-center justify-center !rounded-none !border-none !bg-transparent p-0 !shadow-none'>
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
                  Topic: <b>{game.level_name}</b>
                </h2>
                <StarRatingBar size={25} rating={(game.total_score * 6) / 300} maxRating={6} />
              </div>
              <div
                className={cn(
                  'w-full font-extrabold italic text-muted-foreground',
                  isMobile ? 'text-center' : 'text-left'
                )}
              >
                {getDifficulty(game.level_difficulty, false)}
              </div>
            </AlertDialogTitle>
            <div className='mt-4 leading-snug'>
              <p>
                Hey! I scored a total of <b>{game.total_score.toFixed(2)}</b> out of 300 in Taboo
                AI!
              </p>
            </div>
            <Separator />
            {game.scores.length === CONSTANTS.numberOfQuestionsPerGame && (
              <div className='flex flex-col gap-2'>
                {game.scores.map((score) => (
                  <div
                    key={score.score_id}
                    className='flex w-full flex-row items-center justify-between gap-4 leading-none'
                  >
                    <b>{startCase(score.target_word)}</b>
                    <StarRatingBar
                      rating={
                        (getCalculatedScore(score.duration, score.ai_score, game.level_difficulty) *
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
                  game.total_score,
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
        </AlertDialogContent>
      </AlertDialog>
    </>
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

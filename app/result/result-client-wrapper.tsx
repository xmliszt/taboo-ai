'use client';

import React from 'react';
import Link from 'next/link';

import { Level } from '@/app/level/[id]/server/fetch-level';
import { ScoreToUpload } from '@/app/level/[id]/server/upload-game';
import { ScoreDetailsAccordion } from '@/app/result/score-details-accordion';
import { Game } from '@/app/result/server/fetch-game';
import { TopicContributionController } from '@/app/result/topic-contribution-controller';
import { useAskForFeedback } from '@/components/ask-for-feedback-provider';
import ResultsSummaryCard from '@/components/custom/results/results-summary-card';
import { ShareScoreButton } from '@/components/header/share-score-button';
import { Button } from '@/components/ui/button';
import { HASH } from '@/lib/hash';
import { getPersistence } from '@/lib/persistence/persistence';
import { getCalculatedScore } from '@/lib/utils/gameUtils';

type ResultClientWrapperProps = {
  user?: User;
  storedHashKey?: string;
  remotelyFetchedGame?: Game;
};

export function ResultClientWrapper(props: ResultClientWrapperProps) {
  useAskForFeedback();
  let game: Game | undefined = props.remotelyFetchedGame;

  let level: Level | undefined = undefined;
  let totalScore = 0;
  let totalDuration = 0;

  // If remotelyFetched present, we fetch from the server.
  if (game) {
    level = {
      ...game.level,
      is_ai_generated: false,
    };
    totalScore = game.total_score;
    totalDuration = game.total_time_taken;
  }

  // If no remotelyFetched present, we check for persistent store.
  if (!game && !level && props.storedHashKey) {
    const savedLevel: Level | null = getPersistence(HASH.level);
    if (!savedLevel) throw new Error('No level found so we cannot load the result.');
    const savedScores: ScoreToUpload[] | null = getPersistence(props.storedHashKey);
    if (!savedScores) throw new Error('No scores found so we cannot load the result.');
    totalScore = savedScores.reduce(
      (acc, score) =>
        acc +
        getCalculatedScore(score.duration, score.ai_evaluation.ai_score, savedLevel.difficulty),
      0
    );
    totalDuration = savedScores.reduce((acc, score) => acc + score.duration, 0);
    const gameScores: Game['scores'] = savedScores.map((score) => ({
      game_id: '',
      score_id: '',
      ...score,
      ...score.ai_evaluation,
    }));
    game = {
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
    level = savedLevel;
    console.dir({ game, level });
  }

  // If still no game or no level, we throw an error.
  if (!level) throw new Error('No level found so we cannot load the result.');
  if (!game) throw new Error('No game found so we cannot load the result.');

  return (
    <div className='relative mx-auto mb-8 flex max-w-lg flex-col gap-6 px-4 pt-6'>
      <ShareScoreButton gameToShare={game} />
      <ResultsSummaryCard
        total={totalDuration}
        totalScore={totalScore}
        topicName={level.name}
        difficulty={level.difficulty}
      />
      <ScoreDetailsAccordion pro level={level} game={game} />
      {game.is_custom_game && <TopicContributionController level={level} user={props.user} />}
      <div className='fixed bottom-0 left-0 right-0 z-40 flex w-full justify-center'>
        <Link className='w-full max-w-lg px-8 py-4' href={`/level/${level.id}`}>
          <Button className='w-full shadow-xl'>Play this topic again</Button>
        </Link>
      </div>
    </div>
  );
}

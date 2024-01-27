import React from 'react';
import Link from 'next/link';
import { round, startCase } from 'lodash';
import { MousePointerClick } from 'lucide-react';
import { AsyncReturnType } from 'type-fest';

import { Level } from '@/app/level/[id]/server/fetch-level';
import { ScoreToUpload } from '@/app/level/[id]/server/upload-game';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { CopyToClipboardLabel } from '@/app/result/copy-to-clipboard-label';
import { fetchGame, Game } from '@/app/result/server/fetch-game';
import { TopicContributionController } from '@/app/result/topic-contribution-controller';
import { ResultsAiExplanationInfoDialog } from '@/components/custom/results/results-ai-explanation-info-dialog';
import ResultsSummaryCard from '@/components/custom/results/results-summary-card';
import { StarRatingBar } from '@/components/custom/star-rating-bar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getDifficultyMultipliers } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import {
  calculateTimeScore,
  getCalculatedScore,
  getCompletionSeconds,
  getIndividualRating,
} from '@/lib/utils/gameUtils';

type StatItem = {
  title: string;
  content: React.ReactElement;
  highlights?: Game['scores'][number]['highlights'];
};

type ResultPageProps = {
  searchParams: {
    id?: string;
    level?: string;
    scores?: string;
  };
};

export default async function ResultPage(props: ResultPageProps) {
  let user: AsyncReturnType<typeof fetchUserProfile> | undefined;
  try {
    user = await fetchUserProfile();
  } catch (error) {
    // do nothing
  }

  const gameId = props.searchParams.id;
  const levelRawString = props.searchParams.level;
  const savedScoresRawString = props.searchParams.scores;

  let level: Level | undefined = undefined;
  let game: Game | undefined = undefined;
  let totalScore = 0;
  let totalDuration = 0;

  // If gameId present, we fetch from the server.
  if (gameId) {
    game = await fetchGame(gameId);
    level = {
      ...game.level,
      is_ai_generated: false,
    };
    totalScore = game.total_score;
    totalDuration = game.total_time_taken;
  }

  // If savedScoresRawString present, we read from the savedScoresRawString.
  if (savedScoresRawString && levelRawString) {
    const savedLevel: Level = JSON.parse(levelRawString);
    if (!savedLevel) throw new Error('No level found so we cannot load the result.');
    const savedScores: ScoreToUpload[] = JSON.parse(savedScoresRawString);
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
  }

  if (!level) throw new Error('No level found so we cannot load the result.');
  if (!game) throw new Error('No game found so we cannot load the result.');

  const generateHighlightedMessage = (
    idx: number,
    content: string,
    highlights: Game['scores'][number]['highlights']
  ) => {
    let parts;
    if (highlights.length > 0) {
      parts = applyHighlightsToMessage(
        idx,
        content,
        highlights,
        (key, normal) => {
          return <span key={key}>{normal}</span>;
        },
        (key, highlight) => {
          return (
            <span key={key} className='rounded-lg bg-green-400 px-1 text-black'>
              {highlight}
            </span>
          );
        }
      );
    }
    return parts;
  };

  const applyHighlightsToMessage = (
    idx: number,
    message: string,
    highlights: Game['scores'][number]['highlights'],
    onNormalMessagePart: (key: string, s: string) => React.JSX.Element,
    onHighlightMessagePart: (key: string, s: string) => React.JSX.Element
  ): React.JSX.Element[] => {
    let parts = [];
    if (highlights.length === 0) parts = [<span key={`message-${idx}`}>{message}</span>];
    else {
      let startIndex = 0;
      let endIndex = 0;
      for (const highlight of highlights) {
        endIndex = highlight.start_position;
        while (/[\W_]/g.test(message[endIndex])) {
          endIndex++;
        }
        // Normal part
        parts.push(
          onNormalMessagePart(
            `normal-message-${startIndex}-${endIndex}-${idx}`,
            message.substring(startIndex, endIndex)
          )
        );
        startIndex = endIndex;
        endIndex = highlight.end_position;
        // Highlighted part
        parts.push(
          onHighlightMessagePart(
            `highlight-message-${startIndex}-${endIndex}-${idx}`,
            message.substring(startIndex, endIndex)
          )
        );
        startIndex = endIndex;
      }
      parts.push(
        onNormalMessagePart(`normal-message-${endIndex}-${idx}`, message.substring(endIndex))
      );
    }
    return parts;
  };

  const generateMobileStatsRow = (key: string, title: string, content: React.ReactElement) => {
    return (
      <div key={key} className='gap-2 px-3 py-1 leading-snug'>
        <span className='font-extrabold text-primary'>{title}: </span>
        {content}
      </div>
    );
  };

  const renderMessageBubble = (
    idx: number,
    chat: Game['scores'][number]['conversations'][number],
    score: Game['scores'][number],
    isLastBubble = false
  ) => {
    if (chat.role === 'assistant') {
      return isLastBubble
        ? generateHighlightedMessage(idx, chat.content, score.highlights)
        : chat.content;
    } else if (chat.role === 'error') {
      return <span className='text-slate-500'>{chat.content}</span>;
    } else if (chat.role === 'user') {
      return `${chat.content}`;
    } else {
      return <></>;
    }
  };

  const generateConversation = (score: Game['scores'][number]): React.ReactElement => {
    return (
      <div
        key={score.score_id}
        className='flex w-full flex-col gap-4 bg-secondary p-4 text-secondary-foreground'
      >
        {score.conversations.map((chat, idx) => (
          <p
            key={`accordion-content-chat-bubble-${score.score_id}-${idx}`}
            style={{ wordBreak: 'break-word' }}
            className={cn(
              chat.role === 'user'
                ? 'chat-bubble-right'
                : chat.role === 'assistant'
                  ? 'chat-bubble-left !bg-primary-foreground !text-primary'
                  : chat.role === 'error'
                    ? 'chat-bubble-left !bg-primary-foreground'
                    : 'hidden'
            )}
          >
            {renderMessageBubble(idx, chat, score, idx === score.conversations.length - 1)}
          </p>
        ))}
      </div>
    );
  };

  const generateStatsItems = (score: Game['scores'][number]): StatItem[] => {
    if (!level) return [];
    const timeMultiplier = getDifficultyMultipliers(level.difficulty).timeMultiplier;
    const promptMultiplier = getDifficultyMultipliers(level.difficulty).promptMultiplier;
    const items: StatItem[] = [
      {
        title: 'Ratings',
        content: (
          <StarRatingBar
            className='inline-flex'
            rating={getIndividualRating(
              getCalculatedScore(score.duration, score.ai_score, level.difficulty)
            )}
            maxRating={5}
            size={15}
          />
        ),
      },
      {
        title: 'Total Score',
        content: (
          <span>
            {getCalculatedScore(score.duration, score.ai_score, level.difficulty).toFixed(2)}
          </span>
        ),
      },
      {
        title: 'Total Time Taken',
        content: <span>{`${getCompletionSeconds(score.duration)} seconds`}</span>,
      },
      {
        title: `Time Score (${timeMultiplier * 100}%)`,
        content: (
          <span>{`${calculateTimeScore(score.duration).toString()} x ${
            timeMultiplier * 100
          }% = ${round(calculateTimeScore(score.duration) * timeMultiplier, 2).toFixed(2)}`}</span>
        ),
      },
      {
        title: `Clue Score (${promptMultiplier * 100}%)`,
        content: (
          <span>{`${score.ai_score.toFixed(2)} x ${promptMultiplier * 100}% = ${round(
            score.ai_score * promptMultiplier,
            2
          ).toFixed(2)}`}</span>
        ),
      },
    ];
    if (score.taboo_words.length > 0) {
      items.push({
        title: 'Taboo Words',
        content: <span>{score.taboo_words.map(startCase).join(', ')}</span>,
      });
    }
    items.push({
      title: 'AI Score',
      content: <span>{score.ai_score}</span>,
    });
    const isProUser = user?.user_plan?.type === 'pro';
    items.push({
      title: 'AI Evaluation',
      content: (
        <span>
          {!isProUser && <ResultsAiExplanationInfoDialog pro={isProUser} />}
          {score.ai_explanation}
        </span>
      ),
    });
    if (score.ai_suggestion && score.ai_suggestion.length > 0) {
      items.push({
        title: 'AI Suggestions',
        content: (
          <span>
            {isProUser && <ResultsAiExplanationInfoDialog pro={isProUser} />}
            <div className='ml-2 mt-2 flex flex-col gap-2'>
              {score.ai_suggestion.map((suggestion, idx) => (
                <span key={idx} className='flex items-center'>
                  {idx + 1}. <CopyToClipboardLabel text={suggestion} />
                </span>
              ))}
            </div>
          </span>
        ),
      });
    }
    return items;
  };

  return (
    <>
      <main className='relative'>
        <section className='!leading-screenshot pb-24 pt-4'>
          <div className='mb-8 flex w-full flex-col gap-6 px-4'>
            <ResultsSummaryCard
              total={totalDuration}
              totalScore={totalScore}
              topicName={level.name}
              difficulty={level.difficulty}
            />
            <div>
              <Accordion type='multiple'>
                {game.scores.map((score) => (
                  <AccordionItem
                    key={score.score_index}
                    value={score.score_index.toString()}
                    className='pb-1'
                  >
                    <AccordionTrigger key={score.score_index}>
                      <div className='flex w-full flex-row items-center justify-between gap-2 text-primary'>
                        <div className='flex flex-grow flex-row items-center justify-between gap-2'>
                          <span className='text-left leading-snug'>
                            {startCase(score.target_word)}
                          </span>
                          <div className='flex max-w-[120px] animate-pulse flex-row items-center gap-1 whitespace-nowrap text-xs text-muted-foreground'>
                            <MousePointerClick size={15} />
                          </div>
                        </div>
                        <div className='flex flex-row items-center'>
                          <span className='font-extrabold leading-snug' key={score.score_index}>
                            {getCalculatedScore(
                              score.duration,
                              score.ai_score,
                              level?.difficulty ?? 0
                            ).toFixed(2)}
                            /{100}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent key={score.score_index} className='rounded-lg bg-secondary'>
                      {generateConversation(score)}
                      {generateStatsItems(score).map((item) => {
                        return generateMobileStatsRow(
                          score.score_index.toString(),
                          item.title,
                          item.content
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Link
        className='fixed bottom-2 z-40 flex w-full justify-center gap-2 p-4'
        href={`/level/${level.id}`}
      >
        <Button className='w-[60%] shadow-xl'>Play This Topic Again</Button>
      </Link>
      {game.is_custom_game && <TopicContributionController level={level} user={user} />}
    </>
  );
}

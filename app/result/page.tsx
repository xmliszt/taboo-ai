import React from 'react';
import Link from 'next/link';
import { round, startCase } from 'lodash';
import { MousePointerClick } from 'lucide-react';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { fetchGame, Game } from '@/app/result/server/fetch-game';
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
    id: string;
  };
};

export default async function ResultPage(props: ResultPageProps) {
  const user = await fetchUserProfile();
  const game = await fetchGame(props.searchParams.id);
  const level = game.level[0];

  const totalScore = game.total_score;
  const totalDuration = game.total_time_taken;
  //
  // const [isGameUploading, setIsGameUploading] = useState(false);
  // const [isUploadFailed, setIsUploadFailed] = useState(false);
  // const [expandedValues, setExpandedValues] = useState<string[]>(['word-1']);
  // const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  // const [isTopicReviewSheetOpen, setIsTopicReviewSheetOpen] = useState(false);
  // const [hasTopicSubmitted, setHasTopicSubmitted] = useState(false);
  // const [isScoring, setIsScoring] = useState(false);

  // FIXME: This function should not be called at this stage
  // We can call this in the AI mode flow at the end of the game instead.
  // i.e. AI mode game finished -> (ask for level submission) -> ai evaluation -> cache game -> come to AI mode results page
  // const checkIfEligibleForLevelSubmission = useCallback(async () => {
  //   if (level && level.is_ai_generated && user) {
  //     const exists = await isLevelWithSameNameSubmittedBySameUser(level.name, user.id);
  //     setHasTopicSubmitted(exists);
  //     if (exists) return;
  //     setContributionDialogOpen(true);
  //   }
  // }, [level, user]);

  // FIXME: This function should be run before we are at result page.
  // At result page, the game results will be fetched by the game_id,
  // which is guaranteed to have AI evaluation done.
  // This evaluation stage should be performed before coming to this page.
  // i.e. game finished -> ai evaluation -> upload game -> come to results page
  // const tryUploadGameToCloud = async () => {
  //   if (
  //     level === null ||
  //     user === undefined ||
  //     game === null ||
  //     game.is_custom_game ||
  //     !isGameFinished(game) ||
  //     gameExistedInCloud
  //   )
  //     return;
  //   try {
  //     setIsGameUploading(true);
  //     await uploadCompletedGameForUser(user.id, level.id, game);
  //     setIsUploadFailed(false);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Sorry, we are unable to upload your game at this moment.');
  //     setIsUploadFailed(true);
  //   } finally {
  //     setIsGameUploading(false);
  //   }
  // };

  // FIXME: This function should be run before we are at result page.
  // At result page, the game results will be fetched by the game_id,
  // which is guaranteed to have AI evaluation done.
  // This evaluation stage should be performed before coming to this page.
  // i.e. game finished -> ai evaluation -> upload game -> come to results page
  // const startEvaluation = async (game: IGame) => {
  //   if (!game.scores) return;
  //   setIsLoading(true);
  //   for (let i = 0; i < game.scores.length; i++) {
  //     await evaluateForScore(i, game);
  //   }
  //   setIsLoading(false);
  // };

  // FIXME: This function should be run before we are at result page.
  // At result page, the game results will be fetched by the game_id,
  // which is guaranteed to have AI evaluation done.
  // This evaluation stage should be performed before coming to this page.
  // i.e. game finished -> ai evaluation -> upload game -> come to results page
  // const evaluateForScore = async (idx: number, game: Game | null) => {
  //   if (!game) return;
  //   setIsScoring(true);
  //   setLoadingMessage(
  //     `Stay tuned! Taboo AI is evaluating your performance... [${idx + 1}/${game.scores.length}]`
  //   );
  //   const score = game.scores[idx];
  //   const aiScore = score.ai_score;
  //   const aiExplanation = score.ai_explanation;
  //   if (isDevMode()) {
  //     let aiMockScore;
  //     let aiMockReasoning;
  //     switch (getDevMode()) {
  //       case '1':
  //       case '2':
  //         aiMockScore = random(0, 100);
  //         aiMockReasoning = 'This is a test run.';
  //         break;
  //       case '3':
  //       case '4':
  //         aiMockScore = undefined;
  //         aiMockReasoning = undefined;
  //         break;
  //       default:
  //         aiMockScore = random(0, 100);
  //         aiMockReasoning = 'This is a test run.';
  //     }
  //     aiMockScore !== undefined &&
  //       aiMockReasoning !== undefined &&
  //       updateGameAIEvaluationAtIndex(idx, aiMockScore, aiMockReasoning);
  //     setIsScoring(false);
  //     return;
  //   }
  //   if (user && (aiScore === undefined || aiExplanation === undefined)) {
  //     // Start the AI Evaluation
  //     try {
  //       const { score: evaluationScore, reasoning } = await performEvaluation(user.id, score);
  //       updateGameAIEvaluationAtIndex(idx, evaluationScore, reasoning);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error(
  //         'Sorry, we are unable to evaluate your performance at the moment. Please try again later.'
  //       );
  //     }
  //   }
  //   setIsScoring(false);
  // };

  // FIXME: This function should be run before we are at result page.
  // At result page, the game results will be fetched by the game_id,
  // which is guaranteed to have AI evaluation done.
  // This evaluation stage should be performed before coming to this page.
  // i.e. game finished -> ai evaluation -> upload game -> come to results page
  // const updateGameAIEvaluationAtIndex = (idx: number, aiScore: number, aiReasoning: string) => {
  //   game.scores[idx].ai_evaluation = {
  //     ai_score: aiScore,
  //     ai_explanation: aiReasoning,
  //     ai_suggestion: null,
  //   };
  //   game.scores.sort((a, b) => a.score_index - b.score_index);
  // };

  // FIXME: This function should be run before we are at result page.
  // At result page, the game results will be fetched by the game_id,
  // which is guaranteed to have AI evaluation done.
  // This evaluation stage should be performed before coming to this page.
  // i.e. game finished -> ai evaluation -> upload game -> come to results page
  // const retryScoring = async (scoreId: number) => {
  //   await evaluateForScore(scoreId - 1, game);
  // };

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
      <div key={key} className='px-3 py-1 leading-snug'>
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
            rating={getIndividualRating(getCalculatedScore(score, level.difficulty))}
            maxRating={5}
            size={15}
          />
        ),
      },
      {
        title: 'Total Score',
        content: <span>{getCalculatedScore(score, level.difficulty).toString()}</span>,
      },
      {
        title: 'Total Time Taken',
        content: <span>{`${getCompletionSeconds(score.duration)} seconds`}</span>,
      },
      {
        title: `Time Score (${timeMultiplier * 100}%)`,
        content: (
          <span>{`${calculateTimeScore(score).toString()} x ${timeMultiplier * 100}% = ${round(
            calculateTimeScore(score) * timeMultiplier,
            1
          )}`}</span>
        ),
      },
      {
        title: `Clue Score (${promptMultiplier * 100}%)`,
        content: (
          <span>{`${score.ai_score.toFixed(0)} x ${promptMultiplier * 100}% = ${round(
            score.ai_score * promptMultiplier,
            1
          )}`}</span>
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
      title: 'AI Evaluation',
      content: (
        <span>
          <ResultsAiExplanationInfoDialog isAuthenticated={user !== undefined} />
          {score.ai_explanation}
        </span>
      ),
    });
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
                    key={`word-${score.score_id}`}
                    value={`word-${score.score_id}`}
                    className='pb-1'
                  >
                    <AccordionTrigger key={`accordion-trigger-${score.score_id}`}>
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
                          <span className='font-extrabold leading-snug' key={score.score_id}>
                            {getCalculatedScore(score, level.difficulty)}/{100}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent
                      key={`accordion-content-${score.score_id}`}
                      className='rounded-lg bg-secondary'
                    >
                      {generateConversation(score)}
                      {generateStatsItems(score).map((item, idx) => {
                        return generateMobileStatsRow(
                          `accordion-mobile-stats-row-${score.score_id}-${idx}`,
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
      <div className='fixed bottom-2 z-40 flex w-full flex-col items-center gap-2 px-4 py-4 md:flex-row md:justify-center'>
        <Link href={`/level/${level.id}`}>
          <Button className='w-4/5 shadow-xl'>Play This Topic Again</Button>
        </Link>
      </div>

      {/* TODO: This should not be here! Contributre topic should only be available for AI mode, and right after user finished the game */}
      {/*<ResultContributionAlertDialog*/}
      {/*  open={contributionDialogOpen}*/}
      {/*  onOpenChange={(open) => {*/}
      {/*    setContributionDialogOpen(open);*/}
      {/*  }}*/}
      {/*  onTopicReviewSheetOpenChange={(open) => {*/}
      {/*    if (!open) {*/}
      {/*      setIsTopicReviewSheetOpen(false);*/}
      {/*      return;*/}
      {/*    }*/}
      {/*    if (!user) {*/}
      {/*      EventManager.fireEvent<LoginReminderProps>(CustomEventKey.LOGIN_REMINDER, {*/}
      {/*        title: 'You need to login to contribute a topic to us.',*/}
      {/*      });*/}
      {/*    } else {*/}
      {/*      setIsTopicReviewSheetOpen(true);*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
      {/* TODO: This should not be here! Contributre topic should only be available for AI mode, and right after user finished the game */}
      {/*{!hasTopicSubmitted && (*/}
      {/*  <TopicReviewSheet*/}
      {/*    open={isTopicReviewSheetOpen}*/}
      {/*    onOpenChange={(open) => {*/}
      {/*      setIsTopicReviewSheetOpen(open);*/}
      {/*    }}*/}
      {/*    user={user}*/}
      {/*    defaultNickname={user.nickname ?? user.name ?? ''}*/}
      {/*    topicName={level.name}*/}
      {/*    difficultyLevel={String(level.difficulty)}*/}
      {/*    shouldUseAIForTabooWords={true}*/}
      {/*    targetWords={level.words}*/}
      {/*    onTopicSubmitted={() => {*/}
      {/*      setHasTopicSubmitted(true);*/}
      {/*    }}*/}
      {/*    isAIGenerated={level.is_ai_generated}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
}

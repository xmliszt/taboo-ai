'use client';

import copy from 'clipboard-copy';
import _ from 'lodash';
import { CircleSlash, Hand, MousePointerClick, RefreshCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';

import { useAuth } from '@/components/auth-provider';
import { LoginReminderProps } from '@/components/custom/login-reminder-dialog';
import ResutlsContributionAlertDialog from '@/components/custom/results/results-contribution-alert-dialog';
import { ResultsShareAlertDialog } from '@/components/custom/results/results-share-alert-dialog';
import ResultsSummaryCard from '@/components/custom/results/results-summary-card';
import ResultsUploadAlert from '@/components/custom/results/results-upload-alert';
import { ScoreInfoDialog } from '@/components/custom/score-info-button';
import { Skeleton } from '@/components/custom/skeleton';
import { Spinner } from '@/components/custom/spinner';
import { StarRatingBar } from '@/components/custom/star-rating-bar';
import { TopicReviewSheet } from '@/components/custom/topic-review-sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import { useToast } from '@/components/ui/use-toast';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { getPersistence, setPersistence } from '@/lib/persistence/persistence';
import { performEvaluation } from '@/lib/services/aiService';
import {
  fetchGameForUser,
  uploadCompletedGameForUser,
} from '@/lib/services/gameService';
import {
  getLevel,
  isLevelExists,
  updateRealtimeDBLevelRecord,
  uploadPlayedLevelForUser,
} from '@/lib/services/levelService';
import IGame from '@/lib/types/game.type';
import ILevel from '@/lib/types/level.type';
import {
  b64toBlob,
  getDifficultyMultipliers,
  shareImage,
} from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getDevMode, isDevMode } from '@/lib/utils/devUtils';
import {
  aggregateTotalScore,
  calculateTimeScore,
  getCalculatedScore,
  getCompletionSeconds,
  getIndividualRating,
  isGameAIJudged,
  isGameFinished,
} from '@/lib/utils/gameUtils';

import LoadingMask from '../../components/custom/loading-mask';
import { CONSTANTS } from '../../lib/constants';
import { IHighlight } from '../../lib/types/highlight.type';
import { IChat, IScore } from '../../lib/types/score.type';

interface StatItem {
  title: string;
  content: React.ReactElement;
  highlights?: IHighlight[];
}

let gameExistedInCloud = false;

export default function ResultPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, status } = useAuth();
  const searchParams = useSearchParams();
  const gameID = searchParams?.get('id') ?? null;

  const [game, setGame] = useState<IGame | null>(null);
  const [level, setLevel] = useState<ILevel | null>(null);
  const [isCheckingOnline, setIsCheckingOnline] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [isGameUploading, setIsGameUploading] = useState(false);
  const [isUploadFailed, setIsUploadFailed] = useState(false);
  const [expandedValues, setExpandedValues] = useState<string[]>(['word-1']);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [isTopicReviewSheetOpen, setIsTopicReviewSheetOpen] = useState(false);
  const [hasTopicSubmitted, setHasTopicSubmitted] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [isScoring, setIsScoring] = useState(false);

  const screenshotRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const evaluationStarted = useRef<boolean>(false);

  // First render: bind the SHARE_SCORE event listener
  useEffect(() => {
    const listener = EventManager.bindEvent(CustomEventKey.SHARE_SCORE, () => {
      if (!isGameFinished(game)) {
        toast({
          title:
            'Sorry we are not able to share your scores because they are incomplete.',
        });
        return;
      }
      setIsShareCardOpen(true);
    });
    return () => {
      EventManager.removeListener(CustomEventKey.SHARE_SCORE, listener);
    };
  }, [game]);

  // First render: check if level is AI and user logged in, prompt for topic submission if yes
  const checkIfEligibleForLevelSubmission = useCallback(async () => {
    if (level && level.isAIGenerated) {
      const exists = await isLevelExists(level.name, user?.email);
      setHasTopicSubmitted(exists);
      if (exists) return;
      setContributionDialogOpen(true);
    }
  }, [level, user, status]);

  useEffect(() => {
    checkIfEligibleForLevelSubmission();
  }, [checkIfEligibleForLevelSubmission]);

  // First render: wait until user auth is loaded
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated' && gameID) {
      checkOnlineGame();
    } else {
      checkCachedGame();
    }
  }, [status, gameID]);

  const checkOnlineGame = async () => {
    try {
      setIsCheckingOnline(true);
      const game = await fetchGameForUser(user?.email, gameID);
      if (!game) {
        toast({ title: 'Sorry, it seems like this result does not exist.' });
        gameExistedInCloud = false;
        checkCachedGame();
        return;
      }
      const level = await getLevel(game.levelId);
      if (level) {
        gameExistedInCloud = true;
        setGame(game);
        setLevel(level);
      } else {
        gameExistedInCloud = false;
        checkCachedGame();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Sorry, we are unable to load your result at this moment.',
        variant: 'destructive',
      });
      gameExistedInCloud = false;
      checkCachedGame();
    } finally {
      setIsCheckingOnline(false);
    }
  };

  const tryUploadGameToCloud = async () => {
    if (
      level === null ||
      user === undefined ||
      game === null ||
      game.isCustomGame ||
      !isGameFinished(game) ||
      gameExistedInCloud
    )
      return;
    try {
      setIsGameUploading(true);
      await uploadCompletedGameForUser(user.email, level.id, game);
      await uploadPlayedLevelForUser(
        user.email,
        level,
        game.finishedAt,
        game.totalScore
      );
      await updateRealtimeDBLevelRecord(level.id, user, game.totalScore);
      setIsUploadFailed(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Sorry, we are unable to upload your game at this moment.',
      });
      setIsUploadFailed(true);
    } finally {
      setIsGameUploading(false);
    }
  };

  const checkCachedGame = async () => {
    const level = getPersistence<ILevel>(HASH.level);
    const game = getPersistence<IGame>(HASH.game);
    setGame(game);
    setLevel(level);
    if (!game || !level) return;
    if (!isGameAIJudged(game) && !isLoading && !evaluationStarted.current) {
      evaluationStarted.current = true;
      startEvaluation(game);
    }
  };

  // When game object changed
  useEffect(() => {
    if (isGameFinished(game)) tryUploadGameToCloud();
  }, [game]);

  const startEvaluation = async (game: IGame) => {
    if (!game.scores) return;
    setIsLoading(true);
    for (let i = 0; i < game.scores.length; i++) {
      await evaluateForScore(i, game);
    }
    setIsLoading(false);
  };

  const evaluateForScore = async (idx: number, game: IGame | null) => {
    if (!game || !game.scores) return;
    setIsScoring(true);
    setLoadingMessage(
      `Stay tuned! Taboo AI is evaluating your performance... [${idx + 1}/${
        game.scores.length
      }]`
    );
    const score = game.scores[idx];
    const aiScore = score.aiScore;
    const aiExplanation = score.aiExplanation;
    if (isDevMode()) {
      let aiMockScore: number | undefined;
      let aiMockReasoning: string | undefined;
      switch (getDevMode()) {
        case '1':
        case '2':
          aiMockScore = _.random(0, 100);
          aiMockReasoning = 'This is a test run.';
          break;
        case '3':
        case '4':
          aiMockScore = undefined;
          aiMockReasoning = undefined;
          break;
        default:
          aiMockScore = _.random(0, 100);
          aiMockReasoning = 'This is a test run.';
      }
      updateGameAIEvaluationAtIndex(idx, aiMockScore, aiMockReasoning);
      setIsScoring(false);
      return;
    }
    if (aiScore === undefined || aiExplanation === undefined) {
      // Start the AI Evaluation
      try {
        const { score: evaluationScore, reasoning } = await performEvaluation({
          target: score.target,
          taboos: score.taboos,
          conversation: score.conversation,
        });
        updateGameAIEvaluationAtIndex(idx, evaluationScore, reasoning);
      } catch (error) {
        console.error(error);
        toast({
          title:
            'Sorry, we are unable to evaluate your performance at the moment. Please try again later.',
          variant: 'destructive',
        });
      }
    }
    setIsScoring(false);
  };

  const updateGameAIEvaluationAtIndex = (
    idx: number,
    aiScore?: number,
    aiReasoning?: string
  ) => {
    const game = getPersistence<IGame>(HASH.game);
    if (!game || !game.scores) return;
    game.scores[idx].aiScore = aiScore;
    game.scores[idx].aiExplanation = aiReasoning;
    game.scores.sort((a, b) => a.id - b.id);
    game.totalScore = aggregateTotalScore(game.scores, game.difficulty);
    setGame(game);
    setPersistence(HASH.game, game);
  };

  const retryScoring = async (scoreId: number) => {
    await evaluateForScore(scoreId - 1, game);
  };

  const generateShareCardImage = async () => {
    if (!shareCardRef.current) return;
    try {
      setIsShareCardOpen(false);
      const shareResult = await shareImage(shareCardRef.current);
      performNavigatorShare('', shareResult.href, shareResult.downloadName);
    } catch (error) {
      console.error(error);
      toast({
        title:
          'Sorry, we are unable to perform sharing at the moment. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const performNavigatorShare = (
    title: string,
    imageLink?: string,
    imageName?: string
  ) => {
    if (!game || !isGameFinished(game)) {
      toast({
        title:
          'Sorry we are not able to share your scores because they are incomplete.',
        variant: 'destructive',
      });
      return;
    }
    const link = document.createElement('a');
    if (imageLink && imageName) {
      link.href = imageLink;
      link.download = imageName;
      if (navigator.share) {
        navigator
          .share({
            title: title,
            files: [
              new File(
                [b64toBlob(imageLink.split(',')[1], 'image/octet-stream')],
                imageName,
                {
                  type: 'image/png',
                }
              ),
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
              game.totalScore > 0
                ? `I scored ${game.totalScore} in Taboo AI!`
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
          toast({
            title: 'Sharing content has been copied to clipboard!',
          });
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  const generateHighlightedMessage = (
    idx: number,
    content: string,
    highlights: IHighlight[]
  ): React.ReactElement[] => {
    let parts: JSX.Element[] = [];
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
            <span key={key} className='bg-green-400 px-1 rounded-lg text-black'>
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
    highlights: IHighlight[],
    onNormalMessagePart: (key: string, s: string) => JSX.Element,
    onHighlightMessagePart: (key: string, s: string) => JSX.Element
  ): JSX.Element[] => {
    let parts = [];
    if (highlights.length === 0)
      parts = [<span key={`message-${idx}`}>{message}</span>];
    else {
      let startIndex = 0;
      let endIndex = 0;
      for (const highlight of highlights) {
        endIndex = highlight.start;
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
        endIndex = highlight.end;
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
        onNormalMessagePart(
          `normal-message-${endIndex}-${idx}`,
          message.substring(endIndex)
        )
      );
    }
    return parts;
  };

  const generateMobileStatsRow = (
    key: string,
    title: string,
    content: React.ReactElement
  ) => {
    return (
      <div key={key} className='px-3 py-1 leading-snug'>
        <span className='font-extrabold text-primary'>{title}: </span>
        {content}
      </div>
    );
  };

  const renderMessageBubble = (
    idx: number,
    chat: IChat,
    score: IScore,
    isLastBubble = false
  ) => {
    if (chat.role === 'assistant') {
      return isLastBubble
        ? generateHighlightedMessage(
            idx,
            chat.content,
            score.responseHighlights
          )
        : chat.content;
    } else if (chat.role === 'error') {
      return <span className='text-slate-500'>{chat.content}</span>;
    } else if (chat.role === 'user') {
      return `${chat.content}`;
    } else {
      return <></>;
    }
  };

  const generateConversation = (score: IScore): React.ReactElement => {
    return (
      <div
        key={`accordion-content-conversation-${score.id}`}
        className='w-full flex flex-col gap-4 bg-secondary text-secondary-foreground p-4'
      >
        {score.conversation.map((chat, idx) => (
          <p
            key={`accordion-content-chat-bubble-${score.id}-${idx}`}
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
            {renderMessageBubble(
              idx,
              chat,
              score,
              idx === score.conversation.length - 1
            )}
          </p>
        ))}
      </div>
    );
  };

  const generateStatsItems = (
    score: IScore,
    difficulty: number
  ): StatItem[] => {
    const timeMultipler = level
      ? getDifficultyMultipliers(level.difficulty).timeMultipler
      : null;
    const promptMultiplier = level
      ? getDifficultyMultipliers(level.difficulty).promptMultiplier
      : null;
    const items: StatItem[] = [
      {
        title: 'Ratings',
        content: (
          <StarRatingBar
            className='inline-flex'
            rating={getIndividualRating(getCalculatedScore(score, difficulty))}
            maxRating={5}
            size={15}
          />
        ),
      },
      {
        title: 'Total Score',
        content:
          score.aiScore !== undefined ? (
            <span>{getCalculatedScore(score, difficulty).toString()}</span>
          ) : (
            <span>N/A</span>
          ),
      },
      {
        title: 'Total Time Taken',
        content: (
          <span>{`${getCompletionSeconds(score.completion)} seconds`}</span>
        ),
      },
      {
        title: `Time Score (${(timeMultipler ?? 0) * 100}%)`,
        content: (
          <span>{`${calculateTimeScore(score).toString()} x ${
            (timeMultipler ?? 0) * 100
          }% = ${_.round(
            calculateTimeScore(score) * (timeMultipler ?? 0),
            1
          )}`}</span>
        ),
      },
      {
        title: `Clue Score (${(promptMultiplier ?? 0) * 100}%)`,
        content:
          score.aiScore !== undefined ? (
            <span>{`${score.aiScore.toString()} x ${
              (promptMultiplier ?? 0) * 100
            }% = ${_.round(score.aiScore * (promptMultiplier ?? 0), 1)}`}</span>
          ) : (
            <Button
              className='ml-4'
              size='sm'
              variant='outline'
              onClick={() => {
                retryScoring(score.id);
              }}
              disabled={isScoring}
            >
              {isScoring ? <Spinner /> : 'Something went wrong! Re-Score'}
            </Button>
          ),
      },
    ];
    if (score.taboos.length > 0) {
      items.push({
        title: 'Taboo Words',
        content: <span>{score.taboos.join(', ')}</span>,
      });
    }
    items.push({
      title: 'AI Evaluation',
      content: score.aiExplanation ? (
        <span>{score.aiExplanation ?? CONSTANTS.errors.aiJudgeFail}</span>
      ) : (
        <Button
          className='ml-4'
          size='sm'
          variant='outline'
          onClick={() => {
            retryScoring(score.id);
          }}
          disabled={isScoring}
        >
          {isScoring ? <Spinner /> : 'Something went wrong! Re-Score'}
        </Button>
      ),
    });
    return items;
  };

  const generateMobileScoreStack = () => {
    if (!game) return <></>;
    return game.scores.map((score) => (
      <AccordionItem
        key={`word-${score.id}`}
        value={`word-${score.id}`}
        className='pb-1'
      >
        <AccordionTrigger key={`accordion-trigger-${score.id}`}>
          <div className='w-full text-primary flex flex-row gap-2 items-center justify-between'>
            <div className='flex flex-row flex-grow items-center gap-2 justify-between'>
              <span className='text-left leading-snug'>
                {_.startCase(score.target)}
              </span>
              <div className='max-w-[120px] animate-pulse text-muted-foreground text-xs flex flex-row items-center gap-1 whitespace-nowrap'>
                {isMobile || isTablet ? (
                  <Hand size={15} />
                ) : (
                  <MousePointerClick size={15} />
                )}{' '}
                {isMobile || isTablet ? 'Tap' : 'Click'} to{' '}
                {expandedValues.includes(`word-${score.id}`)
                  ? 'fold'
                  : 'expand'}
              </div>
            </div>
            <div className='flex flex-row items-center'>
              {score.aiScore !== undefined ? (
                <span className='font-extrabold leading-snug' key={score.id}>
                  {getCalculatedScore(score, game.difficulty)}/{100}
                </span>
              ) : (
                <IconButton
                  asChild
                  aria-label='Re-Score'
                  tooltip='Re-Score'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    retryScoring(score.id);
                  }}
                  disabled={isScoring}
                >
                  {isScoring ? <Spinner /> : <RefreshCcw />}
                </IconButton>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent
          key={`accordion-content-${score.id}`}
          className='bg-secondary rounded-lg'
        >
          {generateConversation(score)}
          {generateStatsItems(score, game.difficulty).map((item, idx) => {
            return generateMobileStatsRow(
              `accordion-mobile-stats-row-${score.id}-${idx}`,
              item.title,
              item.content
            );
          })}
        </AccordionContent>
      </AccordionItem>
    ));
  };

  const renderResults = () => {
    return game ? (
      <div className='w-full flex flex-col gap-6 mb-8 mt-20 px-4'>
        {isUploadFailed && (
          <ResultsUploadAlert
            isUploading={isGameUploading}
            retryUpload={tryUploadGameToCloud}
          />
        )}
        {level && (
          <ResultsSummaryCard
            total={game.totalDuration}
            totalScore={game.totalScore}
            topicName={level.name}
            difficulty={level.difficulty}
          />
        )}
        <div>
          <Accordion
            type='multiple'
            value={expandedValues}
            onValueChange={(value) => {
              setExpandedValues(value);
            }}
          >
            {generateMobileScoreStack()}
          </Accordion>
        </div>
      </div>
    ) : status === 'loading' || isCheckingOnline ? (
      <Skeleton className='w-full pt-20 px-4' hasHeaderRow numberOfRows={10} />
    ) : (
      <div className='animate-pulse w-full mt-40 px-4 flex flex-col gap-6 justify-center items-center'>
        <CircleSlash size={56} />
        <h2 className='text-2xl font-bold'>You have no results</h2>
      </div>
    );
  };

  return (
    <>
      <main className='relative'>
        <LoadingMask
          key='loading-mask'
          isLoading={isLoading}
          message={loadingMessage}
        />
        <section
          className='!leading-screenshot pb-24 lg:pb-48 pt-4'
          ref={screenshotRef}
        >
          {renderResults()}
        </section>
      </main>
      <div className='fixed flex flex-col md:flex-row gap-2 items-center md:justify-center bottom-2 z-40 w-full py-4 px-4'>
        {!hasTopicSubmitted && level?.isAIGenerated && (
          <Button
            className='w-4/5 shadow-xl'
            onClick={() => {
              if (!user || status !== 'authenticated') {
                EventManager.fireEvent<LoginReminderProps>(
                  CustomEventKey.LOGIN_REMINDER,
                  {
                    title: 'You need to login to contribute a topic to us.',
                  }
                );
              } else {
                setIsTopicReviewSheetOpen(true);
              }
            }}
          >
            Submit This Topic To Us
          </Button>
        )}
        {level && game && isGameFinished(game) && (
          <Button
            className='w-4/5 shadow-xl'
            onClick={() => {
              router.push(`/level/${level.isAIGenerated ? 'ai' : level.id}`);
            }}
          >
            Play This Topic Again
          </Button>
        )}
      </div>

      <ResutlsContributionAlertDialog
        open={contributionDialogOpen}
        onOpenChange={(open) => {
          setContributionDialogOpen(open);
        }}
        onTopicReviewSheetOpenChange={(open) => {
          if (!open) {
            setIsTopicReviewSheetOpen(false);
            return;
          }
          if (status === 'unauthenticated') {
            EventManager.fireEvent<LoginReminderProps>(
              CustomEventKey.LOGIN_REMINDER,
              {
                title: 'You need to login to contribute a topic to us.',
              }
            );
          } else {
            setIsTopicReviewSheetOpen(true);
          }
        }}
      />
      <ScoreInfoDialog />
      {level && game && isGameFinished(game) && (
        <ResultsShareAlertDialog
          ref={shareCardRef}
          isOpen={isShareCardOpen}
          onOpenChange={(open) => {
            setIsShareCardOpen(open);
          }}
          totalScore={game.totalScore}
          topicName={level.name}
          scores={game.scores.map((score) => {
            return {
              key: `${score.id}-${score.target}`,
              target: score.target,
              calculatedScore: getCalculatedScore(score, game.difficulty),
            };
          })}
          onGenerateShareCardImage={generateShareCardImage}
        />
      )}
      {user && level && !hasTopicSubmitted && (
        <TopicReviewSheet
          open={isTopicReviewSheetOpen}
          onOpenChange={(open) => {
            setIsTopicReviewSheetOpen(open);
          }}
          user={user}
          defaultNickname={user.nickname ?? user.name ?? ''}
          topicName={level.name}
          difficultyLevel={String(level.difficulty)}
          shouldUseAIForTabooWords={true}
          targetWords={level.words}
          onTopicSubmitted={() => {
            setHasTopicSubmitted(true);
          }}
          isAIGenerated={level.isAIGenerated}
        />
      )}
    </>
  );
}

'use client';

import copy from 'clipboard-copy';
import { useState, useEffect, useRef, useCallback } from 'react';
import { IAIScore, IDisplayScore } from '../../lib/types/score.type';
import _ from 'lodash';
import { IHighlight } from '../../lib/types/highlight.type';
import { useRouter } from 'next/navigation';
import LoadingMask from '../../components/custom/loading-mask';
import { CONSTANTS } from '../../lib/constants';
import { askAIForJudgingScore } from '../../lib/services/aiService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CircleSlash, Hand, MousePointerClick, RefreshCcw } from 'lucide-react';
import { ScoreInfoDialog } from '@/components/custom/score-info-button';
import { cn } from '@/lib/utils';
import { HASH } from '@/lib/hash';
import { isMobile } from 'react-device-detect';
import { useAuth } from '@/components/auth-provider';
import { TopicReviewSheet } from '@/components/custom/topic-review-sheet';
import { isLevelExists } from '@/lib/services/levelService';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { selectLevelStorage } from '@/lib/redux/features/levelStorageSlice';
import {
  selectScoreStorage,
  setScoresStorage,
} from '@/lib/redux/features/scoreStorageSlice';
import { LoginReminderProps } from '@/components/custom/login-reminder-dialog';
import { StarRatingBar } from '@/components/custom/star-rating-bar';
import {
  b64toBlob,
  calculateTimeScore,
  createConversationFeedForAIJudge,
  getCalculatedScore,
  getCompletionSeconds,
  getDifficultyMultipliers,
  shareImage,
} from '@/lib/utilities';
import ResultsSummaryCard from '@/components/custom/results/results-summary-card';
import { ResultsShareAlertDialog } from '@/components/custom/results/results-share-alert-dialog';
import ResutlsContributionAlertDialog from '@/components/custom/results/results-contribution-alert-dialog';
import { Spinner } from '@/components/custom/spinner';
import { store } from '@/lib/redux/store';
import IconButton from '@/components/ui/icon-button';

interface StatItem {
  title: string;
  content: React.ReactElement;
  highlights?: IHighlight[];
}

export default function ResultPage() {
  const { user, status } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [expandedValues, setExpandedValues] = useState<string[]>(['word-1']);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [isTopicReviewSheetOpen, setIsTopicReviewSheetOpen] = useState(false);
  const [hasTopicSubmitted, setHasTopicSubmitted] = useState(false);
  const level = useAppSelector(selectLevelStorage);
  const scores = useAppSelector(selectScoreStorage);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  let totalTimeTaken: number | undefined = 0;
  let totalScore: number | undefined = 0;

  const checkIfEligibleForLevelSubmission = useCallback(async () => {
    if (level && level.isAIGenerated) {
      const exists = await isLevelExists(level.name, user?.email);
      setHasTopicSubmitted(exists);
      if (exists) {
        toast({ title: 'You have already submitted this topic.' });
        return;
      }
      if (status === 'authenticated') {
        setContributionDialogOpen(true);
      }
    }
  }, [level, user, status]);

  useEffect(() => {
    checkUserStatus();
    const listener = EventManager.bindEvent(CustomEventKey.SHARE_SCORE, () => {
      const scores = store.getState().scoreStorageReducer.scores;
      if (
        scores?.length !== CONSTANTS.numberOfQuestionsPerGame ||
        scores.some((score) => score.ai_score === undefined)
      ) {
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
  }, []);

  useEffect(() => {
    checkIfEligibleForLevelSubmission();
  }, [checkIfEligibleForLevelSubmission]);

  const performAIJudging = async (
    retries: number,
    target: string,
    userInput: string
  ): Promise<IAIScore> => {
    if (localStorage.getItem(HASH.dev) === '1') {
      const devMode = localStorage.getItem('mode') ?? '1';
      switch (devMode) {
        case '1':
        case '2':
          return { score: 50, explanation: 'This is a test run.' };
        case '3':
        case '4':
          return { score: undefined, explanation: undefined };
        default:
          return { score: 50, explanation: 'This is a test run.' };
      }
    }
    try {
      return await askAIForJudgingScore(target, userInput);
    } catch (error) {
      console.error(error);
      if (retries > 0) {
        return performAIJudging(retries - 1, target, userInput);
      } else {
        return { score: undefined, explanation: undefined };
      }
    }
  };

  const checkUserStatus = async () => {
    if (
      scores &&
      scores.length === CONSTANTS.numberOfQuestionsPerGame &&
      !isLoading
    ) {
      // AI judging
      setLoadingMessage(
        `Stay tuned! Taboo AI is evaluating your performance... [0/${scores.length}]`
      );
      setIsLoading(true);
      const copyScores = JSON.parse(JSON.stringify(scores)) as IDisplayScore[];
      if (!copyScores) return;
      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        const userInput = createConversationFeedForAIJudge(score.conversation);
        const target = score.target;
        const aiScore = score.ai_score;
        const aiExplanation = score.ai_explanation;
        if (aiScore !== undefined && aiExplanation !== undefined) {
          setLoadingMessage(
            `Stay tuned! Taboo AI is evaluating your performance... [${i + 1}/${
              scores.length
            }]`
          );
        } else {
          const aiJudgeScore = await performAIJudging(5, target, userInput);
          copyScores[i].ai_score = aiJudgeScore.score;
          copyScores[i].ai_explanation = aiJudgeScore.explanation;
          setLoadingMessage(
            `Stay tuned! Taboo AI is evaluating your performance... [${i + 1}/${
              scores.length
            }]`
          );
        }
      }
      setIsLoading(false);
      setLoadingMessage('Loading...');
      dispatch(setScoresStorage(copyScores));
      updateTotalTimeTakenAndTotalScores(copyScores);
    }
  };

  const retryScoring = async (scoreId: number) => {
    if (!scores) return;
    const copyScores = JSON.parse(JSON.stringify(scores)) as IDisplayScore[];
    if (!copyScores) return;
    const score = copyScores.find((score) => score.id === scoreId);
    if (!score) return;
    const userInput = createConversationFeedForAIJudge(score.conversation);
    const target = score.target;
    const aiScore = score.ai_score;
    const aiExplanation = score.ai_explanation;
    if (aiScore !== undefined && aiExplanation !== undefined) {
      toast({
        title: 'This score has already been judged.',
        variant: 'destructive',
      });
    } else {
      let aiJudgeScore: IAIScore = {
        score: 50,
        explanation: 'This is a test run, re-scored by the user.',
      };
      setIsScoring(true);
      aiJudgeScore = await performAIJudging(5, target, userInput);
      setIsScoring(false);
      if (aiJudgeScore.explanation !== undefined) {
        score.ai_score = aiJudgeScore.score;
        score.ai_explanation = aiJudgeScore.explanation;
        dispatch(setScoresStorage([...copyScores]));
        updateTotalTimeTakenAndTotalScores(copyScores);
        toast({
          title: 'Score has been updated.',
        });
      } else {
        toast({
          title: 'Sorry, we are unable to judge your score at the moment.',
          variant: 'destructive',
        });
      }
    }
  };

  const updateTotalTimeTakenAndTotalScores = (
    displayScores: IDisplayScore[]
  ) => {
    // Update total time taken
    totalTimeTaken = 0;
    for (const score of displayScores) {
      totalTimeTaken += getCompletionSeconds(score.completion);
    }
    if (displayScores.some((s) => s.ai_score === undefined)) {
      totalScore = undefined;
      return;
    }

    // Update total score if possible
    totalScore = 0;
    for (const score of displayScores) {
      totalScore += getCalculatedScore(score);
    }
    totalScore = _.round(totalScore, 1);
  };

  if (
    scores !== undefined &&
    scores.length === CONSTANTS.numberOfQuestionsPerGame
  ) {
    updateTotalTimeTakenAndTotalScores(scores);
  }

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
    if (totalScore === undefined) {
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
              totalScore > 0
                ? `I scored ${totalScore} in Taboo AI!`
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

  const generateConversation = (score: IDisplayScore): React.ReactElement => {
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
                : 'hidden'
            )}
          >
            {chat.role === 'assistant' &&
            idx === score.conversation.length - 1 ? (
              generateHighlightedMessage(
                idx,
                chat.content,
                score.responseHighlights
              )
            ) : chat.role === 'error' ? (
              <span className='text-slate-400'>{chat.content}</span>
            ) : (
              `${chat.content}`
            )}
          </p>
        ))}
      </div>
    );
  };

  const generateStatsItems = (score: IDisplayScore): StatItem[] => {
    const timeMultipler = level
      ? getDifficultyMultipliers(level.difficulty).timeMultipler
      : null;
    const promptMultiplier = level
      ? getDifficultyMultipliers(level.difficulty).promptMultiplier
      : null;
    return [
      {
        title: 'Ratings',
        content: (
          <StarRatingBar
            className='inline-flex'
            rating={(getCalculatedScore(score) * 5) / 100}
            maxRating={5}
            size={15}
          />
        ),
      },
      {
        title: 'Total Score',
        content:
          score.ai_score !== undefined ? (
            <span>{getCalculatedScore(score).toString()}</span>
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
          score.ai_score !== undefined ? (
            <span>{`${score.ai_score.toString()} x ${
              (promptMultiplier ?? 0) * 100
            }% = ${_.round(
              score.ai_score * (promptMultiplier ?? 0),
              1
            )}`}</span>
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
      {
        title: 'AI Explanation',
        content: score.ai_explanation ? (
          <span>{score.ai_explanation ?? CONSTANTS.errors.aiJudgeFail}</span>
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
  };

  const generateMobileScoreStack = () => {
    if (!scores || scores.length < CONSTANTS.numberOfQuestionsPerGame)
      return <></>;
    return scores.map((score, idx) => (
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
              <div className='max-w-[120px] animate-pulse text-muted-foreground text-xs flex flex-row items-center gap-1'>
                {isMobile ? (
                  <Hand size={15} />
                ) : (
                  <MousePointerClick size={15} />
                )}{' '}
                {isMobile ? 'Tap' : 'Click'} to{' '}
                {expandedValues.includes(`word-${score.id}`)
                  ? 'fold'
                  : 'expand'}
              </div>
            </div>
            <div className='flex flex-row items-center'>
              {score.ai_score !== undefined ? (
                <span className='font-extrabold leading-snug' key={score.id}>
                  {getCalculatedScore(score)}/{100}
                </span>
              ) : (
                <IconButton
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
          {generateStatsItems(score).map((item, idx) => {
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
    return scores && scores.length === CONSTANTS.numberOfQuestionsPerGame ? (
      <div className='w-full flex flex-col gap-6 mb-8 mt-20 px-4'>
        {level && (
          <ResultsSummaryCard
            total={totalTimeTaken}
            totalScore={totalScore}
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
    ) : (
      <div className='animate-pulse w-full mt-40 px-4 flex flex-col gap-6 justify-center items-center'>
        <CircleSlash size={56} />
        <h2 className='text-2xl font-bold'>You have no results</h2>
      </div>
    );
  };

  return (
    <>
      <section className='relative'>
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
      </section>
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
        {level &&
          scores &&
          scores.length === CONSTANTS.numberOfQuestionsPerGame && (
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
          setIsTopicReviewSheetOpen(open);
        }}
      />
      <ScoreInfoDialog />
      {level && scores && (
        <ResultsShareAlertDialog
          ref={shareCardRef}
          isOpen={isShareCardOpen}
          onOpenChange={(open) => {
            setIsShareCardOpen(open);
          }}
          totalScore={totalScore}
          topicName={level.name}
          scores={scores.map((score) => {
            return {
              key: `${score.id}-${score.target}`,
              target: score.target,
              calculatedScore: getCalculatedScore(score),
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

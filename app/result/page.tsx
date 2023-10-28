'use client';

import copy from 'clipboard-copy';
import { useState, useEffect, useRef, useCallback } from 'react';
import { IAIScore, IDisplayScore } from '../../lib/types/score.type';
import _, { uniqueId } from 'lodash';
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
import { CircleSlash, Hand, MousePointerClick } from 'lucide-react';
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
  getCalculatedScore,
  getCompletionSeconds,
  getDifficultyMultipliers,
  shareImage,
} from '@/lib/utilities';
import ResultsSummaryCard from '@/components/custom/results/results-summary-card';
import { ResultsShareAlertDialog } from '@/components/custom/results/results-share-alert-dialog';
import ResutlsContributionAlertDialog from '@/components/custom/results/results-contribution-alert-dialog';

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
  const screenshotRef = useRef<HTMLDivElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  let total = 0;
  let totalScore = 0;

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
    const listener = EventManager.bindEvent(CustomEventKey.SHARE_SCORE, () => {
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
    userInput: string,
    completion: (aiScore: IAIScore) => void
  ) => {
    try {
      const score = await askAIForJudgingScore(target, userInput);
      completion(score);
    } catch (error) {
      console.error(error);
      if (retries > 0) {
        performAIJudging(retries - 1, target, userInput, completion);
      } else {
        completion({ score: undefined, explanation: undefined });
      }
    }
  };

  const checkUserStatus = async () => {
    if (scores && scores.length === CONSTANTS.numberOfQuestionsPerGame) {
      // AI judging
      setLoadingMessage(
        `Stay tuned! Taboo AI is evaluating your performance... [0/${scores.length}]`
      );
      setIsLoading(true);
      const copyScores = JSON.parse(JSON.stringify(scores)) as IDisplayScore[];
      if (!copyScores) return;
      for (let i = 0; i < scores.length; i++) {
        const tempScores: IAIScore[] = [];
        const score = scores[i];
        const userInput = score.conversation
          .filter((chat) => chat.role === 'user')
          .map((chat) => chat.content)
          .join(' | ');
        const target = score.target;
        const aiScore = score.ai_score;
        const aiExplanation = score.ai_explanation;
        if (aiScore !== undefined && aiExplanation !== undefined) {
          setLoadingMessage(
            `Stay tuned! Taboo AI is evaluating your performance... [${i + 1}/${
              scores.length
            }]`
          );
        } else if (localStorage.getItem(HASH.dev) === '1') {
          copyScores[i].ai_score = 50;
          copyScores[i].ai_explanation = 'This is a test run.';
        } else {
          for (let t = 0; t < 3; t++) {
            await performAIJudging(5, target, userInput, (aiJudgeScore) => {
              aiJudgeScore.explanation !== undefined &&
                aiJudgeScore.score !== undefined &&
                tempScores.push(aiJudgeScore);
            });
          }
          if (tempScores.length === 0) {
            copyScores[i].ai_score = 50;
            copyScores[i].ai_explanation =
              'Our sincere apologies for a server hiccup that causes AI unable to generate the scores at the moment. We fully recognize that the average score of 50 you received does not appropriately represent your skills and efforts. We deeply regret any inconvenience or frustration this may have caused you. We are actively working to rectify the issue and prevent such occurrences in the future. Thank you for your understanding and patience as we resolve this matter.';
          } else {
            tempScores.sort((s1, s2) => (s2.score ?? 0) - (s1.score ?? 0));
            const bestScore = tempScores[0];
            copyScores[i].ai_score = bestScore.score;
            copyScores[i].ai_explanation = bestScore.explanation;
          }
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
      updateDisplayedScores(copyScores);
    }
  };

  const updateDisplayedScores = (displayScores: IDisplayScore[]) => {
    const copiedScores = JSON.parse(
      JSON.stringify(displayScores)
    ) as IDisplayScore[];
    total = 0;
    totalScore = 0;
    for (const score of copiedScores) {
      total += getCompletionSeconds(score.completion);
      totalScore += getCalculatedScore(score);
    }
    totalScore = _.round(totalScore, 1);
    copiedScores.sort((scoreA, scoreB) => scoreA.id - scoreB.id);
  };

  if (
    scores !== undefined &&
    scores.length === CONSTANTS.numberOfQuestionsPerGame
  ) {
    if (
      scores.some(
        (s) => s.ai_score === undefined || s.ai_explanation === undefined
      )
    ) {
      checkUserStatus();
    } else {
      scores && updateDisplayedScores(scores);
    }
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
    content: string,
    highlights: IHighlight[]
  ): React.ReactElement[] => {
    let parts: JSX.Element[] = [];
    if (highlights.length > 0) {
      parts = applyHighlightsToMessage(
        content,
        highlights,
        (normal) => {
          return <span key={uniqueId()}>{normal}</span>;
        },
        (highlight) => {
          return (
            <span
              key={uniqueId()}
              className='bg-green-400 px-1 rounded-lg text-black'
            >
              {highlight}
            </span>
          );
        }
      );
    }
    return parts;
  };

  const applyHighlightsToMessage = (
    message: string,
    highlights: IHighlight[],
    onNormalMessagePart: (s: string) => JSX.Element,
    onHighlightMessagePart: (s: string) => JSX.Element
  ): JSX.Element[] => {
    let parts = [];
    if (highlights.length === 0) parts = [<span key={message}>{message}</span>];
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
          onNormalMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
        endIndex = highlight.end;
        // Highlighted part
        parts.push(
          onHighlightMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
      }
      parts.push(onNormalMessagePart(message.substring(endIndex)));
    }
    return parts;
  };

  const generateMobileStatsRow = (
    rowID: number,
    title: string,
    content: React.ReactElement
  ) => {
    return (
      <div key={`${title}-${rowID}`} className='px-3 py-1 leading-snug'>
        <span key={uniqueId()} className='font-extrabold text-primary'>
          {title}:{' '}
        </span>
        {content}
      </div>
    );
  };

  const generateConversation = (score: IDisplayScore): React.ReactElement => {
    return (
      <div className='w-full flex flex-col gap-4 bg-secondary text-secondary-foreground p-4'>
        {score.conversation.map((chat, idx) => (
          <p
            key={`chat-bubble-${idx}`}
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
              generateHighlightedMessage(chat.content, score.responseHighlights)
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
        content: <span>{getCalculatedScore(score).toString()}</span>,
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
        content: (
          <span>{`${(score.ai_score ?? 50).toString()} x ${
            (promptMultiplier ?? 0) * 100
          }% = ${_.round(
            (score.ai_score ?? 50) * (promptMultiplier ?? 0),
            1
          )}`}</span>
        ),
      },
      {
        title: 'AI Explanation',
        content: (
          <span>{score.ai_explanation ?? CONSTANTS.errors.aiJudgeFail}</span>
        ),
      },
    ];
  };

  const generateMobileScoreStack = () => {
    if (!scores || scores.length < CONSTANTS.numberOfQuestionsPerGame)
      return <></>;
    return scores.map((score) => (
      <AccordionItem
        key={`word-${score.id}`}
        value={`word-${score.id}`}
        className='pb-1'
      >
        <AccordionTrigger>
          <div className='w-full text-primary flex flex-row gap-2 items-center justify-between'>
            <div className='flex flex-row flex-grow items-center gap-2 justify-between'>
              <span className='text-left' key={uniqueId()}>
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
              <span className='font-extrabold leading-snug' key={uniqueId()}>
                {getCalculatedScore(score)}/{100}
              </span>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className='bg-secondary rounded-lg'>
          {generateConversation(score)}
          {generateStatsItems(score).map((item) => {
            return generateMobileStatsRow(score.id, item.title, item.content);
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
            total={total}
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

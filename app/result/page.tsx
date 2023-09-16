'use client';

import copy from 'clipboard-copy';
import { useState, useEffect, useRef, useCallback } from 'react';
import ILevel from '../../lib/types/level.interface';
import { IAIScore, IDisplayScore } from '../../lib/types/score.interface';
import html2canvas from 'html2canvas';
import _, { uniqueId } from 'lodash';
import { IHighlight } from '../../lib/types/highlight.interface';
import { useRouter } from 'next/navigation';
import LoadingMask from '../../components/custom/loading-mask';
import { CONSTANTS } from '../../lib/constants';
import moment from 'moment';
import { askAIForJudgingScore } from '../../lib/services/aiService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleOff, Hand, MousePointerClick, Share } from 'lucide-react';
import { ScoreInfoButton } from '@/components/custom/score-info-button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { HASH } from '@/lib/hash';
import { isMobile } from 'react-device-detect';
import { useAuth } from '@/components/auth-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TopicReviewSheet } from '@/components/custom/topic-review-sheet';
import { isLevelExists } from '@/lib/services/levelService';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import { Spinner } from '@/components/custom/spinner';
import ShareScoreDialog from '@/components/custom/share-score-dialog';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

interface StatItem {
  title: string;
  content: string;
  highlights?: IHighlight[];
}

interface ResultPageProps {}

export default function ResultPage(props: ResultPageProps) {
  const { user, status } = useAuth();
  const [total, setTotal] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [expandedValues, setExpandedValues] = useState<string[]>(['word-1']);
  const [contributionDialogOpen, setContributionDialogOpen] = useState(false);
  const [isTopicReviewSheetOpen, setIsTopicReviewSheetOpen] = useState(false);
  const [hasTopicSubmitted, setHasTopicSubmitted] = useState(false);
  const [hasScoresLoaded, setHasScoresLoaded] = useState(false);
  const { item: level } = useLocalStorage<ILevel>(HASH.level);
  const {
    item: scores,
    setItem: setScores,
    clearItem: clearScores,
    loading: isFetchingCachedScores,
  } = useLocalStorage<IDisplayScore[]>(HASH.scores);
  const screenshotRef = useRef<HTMLTableElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();

  const getCompletionSeconds = (completion: number): number => {
    return completion <= 0 ? 1 : completion;
  };

  const checkIfEligibleForLevelSubmission = useCallback(async () => {
    if (level) {
      const exists = await isLevelExists(level.name, user?.email);
      setHasTopicSubmitted(exists);
      if (exists) {
        toast({ title: 'You have already submitted this topic.' });
        return;
      }
      if (level.isAIGenerated && status === 'authenticated') {
        setContributionDialogOpen(true);
      }
    }
  }, [level, user, status]);

  useEffect(() => {
    if (!hasScoresLoaded && scores !== undefined) {
      setHasScoresLoaded(true);
      checkUserStatus();
    }
  }, [scores]);

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
      const copyScores = [...scores];
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
      clearScores();
      updateDisplayedScores(copyScores);
    }
  };

  const updateDisplayedScores = (displayScores: IDisplayScore[]) => {
    let total = 0;
    let totalScore = 0;
    for (const score of displayScores) {
      total += getCompletionSeconds(score.completion);
      totalScore += calculateScore(score);
    }
    totalScore = _.round(totalScore, 1);
    displayScores.sort((scoreA, scoreB) => scoreA.id - scoreB.id);
    setTotal(total);
    setTotalScore(totalScore);
    setScores(displayScores);
  };

  const handleContributeAITopic = () => {
    setIsTopicReviewSheetOpen(true);
  };

  const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const generateShareText = (): string => {
    const parts: string[] = [];
    if (totalScore > 0) {
      parts.push(
        `I scored a total of ${totalScore} in https://taboo-ai.vercel.app/ !`
      );
    }
    const topic = generateTopicName();
    if (topic) {
      parts.push(`The topic of this game is: ${topic}.`);
    }
    if (level?.difficulty) {
      const difficultyString = getDifficulty(level?.difficulty);
      parts.push(`The difficulty level of this game is: ${difficultyString}.`);
    }
    if (parts.length > 0) {
      parts.push(
        `Join me to explore different topics and have fun playing the game of Taboo against AI!`
      );
    } else {
      parts.push(
        `I completed a round of game in https://taboo-ai.vercel.app/ ! Join me to explore different topics and have fun playing the game of Taboo against AI!`
      );
    }
    return parts.join(' ');
  };

  const sharePlainText = () => {
    const text = generateShareText();
    performNavigatorShare(text);
  };

  const shareScreenshot = () => {
    if (screenshotRef.current) {
      html2canvas(screenshotRef.current, {
        scale: 2,
        backgroundColor: resolvedTheme === 'light' ? '#ffffff' : '#000000',
        height: screenshotRef.current.scrollHeight,
      }).then((canvas) => {
        const text = generateShareText();
        const href = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        const downloadName = `taboo-ai-scores-${moment().format(
          'DDMMYYYYHHmmss'
        )}.png`;
        performNavigatorShare(text, href, downloadName);
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
            console.log('Error sharing:', error);
            link.click();
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
          .catch(console.error);
      }
      copy(title)
        .then(() => {
          toast({
            title: 'Sharing content has been copied to clipboard!',
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            title:
              'Sorry, we are unable to generate the sharing content at the moment. Please try again later.',
            variant: 'destructive',
          });
        });
    }
  };

  const getDifficulty = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
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
    content: string
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

  const getDifficultyMultipliers = (
    difficulty: number
  ): { timeMultipler: number; promptMultiplier: number } => {
    switch (difficulty) {
      case 1:
        return { timeMultipler: 0.4, promptMultiplier: 0.6 };
      case 2:
        return { timeMultipler: 0.3, promptMultiplier: 0.7 };
      case 3:
        return { timeMultipler: 0.2, promptMultiplier: 0.8 };
      default:
        return { timeMultipler: 0.5, promptMultiplier: 0.5 };
    }
  };

  const calculateScore = (score: IDisplayScore): number => {
    const difficulty = score.difficulty;
    const multipliers = getDifficultyMultipliers(difficulty);
    const timeScore = calculateTimeScore(score) * multipliers.timeMultipler;
    const aiScore = (score.ai_score ?? 50) * multipliers.promptMultiplier;
    return _.round(timeScore + aiScore, 1);
  };

  const calculateTimeScore = (score: IDisplayScore): number => {
    const scoreCompletionSeconds = getCompletionSeconds(score.completion);
    return Math.max(Math.min(100 - scoreCompletionSeconds, 100), 0);
  };

  const generateTopicName = (): string => {
    const topicName = _.startCase(level?.name) ?? 'Unknown';
    return topicName;
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
        title: 'Total Time Taken',
        content: `${getCompletionSeconds(score.completion)} seconds`,
      },
      {
        title: 'Total Score',
        content: calculateScore(score).toString(),
      },
      {
        title: `Time Score (${(timeMultipler ?? 0) * 100}%)`,
        content: `${calculateTimeScore(
          score
        ).toString()} x ${timeMultipler} = ${_.round(
          calculateTimeScore(score) * (timeMultipler ?? 0),
          1
        )}`,
      },
      {
        title: `Clue Score (${(promptMultiplier ?? 0) * 100}%)`,
        content: `${(
          score.ai_score ?? 50
        ).toString()} x ${promptMultiplier} = ${_.round(
          (score.ai_score ?? 50) * (promptMultiplier ?? 0),
          1
        )}`,
      },
      {
        title: 'AI Explanation',
        content: score.ai_explanation ?? CONSTANTS.errors.aiJudgeFail,
      },
    ];
  };

  const generateMobileScoreStack = () => {
    if (!scores) return <></>;
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
              <ScoreInfoButton />
              <span className='font-extrabold leading-snug' key={uniqueId()}>
                Score: {calculateScore(score)}
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
    return (
      <div className='w-full flex flex-col gap-6 mb-8 mt-20 px-4'>
        <Alert className='shadow-lg text-xl'>
          <AlertTitle className='flex flex-row gap-2 items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-ligature'
            >
              <path d='M8 20V8c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2' />
              <path d='M6 12h4' />
              <path d='M14 12h2v8' />
              <path d='M6 20h4' />
              <path d='M14 20h4' />
            </svg>
            Topic: {generateTopicName()}
          </AlertTitle>
          <AlertDescription className='mt-4 text-lg'>
            <div className='flex flex-row justify-between'>
              <span>Total Score:</span>
              <div className='flex flex-row items-center'>
                <ScoreInfoButton />
                <span className='font-bold'>{_.round(totalScore, 1)}</span>
              </div>
            </div>
            <div className='flex flex-row justify-between'>
              <span>Difficulty:</span>
              <span className='font-bold'>
                {level?.difficulty ?? 1}{' '}
                <span>({getDifficulty(level?.difficulty ?? 1)})</span>
              </span>
            </div>
            <div className='flex flex-row justify-between'>
              <span>Total Time Taken: </span>
              <span className='font-bold'>{total} seconds</span>
            </div>
          </AlertDescription>
        </Alert>
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
    );
  };

  if (!scores || scores.length <= 0) {
    return (
      <>
        <div className='w-full h-full flex flex-col gap-2 justify-center items-center text-center'>
          {isFetchingCachedScores ? (
            <>
              <Spinner size={50} />
              <h1>Searching for cached result...</h1>
            </>
          ) : (
            <>
              <CircleOff size={56} className='animate-pulse' />
              <h1>You have no cached result for display</h1>
              <Button
                onClick={() => {
                  router.push('/levels');
                }}
              >
                Browse Topics
              </Button>
            </>
          )}
        </div>
      </>
    );
  }

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
                EventManager.fireEvent(CustomEventKey.LOGIN_REMINDER, {
                  title: 'You need to login to contribute a topic to us.',
                });
              } else {
                setIsTopicReviewSheetOpen(true);
              }
            }}
          >
            Submit This Topic To Us
          </Button>
        )}
        {level && (
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
      <AlertDialog
        open={contributionDialogOpen}
        onOpenChange={(open) => {
          setContributionDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Enjoy the game so far? Would you like to contribute this
              AI-generated topic to us?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setContributionDialogOpen(false);
                setIsTopicReviewSheetOpen(false);
              }}
            >
              I&apos;ll decide later
            </AlertDialogCancel>
            <AlertDialogAction autoFocus onClick={handleContributeAITopic}>
              Sure why not
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ShareScoreDialog
        onSharePlainText={sharePlainText}
        onShareScreenshot={shareScreenshot}
      />
    </>
  );
}

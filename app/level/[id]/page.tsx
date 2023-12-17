'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import _, { uniqueId } from 'lodash';
import { SendHorizonal, X } from 'lucide-react';
import { useTimer } from 'use-timer';

import { useAuth } from '@/components/auth-provider';
import { Skeleton } from '@/components/custom/skeleton';
import Timer from '@/components/custom/timer';
import IconButton from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { CONSTANTS } from '@/lib/constants';
import { getHash, HASH } from '@/lib/hash';
import { getPersistence, setPersistence } from '@/lib/persistence/persistence';
import { askAITabooWordsForTarget, fetchConversationCompletion } from '@/lib/services/aiService';
import { getLevel, incrementLevelPopularity } from '@/lib/services/levelService';
import { incrementGameAttemptedCount } from '@/lib/services/userService';
import { getTabooWords } from '@/lib/services/wordService';
import IGame from '@/lib/types/game.type';
import { IHighlight } from '@/lib/types/highlight.type';
import ILevel from '@/lib/types/level.type';
import { IChat, IScore } from '@/lib/types/score.type';
import IWord from '@/lib/types/word.type';
import { formatStringForDisplay, getMockResponse, getMockVariations } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getDevMode, isDevMode } from '@/lib/utils/devUtils';
import { aggregateTotalScore, aggregateTotalTimeTaken } from '@/lib/utils/gameUtils';
import { generateHighlights, getMatchedTabooWords } from '@/lib/utils/levelUtils';

interface LevelPageProps {
  params: { id: string };
}

// If is AI level, then it is true
let isCustomGame = false;

// The words for this topic
let words: string[] = [];

export default function LevelPage({ params: { id } }: LevelPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const retryCount = useRef<number>(5);
  const inputTextField = useRef<HTMLInputElement>(null);
  const hasIncrementedGameAttemptedCount = useRef<boolean>(false);

  const [isWaitingForAIResponse, setIsWaitingForAIResponse] = useState(false);
  const [level, setLevel] = useState<ILevel | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [target, setTarget] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCountingdown, setIsCountdown] = useState<boolean>(false);
  const [conversation, setConversation] = useState<IChat[]>([]);
  const [savedScores, setSavedScores] = useState<IScore[]>([]);
  const [isFetchingLevel, setIsFetchingLevel] = useState(false);

  const {
    time,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
    status: timerStatus,
  } = useTimer({
    initialTime: 0,
    timerType: 'INCREMENTAL',
  });
  const countdown = useTimer({
    initialTime: 3,
    endTime: -1,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      setIsCountdown(false);
      startTimer();
    },
  });

  // When timer starts running, we focus on the textfield input
  useEffect(() => {
    if (timerStatus === 'RUNNING') {
      inputTextField.current?.focus();
    }
  }, [timerStatus]);

  // When user is authenticated, we increment the game attempted count
  useEffect(() => {
    if (!hasIncrementedGameAttemptedCount.current && user && id !== 'ai') {
      hasIncrementedGameAttemptedCount.current = true;
      incrementGameAttemptedCount(user.email);
    }
  }, [user]);

  const isEmptyInput = userInput.length <= 0;

  const fetchLevel = async (id: string) => {
    if (level) return;
    setIsFetchingLevel(true);
    const fetchedLevel = await getLevel(id);
    if (fetchedLevel) {
      setLevel(fetchedLevel);
      incrementLevelPopularity(fetchedLevel.id);
      setPersistence(HASH.level, fetchedLevel);
      startGame(fetchedLevel);
    }
  };

  useEffect(() => {
    if (id === 'ai') {
      isCustomGame = true;
      const cachedLevel = getPersistence<ILevel>(HASH.level);
      setLevel(cachedLevel);
      if (cachedLevel) {
        startGame(cachedLevel);
      } else {
        toast({ title: 'Sorry we cannot find the topic to start the game. ' });
        router.back();
      }
    } else if (!isFetchingLevel) {
      isCustomGame = false;
      fetchLevel(id);
    }
  }, [id, isFetchingLevel]);

  const startGame = (level: ILevel) => {
    resetTimer();
    // removePersistence(HASH.game);
    words = level.words.map((word) => formatStringForDisplay(word));
    const newTarget = generateNewTarget();
    setTarget(newTarget);
    setCurrentProgress(1);
  };

  const generateNewTarget = (): string => {
    if (words.length <= 0) {
      toast({
        title:
          'Sorry something went wrong suddenly! We apologize for the inconvenience. Please try play the topic again.',
        variant: 'destructive',
      });
      router.back();
    }
    const newTarget = words[Math.floor(Math.random() * words.length)];
    // Remove from words so that it doesn't get picked again
    _.remove(words, (word) => word === newTarget);
    return newTarget;
  };

  const renderWaitingMessageForVariations = () => {
    switch (retryCount.current) {
      case 5:
        return 'Finding relevant taboo words...';
      case 4:
        return 'Still finding relevant taboo words...';
      case 3:
        return 'Experiencing high traffic, trying my best to find relevant taboo words...';
      case 2:
      case 1:
        return 'Trying even harder to find relevant taboo words...';
      case 0:
      default:
        return "Sorry, I can't seem to find any other relevant taboo words >_<!";
    }
  };

  const onUserSubmitInput = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userInputMatchedTabooWords.length > 0) return;
    // Get the submitted value
    const userInput = event.currentTarget['user-input'].value as string;
    // Immediately show user input in UI.
    // Remove any message that has role == 'error' and also its previous message if it has role == 'user'.
    const updatedConversation: IChat[] = [];
    for (let i = 0; i < conversation.length; i++) {
      const current = conversation[i];
      if (current.role === 'user' || current.role === 'assistant') {
        updatedConversation.push(current);
      } else if (current.role === 'error') {
        if (i - 1 >= 0 && conversation[i - 1].role === 'user') {
          updatedConversation.pop();
        }
      }
    }
    updatedConversation.push(
      { role: 'user', content: userInput },
      { role: 'assistant', content: '' }
    );
    setConversation(updatedConversation);
    setUserInput('');
    // Pause timer, set loading true
    setIsWaitingForAIResponse(true);
    pauseTimer();
    setIsLoading(true);

    // If in dev mode, we skip API call and use mock response
    if (isDevMode()) {
      const mockConversation = [...updatedConversation];
      mockConversation.pop();
      try {
        const mockResponse = await getMockResponse(target ?? '', getDevMode());
        setConversation([...mockConversation, { role: 'assistant', content: mockResponse ?? '' }]);
      } catch {
        setConversation([
          ...mockConversation,
          { role: 'error', content: CONSTANTS.errors.overloaded },
        ]);
      } finally {
        setIsWaitingForAIResponse(false);
        setIsLoading(false);
        startTimer();
      }
      return;
    }

    // Remove the last message from conversation if it is from assistant and does not have any content
    const inputConversation: IChat[] = [...updatedConversation];
    if (
      inputConversation[inputConversation.length - 1].role === 'assistant' &&
      inputConversation[inputConversation.length - 1].content.length <= 0
    ) {
      inputConversation.pop();
    }
    // If input valid, proceed to submit to continue conversation
    if (userInputMatchedTabooWords.length <= 0 && userInput.length > 0) {
      try {
        const { conversation: newConversation } =
          await fetchConversationCompletion(inputConversation);

        setConversation(newConversation);
      } catch (error) {
        console.error(error);
        setConversation([
          ...inputConversation,
          { role: 'error', content: CONSTANTS.errors.overloaded },
        ]);
      } finally {
        setIsWaitingForAIResponse(false);
        setIsLoading(false);
        startTimer();
      }
    }
  };

  // Scroll the DOM chat to always show the latest message
  useEffect(() => {
    document.getElementById('chat-end')?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Move on to next question, save the scores to cache. Delay and set the current progress to next one
  const nextQuestion = async (highlights: IHighlight[]) => {
    pauseTimer();
    const copySavedScores = [...savedScores];
    copySavedScores.push({
      id: currentProgress,
      target: target ?? '',
      taboos: variations,
      conversation: conversation,
      completion: time,
      responseHighlights: highlights,
    });
    setSavedScores(copySavedScores);
    currentProgress === CONSTANTS.numberOfQuestionsPerGame &&
      toast({
        title: 'Game Over! Generating Results...',
      });
    setTimeout(() => {
      setCurrentProgress((progress) => progress + 1);
    }, 5000);
  };

  // If last message from conversation is from assistant, we generate highlights for it. And move on to next question
  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1].role === 'assistant') {
      const lastAssistantMessage = conversation[conversation.length - 1];
      const highlights = generateHighlights(target, lastAssistantMessage.content, true);
      if (highlights.length > 0) {
        toast({ title: "That's a hit! Well done!", duration: 1000 });
        nextQuestion(highlights);
      }
    }
  }, [conversation]);

  const generateVariationsForTarget = async (
    retries: number,
    target: string,
    callback: (variations?: IWord) => void
  ) => {
    retryCount.current = retries;
    try {
      if (isDevMode()) {
        const variations = await getMockVariations(target, true);
        callback(variations);
      } else {
        const taboo = await getTabooWords(target);
        if (taboo && taboo.taboos.length > 1 && taboo.isVerified) {
          callback(taboo);
        } else {
          const variations = await askAITabooWordsForTarget(target);
          callback(variations);
        }
      }
    } catch {
      if (retries > 0) {
        generateVariationsForTarget(retries - 1, target, callback);
      } else {
        callback();
      }
    }
  };

  // When target changed, we generate new targets and clear the conversation
  useEffect(() => {
    if (target) {
      setVariations([target]);
      setConversation([]);
      setIsGeneratingVariations(true);
      generateVariationsForTarget(5, target, (variations) => {
        setTimeout(() => {
          setIsGeneratingVariations(false);
          let _variations = [target];
          if (variations && _.toLower(variations.target) === _.toLower(target)) {
            _variations = variations.taboos;
          }
          setVariations(_variations.map(formatStringForDisplay));
          countdown.start();
          setIsCountdown(true);
        }, 2000);
      });
    }
  }, [target]);

  // When progress changed
  useEffect(() => {
    const isLastRound = currentProgress === CONSTANTS.numberOfQuestionsPerGame + 1;
    if (isLastRound) {
      // Game Finsihed. Save game to cache
      const completedAt = new Date();
      const game: IGame = {
        id: getHash(`${user?.email ?? 'guest'}-${level?.id}-${completedAt.toISOString()}`),
        levelId: level?.id ?? '',
        totalScore: aggregateTotalScore(savedScores, level?.difficulty ?? 1),
        totalDuration: aggregateTotalTimeTaken(savedScores),
        difficulty: level?.difficulty ?? 1,
        finishedAt: completedAt,
        scores: savedScores,
        isCustomGame: isCustomGame,
      };
      setPersistence(HASH.game, game);
      router.push('/result');
    } else if (currentProgress === 1) {
      return;
    } else {
      const newTarget = generateNewTarget();
      setTarget(newTarget);
      setVariations([newTarget]);
      setUserInput('');
    }
  }, [currentProgress]);

  // Timer control
  useEffect(() => {
    if (isCountingdown) {
      resetTimer();
    }
  }, [isCountingdown]);

  // user input validated against taboo words.
  const matchers = target == null ? variations : [...variations, target];
  const userInputMatchedTabooWords = getMatchedTabooWords(userInput, matchers);
  const userInputError =
    userInputMatchedTabooWords.length > 0
      ? `Uh-oh, you hit taboo words: ${userInputMatchedTabooWords.join(', ')}`
      : undefined;

  const renderHighlightedMessageBubble = (message: string): JSX.Element[] => {
    const renderNormalMessageSpan = (message: string) => {
      return <span key={uniqueId(message)}>{message}</span>;
    };
    const renderHighlightMessageSpan = (message: string) => {
      return (
        <span key={uniqueId(message)} className='rounded-lg bg-green-400 px-1 py-1 text-black'>
          {message}
        </span>
      );
    };
    let parts = [];
    const highlights = generateHighlights(target, message, true);
    if (highlights.length === 0) {
      // No highlights found, just return message in normal style
      parts = [<span key={message}>{message}</span>];
    } else {
      // Highlights found, generate higlights for message matches
      let startIndex = 0;
      let endIndex = 0;
      for (const highlight of highlights) {
        endIndex = highlight.start;
        while (/[\W_]/g.test(message[endIndex])) {
          endIndex++;
        }
        // Normal part
        parts.push(renderNormalMessageSpan(message.substring(startIndex, endIndex)));
        startIndex = endIndex;
        endIndex = highlight.end;
        // Highlighted part
        parts.push(renderHighlightMessageSpan(message.substring(startIndex, endIndex)));
        startIndex = endIndex;
      }
      parts.push(renderNormalMessageSpan(message.substring(endIndex)));
    }
    return parts;
  };

  if (!level) {
    return (
      <section className='flex h-full justify-center px-4 pt-20'>
        <h1 className='fixed top-3 z-20 flex w-full justify-center'>
          <div className='w-fit rounded-lg px-3 py-1 shadow-lg'>Taboo AI</div>
        </h1>
        <Skeleton numberOfRows={10} />
      </section>
    );
  }

  return (
    <main className='flex h-full justify-center'>
      {isCountingdown ? (
        <div
          className={cn(
            'fixed top-1/2 z-50 w-full animate-bounce text-center',
            countdown.time === 0
              ? 'text-6xl'
              : countdown.time === 1
                ? 'text-5xl'
                : countdown.time === 2
                  ? 'text-4xl'
                  : countdown.time === 3
                    ? 'text-3xl'
                    : 'text-2xl'
          )}
        >
          {countdown.time === 0 ? 'Start' : countdown.time === -1 ? '' : countdown.time}
        </div>
      ) : isGeneratingVariations ? (
        <div className='fixed top-1/2 z-50 w-full animate-bounce text-center text-3xl'>
          {renderWaitingMessageForVariations()}
        </div>
      ) : (
        <></>
      )}
      <Timer className='fixed right-3 top-3 z-50 shadow-lg' time={time} status={timerStatus} />
      <section className='flex h-full w-full flex-col gap-4 pt-20 text-center'>
        <div className='flex w-full flex-grow flex-col gap-4 overflow-y-scroll px-4 pb-4 scrollbar-hide'>
          {conversation.map((prompt, idx) => (
            <p
              key={idx}
              className={cn(prompt.role === 'user' ? 'chat-bubble-right' : 'chat-bubble-left')}
            >
              {prompt.role === 'assistant' && idx === conversation.length - 1 ? (
                isWaitingForAIResponse ? (
                  <span className='flex flex-row items-center gap-1'>
                    {'...'.split('').map((c, i) =>
                      i === 0 ? (
                        <span
                          key={`ai-prompt-character-${i}`}
                          className={`animate-small-bounce-delay-1-loop`}
                        >
                          {c}
                        </span>
                      ) : i === 1 ? (
                        <span
                          key={`ai-prompt-character-${i}`}
                          className={`animate-small-bounce-delay-2-loop`}
                        >
                          {c}
                        </span>
                      ) : i === 2 ? (
                        <span
                          key={`ai-prompt-character-${i}`}
                          className={`animate-small-bounce-delay-3-loop`}
                        >
                          {c}
                        </span>
                      ) : (
                        ''
                      )
                    )}
                  </span>
                ) : (
                  renderHighlightedMessageBubble(prompt.content)
                )
              ) : prompt.role === 'error' ? (
                <span className='text-slate-400'>{prompt.content}</span>
              ) : (
                `${prompt.content}`
              )}
            </p>
          ))}
          <div id='chat-end'></div>
        </div>

        <section className='flex w-full flex-col border-t-[1px] border-t-border bg-card text-card-foreground transition-colors'>
          <Progress
            className='h-1 rounded-none'
            value={(currentProgress / CONSTANTS.numberOfQuestionsPerGame) * 100}
          />
          <div className='relative mb-4 flex flex-col items-center gap-2 px-4 pt-4 text-card-foreground'>
            <span className='text-base font-light'>Make AI Say:</span>
            <span className='rounded-lg bg-card-foreground px-2 py-1 text-xl font-bold text-card'>
              {target}
            </span>
          </div>
          <form onSubmit={onUserSubmitInput} className='flex flex-col gap-2'>
            <div className='relative flex items-center justify-center gap-4 px-4'>
              <IconButton
                id='clear'
                type='button'
                tooltip='Clear input'
                aria-label='Clear input button'
                asChild
                disabled={!level || isLoading || isCountingdown || isGeneratingVariations}
                className='absolute right-20 z-10 !h-[20px] !w-[20px] rounded-full shadow-lg'
                onClick={() => {
                  setUserInput('');
                  inputTextField.current?.focus();
                }}
              >
                <X size={12} />
              </IconButton>
              <Input
                id='user-input'
                disabled={timerStatus !== 'RUNNING'}
                ref={inputTextField}
                autoFocus
                placeholder={
                  isGeneratingVariations
                    ? 'Generating taboo words...'
                    : isCountingdown
                      ? 'Ready to ask questions?'
                      : 'Enter your prompt...'
                }
                className={cn(
                  'flex-grow pr-10',
                  userInputMatchedTabooWords.length > 0
                    ? 'bg-red-500 text-primary-foreground'
                    : 'text-primary'
                )}
                type='text'
                value={userInput}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setUserInput(event.target.value);
                }}
                maxLength={150}
              />
              <IconButton
                id='submit'
                data-style='none'
                tooltip='Submit'
                disabled={
                  !level ||
                  isGeneratingVariations ||
                  isCountingdown ||
                  isEmptyInput ||
                  userInputMatchedTabooWords.length > 0 ||
                  isLoading
                }
                type='submit'
                className='aspect-square'
                aria-label='submit button'
              >
                <SendHorizonal />
              </IconButton>
            </div>
            {userInputError && (
              <Label
                htmlFor='user-input'
                className='animate-fade-in px-4 leading-snug text-red-400'
              >
                {userInputError}
              </Label>
            )}
          </form>
          <div className='mt-4 w-full overflow-x-auto whitespace-nowrap px-4 pb-8 text-base'>
            <span>
              <span className='font-light italic'>Taboos: </span>
              <span className='text-red-400'>{variations.map(_.startCase).join(', ')}</span>{' '}
              {isGeneratingVariations && (
                <span className=''>({renderWaitingMessageForVariations()})</span>
              )}
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}

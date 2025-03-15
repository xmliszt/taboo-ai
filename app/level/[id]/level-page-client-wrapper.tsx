'use client';

// TODO: This component is too large to be a client component. Refactor to break it down.
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import _, { cloneDeep, toLower, uniqueId } from 'lodash';
import { Loader2, MessageCircleOff, SendHorizonal, X } from 'lucide-react';
import { toast } from 'sonner';
import { AsyncReturnType } from 'type-fest';
import { useTimer } from 'use-timer';

import { AiEvaluationLoadingProgressBar } from '@/app/level/[id]/ai-evaluation-loading-progress-bar';
import { Level } from '@/app/level/[id]/server/fetch-level';
import { generateConversationFromAI } from '@/app/level/[id]/server/generate-conversation-from-ai';
import { generateEvaluationFromAI } from '@/app/level/[id]/server/generate-evaluation-from-ai';
import { generateTabooWordsFromAI } from '@/app/level/[id]/server/generate-taboo-words-from-ai';
import {
  LevelToUpload,
  ScoreToUpload,
  uploadCompletedGameForUser,
} from '@/app/level/[id]/server/upload-game';
import { useAuth } from '@/components/auth-provider';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import Timer from '@/components/custom/timer';
import IconButton from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CONSTANTS } from '@/lib/constants';
import { HASH } from '@/lib/hash';
import { getPersistence, setPersistence } from '@/lib/persistence/persistence';
import { fetchWord } from '@/lib/services/wordService';
import {
  formatStringForDisplay,
  generateHashedString,
  getMockResponse,
  getMockVariations,
} from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getDevMode, isDevMode } from '@/lib/utils/devUtils';
import { generateHighlights, getMatchedTabooWords } from '@/lib/utils/levelUtils';
import { AnimatePresence, motion } from 'framer-motion';

type LevelWordsProviderProps = {
  level?: Level;
  fromAIMode?: boolean;
  words: string[];
};

// Words stored in cache
let cacheWords: string[] = [];

// Words played
let wordsPlayed: string[] = [];

// Level stored in cache - only for AI mode
let cacheLevel: LevelToUpload | null = null;

// Scores evaluated
let scoresEvaluated: ScoreToUpload['score_index'][] = [];

// Scores stored in cache
let savedScores: ScoreToUpload[] = [];

// Game started at
let gameStartedAt: Date = new Date();

// Game ended at
let gameEndedAt: Date = new Date();

// Delay between each stage
const DELAY_BETWEEN_STAGE = 3000;

export function LevelPageClientWrapper(props: LevelWordsProviderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const retryCount = useRef<number>(5);
  const inputTextField = useRef<HTMLInputElement>(null);
  const [isWaitingForAIResponse, setIsWaitingForAIResponse] = useState(false);
  const [userInput, setUserInput] = useState<string>('');
  const [target, setTarget] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCountingDown, setIsCountdown] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ScoreToUpload['conversations']>([]);
  const [isPending, startTransition] = useTransition();
  const [currentEvaluationProgress, setCurrentEvaluationProgress] = useState(0);

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

  // start the new game with provided words
  const startGame = (words: string[]) => {
    cacheWords = words;
    wordsPlayed = [];
    resetTimer();
    setTarget(generateNewTarget(words));
    setCurrentProgress(1);
    gameStartedAt = new Date();
    gameEndedAt = new Date();
    savedScores = [];
    scoresEvaluated = [];
    setCurrentEvaluationProgress(0);
  };

  const generateNewTarget = (words: string[]) => {
    // filter out those played
    const filteredWords = [...words].filter((w) => !wordsPlayed.includes(w));
    const newTarget = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    wordsPlayed.push(newTarget);
    return newTarget;
  };

  // start the game
  useEffect(() => {
    if (props.fromAIMode) {
      cacheLevel = getPersistence<LevelToUpload>(HASH.level);
      if (cacheLevel) {
        confirmAlert({
          title: 'You are playing an AI generated topic',
          description:
            'Please note that this game will not be saved to your profile as it is a custom game. If you would like to save your game, please contribute this topic to us. Once this topic is verified, you can then play it and your game will be saved to your profile.',
          cancelLabel: 'OK',
          hasConfirmButton: false,
          onCancel: () => {
            cacheLevel && startGame(cacheLevel.words);
          },
        });
      } else {
        toast.error('Sorry we cannot find the topic to start the game.');
        router.back();
      }
    } else {
      startGame(props.words);
    }
  }, [props.words, props.fromAIMode]);

  // When the timer starts running, we focus on the text field input
  useEffect(() => {
    if (timerStatus === 'RUNNING') {
      inputTextField.current?.focus();
    }
  }, [timerStatus]);

  const isEmptyInput = userInput.trim().length <= 0;

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
    // Format input trim spaces
    const formattedInput = userInput.trim();
    if (formattedInput.length <= 0) return;
    // Immediately show user input in the UI.
    // Remove any message that has role == 'error' and also its previous message if it has role == 'user'.
    const updatedConversation: ScoreToUpload['conversations'] = [];
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
      { role: 'user', content: userInput, timestamp: new Date().toISOString() },
      { role: 'assistant', content: '', timestamp: new Date().toISOString() }
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
        setConversation([
          ...mockConversation,
          {
            role: 'assistant',
            content: mockResponse ?? '',
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        setConversation([
          ...mockConversation,
          {
            role: 'error',
            content: CONSTANTS.errors.overloaded,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsWaitingForAIResponse(false);
        setIsLoading(false);
        startTimer();
      }
      return;
    }

    // Remove the last message from conversation if it is from assistant and does not have any content
    const inputConversation = [...updatedConversation];
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
          await generateConversationFromAI(inputConversation);
        setConversation(newConversation);
      } catch (error) {
        console.error(error);
        setConversation([
          ...inputConversation,
          {
            role: 'error',
            content:
              "Oops! I encountered a technical issue and I'm unable to continue the conversation right now. Please try again later!",
            timestamp: new Date().toISOString(),
          },
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

  // Move on to the next question, save the scores to cache. Delay and set the current progress to the next one
  const nextQuestion = async (highlights: ScoreToUpload['highlights']) => {
    pauseTimer();
    if (savedScores.find((score) => score.score_index === currentProgress)) return;
    if (target == null) return;
    savedScores.push({
      score_index: currentProgress,
      target_word: toLower(target),
      taboo_words: cloneDeep(variations).map(toLower),
      conversations: cloneDeep(conversation),
      duration: time,
      highlights: highlights,
      ai_evaluation: {
        ai_score: 0,
        ai_explanation: '',
        ai_suggestion: null,
      },
    });
    setTimeout(() => {
      setCurrentProgress((progress) => progress + 1);
    }, DELAY_BETWEEN_STAGE);
  };

  // If the last message from conversation is from assistant, we generate highlights for it. And move on to the next question
  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1].role === 'assistant') {
      const lastAssistantMessage = conversation[conversation.length - 1];
      const highlights = generateHighlights(target, lastAssistantMessage.content, true);
      if (highlights.length > 0) {
        // Pick one random congratulatory message
        toast(
          LIST_OF_CONGRATULATORY_MESSAGES[
            Math.floor(Math.random() * LIST_OF_CONGRATULATORY_MESSAGES.length)
          ],
          {
            duration: 1500,
          }
        );
        void nextQuestion(highlights);
      }
    }
  }, [conversation]);

  const generateVariationsForTarget = async (
    retries: number,
    target: string,
    topic: string | undefined,
    callback: (variations?: AsyncReturnType<typeof fetchWord>) => void
  ) => {
    retryCount.current = retries;
    try {
      if (isDevMode()) {
        const variations = await getMockVariations(target, true);
        callback(variations);
      } else {
        const taboo = await fetchWord(target);
        if (taboo && taboo.taboos.length > 1 && taboo.is_verified) {
          callback(taboo);
        } else {
          const variations = await generateTabooWordsFromAI(target, topic);
          callback(variations);
        }
      }
    } catch {
      if (retries > 0) {
        await generateVariationsForTarget(retries - 1, target, topic, callback);
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
      void generateVariationsForTarget(
        5,
        target,
        props.level?.name ?? cacheLevel?.name,
        (variations) => {
          setTimeout(() => {
            setIsGeneratingVariations(false);
            let _variations = [target];
            if (variations && _.toLower(variations.word) === _.toLower(target)) {
              _variations = variations.taboos;
            }
            setVariations(_variations.map(formatStringForDisplay));
            countdown.start();
            setIsCountdown(true);
          }, 2000);
        }
      );
    }
  }, [target]);

  // When progress changed
  useEffect(() => {
    const isLastRound = currentProgress === CONSTANTS.numberOfQuestionsPerGame + 1;
    if (isLastRound) {
      // game over, time to generate AI evaluation
      gameEndedAt = new Date();
      startEvaluationAndUpload();
    } else if (currentProgress === 1) {
      return;
    } else {
      const newTarget = generateNewTarget(cacheWords);
      setTarget(newTarget);
      setVariations([newTarget]);
      setUserInput('');
    }
  }, [currentProgress]);

  // Timer control
  useEffect(() => {
    if (isCountingDown) {
      resetTimer();
    }
  }, [isCountingDown]);

  function startEvaluationAndUpload() {
    // Count how many savedScores have already been evaluated
    const alreadyEvaluatedSavedScores = savedScores.filter((score) =>
      scoresEvaluated.includes(score.score_index)
    );
    setCurrentEvaluationProgress(alreadyEvaluatedSavedScores.length);
    const remainingSavedScores = savedScores.filter(
      (score) => !scoresEvaluated.includes(score.score_index)
    );
    startTransition(async () => {
      try {
        for (let i = 0; i < remainingSavedScores.length; i++) {
          const scoreIndex = remainingSavedScores[i].score_index;
          // scoreIndex starts from 1.
          const evaluation = await generateEvaluationFromAI(savedScores[scoreIndex - 1]);
          savedScores[scoreIndex - 1].ai_evaluation.ai_score = evaluation.score;
          savedScores[scoreIndex - 1].ai_evaluation.ai_explanation = evaluation.reasoning;
          savedScores[scoreIndex - 1].ai_evaluation.ai_suggestion = evaluation.examples;
          scoresEvaluated.push(scoreIndex);
          setCurrentEvaluationProgress(alreadyEvaluatedSavedScores.length + i + 1);
        }
        // Check if in AI mode, or user is guest, if so, we direct to result page, passing savedScores & level info as URLSearchParams
        if (!props.level?.id || props.fromAIMode || !user) {
          const resultPageSearchParam = new URLSearchParams();
          const hashKey = generateHashedString(JSON.stringify(savedScores));
          setPersistence(hashKey, savedScores);
          resultPageSearchParam.set('key', hashKey);
          router.push(`/result?${resultPageSearchParam}`);
          return;
        }
        // If not in AI mode and user is logged in, we upload the scores to server, then direct to the result page
        const { gameId } = await uploadCompletedGameForUser(user.id, props.level?.id, {
          started_at: gameStartedAt.toISOString(),
          finished_at: gameEndedAt.toISOString(),
          scores: savedScores,
        });
        router.push(`/result?id=${gameId}`);
      } catch (error) {
        console.error(error);
        confirmAlert({
          title: 'Something went wrong!',
          description: 'Something went wrong during our evaluation process. Please try again.',
          cancelLabel: 'Cancel and exit',
          confirmLabel: 'Resume evaluation',
          hasConfirmButton: true,
          onCancel: () => {
            router.push('/levels');
          },
          onConfirm: startEvaluationAndUpload,
        });
      }
    });
  }

  // user input validated against taboo words.
  const matchers = target == null ? variations : [...variations, target];
  const userInputMatchedTabooWords = getMatchedTabooWords(userInput, matchers);
  const userInputError =
    userInputMatchedTabooWords.length > 0
      ? `Uh-oh, you hit taboo words: ${userInputMatchedTabooWords.join(', ')}`
      : undefined;

  const renderHighlightedMessageBubble = (message: string) => {
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
      // Highlights found, generate highlights for message matches
      let startIndex = 0;
      let endIndex = 0;
      for (const highlight of highlights) {
        endIndex = highlight.start_position;
        while (/[\W_]/g.test(message[endIndex])) {
          endIndex++;
        }
        // Normal part
        parts.push(renderNormalMessageSpan(message.substring(startIndex, endIndex)));
        startIndex = endIndex;
        endIndex = highlight.end_position;
        // Highlighted part
        parts.push(renderHighlightMessageSpan(message.substring(startIndex, endIndex)));
        startIndex = endIndex;
      }
      parts.push(renderNormalMessageSpan(message.substring(endIndex)));
    }
    return parts;
  };

  return (
    <main className='flex justify-center'>
      <Timer className='fixed right-2 top-2 z-50 shadow-sm' time={time} status={timerStatus} />
      <section className='flex h-full w-full flex-col gap-0 text-center'>
        <div className='relative flex w-full flex-grow flex-col gap-4 overflow-y-scroll px-4 py-4 scrollbar-hide'>
          <div
            className={cn(
              'fixed bottom-0 left-0 right-0 top-0 -z-10 flex h-full w-full items-center justify-center whitespace-pre-wrap text-wrap px-4 py-20 text-4xl text-muted-foreground opacity-30 sm:text-6xl',
              isCountingDown ? 'animate-fade-inout-1s-linear' : 'animate-fade-in-for-target-word'
            )}
          >
            {isGeneratingVariations ? (
              <div className='flex flex-col items-center justify-center gap-2'>
                <span>Your next target word is:</span>
                <span className='font-bold'>{target}</span>
              </div>
            ) : isCountingDown ? (
              countdown.time > 0 ? (
                countdown.time
              ) : (
                'Start'
              )
            ) : (
              <span className='font-bold'>{target}</span>
            )}
          </div>
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
        <section className='relative flex w-full flex-col gap-y-2 border-t-[1px] border-t-border bg-card text-card-foreground transition-colors'>
          <Progress
            className='h-1 rounded-none'
            value={(currentProgress / CONSTANTS.numberOfQuestionsPerGame) * 100}
          />
          <form autoComplete='off' onSubmit={onUserSubmitInput} className='flex flex-col gap-2'>
            <div className='relative flex items-center justify-center gap-x-2 px-4'>
              <IconButton
                id='clear'
                type='button'
                tooltip='Clear input'
                aria-label='Clear input button'
                variant='link'
                asChild
                disabled={isLoading || isCountingDown || isGeneratingVariations}
                className='absolute right-[70px] z-10 !h-[20px] !w-[20px] rounded-full bg-transparent'
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
                autoComplete='off'
                placeholder={
                  isGeneratingVariations
                    ? renderWaitingMessageForVariations()
                    : isCountingDown
                      ? 'Ready to ask questions?'
                      : `Make AI say "${target}"`
                }
                className={cn(
                  'h-auto flex-grow !py-1.5 pl-2.5 pr-10 !text-sm',
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
              <button
                id='submit'
                disabled={
                  isGeneratingVariations ||
                  isCountingDown ||
                  isEmptyInput ||
                  userInputMatchedTabooWords.length > 0 ||
                  isLoading
                }
                type='submit'
                className='relative aspect-square size-6 transition-all duration-300 hover:scale-110 disabled:opacity-50'
                aria-label='submit button'
              >
                <div className='absolute inset-0 flex items-center justify-center overflow-hidden'>
                  <AnimatePresence mode='popLayout' initial={false}>
                    {isLoading ? (
                      <motion.div
                        key='send-button-loading'
                        initial={{ opacity: 0, y: '100px', scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: '100px', scale: 0.5 }}
                        transition={{ duration: 0.375, ease: 'easeInOut' }}
                      >
                        <Loader2 className='size-[16px] animate-spin' />
                      </motion.div>
                    ) : (
                      <motion.div
                        key='send-button-send'
                        initial={{ opacity: 0, y: '-100px', scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: '-100px', scale: 0.5 }}
                        transition={{ duration: 0.375, ease: 'easeInOut' }}
                      >
                        <SendHorizonal size={16} className='-rotate-90' />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </div>
            {userInputError && (
              <Label
                htmlFor='user-input'
                className='animate-fade-in self-start px-4 text-xs leading-snug text-red-400'
              >
                {userInputError}
              </Label>
            )}
          </form>
          <div className='flex w-full items-center gap-x-1 overflow-x-auto whitespace-nowrap px-4 pb-4 text-xs'>
            <MessageCircleOff className='size-3 shrink-0 text-red-400' />
            <div className='text-red-400'>{variations.map(_.startCase).join(', ')}</div>{' '}
            {isGeneratingVariations && (
              <div className='text-muted-foreground'>({renderWaitingMessageForVariations()})</div>
            )}
          </div>
        </section>
      </section>
      <AiEvaluationLoadingProgressBar
        open={isPending}
        current={currentEvaluationProgress}
        total={CONSTANTS.numberOfQuestionsPerGame}
      />
    </main>
  );
}

const LIST_OF_CONGRATULATORY_MESSAGES = [
  'Good job!',
  'Great work!',
  'Well done!',
  'Awesome!',
  'Fantastic!',
  'Nice work!',
  'You are on fire 🔥!',
  'Amazing!',
  'Brilliant!',
];

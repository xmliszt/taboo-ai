'use client';

// TODO: This component is too large to be a client component. Refactor to break it down.
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import _, { uniqueId } from 'lodash';
import { SendHorizonal, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTimer } from 'use-timer';

import { AiEvaluationLoadingProgressBar } from '@/app/level/[id]/ai-evaluation-loading-progress-bar';
import { Level } from '@/app/level/[id]/server/fetch-level';
import { generateConversationFromAI } from '@/app/level/[id]/server/generate-conversation-from-ai';
import { generateEvaluationFromAI } from '@/app/level/[id]/server/generate-evaluation-from-ai';
import { generateTabooWordsFromAI } from '@/app/level/[id]/server/generate-taboo-words-from-ai';
import { ScoreToUpload, uploadCompletedGameForUser } from '@/app/level/[id]/server/upload-game';
import { useAuth } from '@/components/auth-provider';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import Timer from '@/components/custom/timer';
import IconButton from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CONSTANTS } from '@/lib/constants';
import { tryParseErrorAsGoogleAIError } from '@/lib/errors/google-ai-error-parser';
import { HASH } from '@/lib/hash';
import { getPersistence } from '@/lib/persistence/persistence';
import { fetchWord } from '@/lib/services/wordService';
import { LevelToUpload } from '@/lib/types/level.type';
import { IWord } from '@/lib/types/word.type';
import { formatStringForDisplay, getMockResponse, getMockVariations } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import { getDevMode, isDevMode } from '@/lib/utils/devUtils';
import { generateHighlights, getMatchedTabooWords } from '@/lib/utils/levelUtils';

type LevelWordsProviderProps = {
  level?: Level;
  fromAIMode?: boolean;
  words: string[];
};

// Words stored in cache
let cacheWords: string[] = [];

// Level stored in cache - only for AI mode
let cacheLevel: LevelToUpload | null = null;

// Scores stored in cache
const savedScores: ScoreToUpload[] = [];

// Game started at
let gameStartedAt: Date = new Date();

// Game ended at
let gameEndedAt: Date = new Date();

export function LevelPageClientWrapper(props: LevelWordsProviderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const retryCount = useRef<number>(5);
  const inputTextField = useRef<HTMLInputElement>(null);
  const [wordsPlayed, setWordsPlayed] = useState<string[]>([]);
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
    resetTimer();
    setWordsPlayed([]);
    setTarget(generateNewTarget(words));
    setCurrentProgress(1);
    gameStartedAt = new Date();
  };

  const generateNewTarget = (words: string[]) => {
    // filter out those played
    const filteredWords = [...words].filter((w) => !wordsPlayed.includes(w));
    const newTarget = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setWordsPlayed([...wordsPlayed, newTarget]);
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

  const isEmptyInput = userInput.length <= 0;

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
        try {
          const googleError = tryParseErrorAsGoogleAIError(error, 'conversation');
          setConversation([...inputConversation, { role: 'error', content: googleError.message }]);
        } catch (error) {
          console.error(error);
          setConversation([
            ...inputConversation,
            { role: 'error', content: error.message ?? CONSTANTS.errors.overloaded },
          ]);
        }
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
    savedScores.push({
      score_index: currentProgress,
      target_word: target ?? '',
      taboo_words: variations,
      conversations: conversation,
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
    }, 5000);
  };

  // If the last message from conversation is from assistant, we generate highlights for it. And move on to the next question
  useEffect(() => {
    if (conversation.length > 0 && conversation[conversation.length - 1].role === 'assistant') {
      const lastAssistantMessage = conversation[conversation.length - 1];
      const highlights = generateHighlights(target, lastAssistantMessage.content, true);
      if (highlights.length > 0) {
        toast("That's a hit! Well done!");
        void nextQuestion(highlights);
      }
    }
  }, [conversation]);

  const generateVariationsForTarget = async (
    retries: number,
    target: string,
    topic: string | undefined,
    callback: (variations?: IWord) => void
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
      startTransition(async () => {
        for (let i = 0; i < savedScores.length; i++) {
          const evaluation = await generateEvaluationFromAI(savedScores[i]);
          savedScores[i].ai_evaluation.ai_score = evaluation.score;
          savedScores[i].ai_evaluation.ai_explanation = evaluation.reasoning;
          savedScores[i].ai_evaluation.ai_suggestion = evaluation.examples;
        }
        // Check if in AI mode, or user is guest, if so, we direct to result page, passing savedScores & level info as URLSearchParams
        if (!props.level?.id || props.fromAIMode || !user) {
          const resultPageSearchParam = new URLSearchParams();
          resultPageSearchParam.set('level', JSON.stringify(cacheLevel ?? props.level));
          resultPageSearchParam.set('scores', JSON.stringify(savedScores));
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
      });
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
      {isCountingDown ? (
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
      <section className='flex h-full w-full flex-col gap-0 text-center'>
        <div className='flex w-full flex-grow flex-col gap-4 overflow-y-scroll px-4 py-4 scrollbar-hide'>
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
                disabled={isLoading || isCountingDown || isGeneratingVariations}
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
                    : isCountingDown
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
                  isGeneratingVariations ||
                  isCountingDown ||
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
      <AiEvaluationLoadingProgressBar
        open={isPending}
        current={savedScores.filter((score) => score.ai_evaluation.ai_explanation === '').length}
        total={savedScores.length}
      />
    </main>
  );
}

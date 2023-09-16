'use client';

import {
  FormEvent,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
} from 'react';
import Timer from '@/components/custom/timer';
import {
  askAIForQueryResponse,
  askAITabooWordsForTarget,
} from '@/lib/services/aiService';
import _, { uniqueId } from 'lodash';
import { CONSTANTS } from '@/lib/constants';
import { useTimer } from 'use-timer';
import { useRouter } from 'next/navigation';
import { IHighlight } from '@/lib/types/highlight.interface';
import {
  formatStringForDisplay,
  getMockResponse,
  getMockVariations,
} from '@/lib/utilities';
import { HASH } from '@/lib/hash';
import { getTabooWords } from '@/lib/services/wordService';
import IWord from '@/lib/types/word.interface';
import { useToast } from '@/components/ui/use-toast';
import { SendHorizonal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import IconButton from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { IChat, IDisplayScore } from '@/lib/types/score.interface';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';
import ILevel from '@/lib/types/level.interface';
import { Skeleton } from '@/components/custom/skeleton';
import { getLevel } from '@/lib/services/levelService';

interface LevelPageProps {
  params: { id: string };
}

export default function LevelPage({ params: { id } }: LevelPageProps) {
  //SECTION - States
  const [level, setLevel] = useState<ILevel>();
  const [userInput, setUserInput] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [target, setTarget] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] =
    useState<boolean>(false);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const [userInputMatchedTabooWords, setUserInputMatchedTabooWords] = useState<
    string[]
  >([]);
  const [isEmptyInput, setIsEmptyInput] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(5);
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
      inputTextField.current?.focus();
    },
  });
  const [isCountingdown, setIsCountdown] = useState<boolean>(false);
  const [userInputError, setUserInputError] = useState<string>();
  const [conversation, setConversation] = useState<IChat[]>([]);
  const inputTextField = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [savedScores, setSavedScores] = useState<IDisplayScore[]>([]);
  const { item: cachedLevel, setItem: addLevelToLocalStorage } =
    useLocalStorage<ILevel>(HASH.level);
  const { setItem: setScores, clearItem: clearScores } = useLocalStorage<
    IDisplayScore[]
  >(HASH.scores);

  const fetchLevel = useCallback(async () => {
    const level = await getLevel(id);
    if (level) {
      setLevel(level);
    }
  }, [id]);

  useEffect(() => {
    if (id === 'ai') {
      setLevel(cachedLevel);
    } else {
      fetchLevel();
    }
  }, [fetchLevel, cachedLevel]);

  useEffect(() => {
    setScores(savedScores);
  }, [savedScores]);

  //SECTION - When level fetched, we start the game
  useEffect(() => {
    if (level) {
      resetTimer();
      clearScores();
      id !== 'ai' && addLevelToLocalStorage(level); // update local storage level if not ai mode
      setDifficulty(level.difficulty);
      const words = level.words.map((word) => formatStringForDisplay(word));
      setWords(words);
      const _target = generateNewTarget(words);
      setTarget(_target);
      setCurrentProgress(1);
      setIsSuccess(false);
      setResponseText(
        'Think about your prompt while we generate the Taboo words.'
      );
    }
  }, [level]);
  //!SECTION

  //!SECTION
  const generateNewTarget = (words: string[]): string => {
    if (words.length === 0) {
      words = pickedWords;
      setPickedWords([]);
    }
    const _target = words[Math.floor(Math.random() * words.length)];
    const picked = [...pickedWords];
    picked.push(_target);
    setPickedWords(picked);
    const unused = [...words];
    _.remove(unused, (s) => s === _target);
    setWords(unused);
    return _target;
  };

  const getRegexPattern = (target: string): RegExp => {
    const magicSeparator = '[\\W_]*';
    const magicMatchString = target
      .replace(/\W/g, '')
      .split('')
      .join(magicSeparator);
    const groupRegexString =
      target.length === 1
        ? `^(${magicMatchString})[\\W_]+|[\\W_]+(${magicMatchString})[\\W_]+|[\\W_]+(${magicMatchString})$|^(${magicMatchString})$`
        : `(${magicMatchString})`;
    return new RegExp(groupRegexString, 'gi');
  };

  const renderWaitingMessageForVariations = () => {
    switch (retryCount) {
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

  const generateHighlights = (
    str: string,
    forResponse: boolean
  ): IHighlight[] => {
    const highlights: IHighlight[] = [];
    if (forResponse && target) {
      const regex = getRegexPattern(target);
      let result;
      while ((result = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (result.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        const startIndex = result.index;
        const endIndex = regex.lastIndex;
        const highlight = { start: startIndex, end: endIndex };
        highlights.push(highlight);
      }
    } else {
      const _variations = target == null ? variations : [...variations, target];
      const matchedTaboos: string[] = [];
      for (const variation of _variations) {
        const parts = [variation];
        for (const part of parts) {
          const regex = getRegexPattern(part);
          let result;
          while ((result = regex.exec(str)) !== null) {
            if (!matchedTaboos.includes(variation)) {
              matchedTaboos.push(variation);
            }
            // This is necessary to avoid infinite loops with zero-width matches
            if (result.index === regex.lastIndex) {
              regex.lastIndex++;
            }
          }
        }
      }
      setUserInputMatchedTabooWords(matchedTaboos);
    }
    return highlights;
  };

  //SECTION - On Input Changed
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResponseText('');
    setUserInput(event.target.value);
    setIsEmptyInput(event.target.value.length <= 0);
  };
  //!SECTION

  //SECTION - On Input submitted
  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    setResponseText('');
    if (userInputMatchedTabooWords.length <= 0 && userInput.length > 0) {
      setConversation([...conversation, { role: 'user', content: userInput }]);
      setUserInput('');
    }
  };
  //!SECTION

  useEffect(() => {
    const lastPrompt = conversation[conversation.length - 1];
    if (lastPrompt && lastPrompt.role === 'user') {
      setConversation([...conversation, { role: 'assistant', content: '...' }]);
      fetchResponse(lastPrompt);
    }
    document.getElementById('chat-end')?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  //SECTION - Fetch Response
  const fetchResponse = async (prompt: IChat) => {
    setIsLoading(true);
    pauseTimer();
    // * Make sure response fade out completely!
    setTimeout(async () => {
      try {
        let responseText: string | undefined;
        if (localStorage.getItem(HASH.dev) === '1') {
          responseText = await getMockResponse(
            target ?? '',
            localStorage.getItem('mode') ?? '1'
          );
        } else {
          const filteredPrompts = conversation.filter(
            (p) => p.role !== 'error'
          );
          responseText = await askAIForQueryResponse([
            ...filteredPrompts,
            prompt,
          ]);
        }
        if (responseText === undefined || responseText === null) {
          setConversation([
            ...conversation,
            { role: 'error', content: CONSTANTS.errors.overloaded },
          ]);
          setIsLoading(false);
          startTimer();
          return;
        } else {
          setConversation([
            ...conversation,
            { role: 'assistant', content: responseText },
          ]);
        }
        // * Wait for input fade out completely, then show response
        setTimeout(() => {
          responseText && setResponseText(responseText);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        // Server error
        setIsSuccess(false);
        setConversation([
          ...conversation,
          { role: 'error', content: CONSTANTS.errors.overloaded },
        ]);
        setIsLoading(false);
        startTimer();
      }
    }, 1000);
  };
  //!SECTION

  //SECTION - Next Question
  const nextQuestion = async () => {
    pauseTimer();
    const copySavedScores = [...savedScores];
    copySavedScores.push({
      id: currentProgress,
      target: target ?? '',
      conversation: conversation,
      difficulty: difficulty,
      completion: time,
      responseHighlights: highlights,
    });
    setSavedScores(copySavedScores);
    setIsSuccess(true);
    currentProgress === CONSTANTS.numberOfQuestionsPerGame &&
      toast({
        title: 'Game Over! Generating Results...',
      });
    setTimeout(() => {
      setCurrentProgress((progress) => progress + 1);
    }, 5000);
  };
  //!SECTION

  const generateVariationsForTarget = async (
    retries: number,
    target: string,
    callback: (variations?: IWord) => void
  ) => {
    setRetryCount(retries);
    if (localStorage.getItem(HASH.dev)) {
      getMockVariations(target, true)
        .then((variations) => {
          callback(variations);
        })
        .catch(() => {
          if (retries > 0) {
            generateVariationsForTarget(retries - 1, target, callback);
          } else {
            callback();
          }
        });
    } else {
      try {
        const taboo = await getTabooWords(target);
        if (taboo && taboo.taboos.length > 1 && taboo.isVerified) {
          callback(taboo);
        } else {
          askAITabooWordsForTarget(target)
            .then(async (variations) => {
              callback(variations);
            })
            .catch(() => {
              if (retries > 0) {
                generateVariationsForTarget(retries - 1, target, callback);
              } else {
                callback();
              }
            });
        }
      } catch {
        if (retries > 0) {
          generateVariationsForTarget(retries - 1, target, callback);
        } else {
          callback();
        }
      }
    }
  };

  const startCountdown = () => {
    countdown.start();
    setIsCountdown(true);
  };

  //SECTION - When target changed
  useEffect(() => {
    if (target) {
      setVariations([target]);
      setConversation([]);
      setIsGeneratingVariations(true);
      generateVariationsForTarget(5, target, (variations) => {
        setTimeout(() => {
          setIsGeneratingVariations(false);
          let _variations = [target];
          if (
            variations &&
            _.toLower(variations.target) === _.toLower(target)
          ) {
            _variations = variations.taboos;
          }
          setVariations(_variations.map(formatStringForDisplay));
          setResponseText('');
          startCountdown();
        }, 2000);
      });
    }
  }, [target]);
  //!SECTION

  //SECTION - When progress changed
  useEffect(() => {
    const isLastRound =
      currentProgress === CONSTANTS.numberOfQuestionsPerGame + 1;
    if (isLastRound) {
      router.push('/result');
    } else if (currentProgress === 1) {
      return;
    } else {
      const _target = generateNewTarget(words);
      setTarget(_target);
      setVariations([_target]);
      setUserInput('');
      setIsSuccess(false);
    }
  }, [currentProgress]);
  //!SECTION

  //SECITON - Timer control
  useEffect(() => {
    if (isCountingdown) {
      resetTimer();
    }
  }, [isCountingdown]);
  //!SECTION

  //SECTION -  Compute highlight match
  useEffect(() => {
    if (target) {
      const highlights = generateHighlights(responseText, true);
      setHighlights(highlights);
    }
  }, [responseText]);
  //!SECTION

  //SECTION - Compute user input validation match
  useEffect(() => {
    // TODO: Generate highlights for user input not used, but call this function to update matched taboo words state. This side effect not good, pending improvement
    const _ = generateHighlights(userInput, false);
  }, [userInput]);
  //!SECTION

  //SECTION - When highlights updated
  useEffect(() => {
    if (highlights.length > 0) {
      toast({ title: "That's a hit! Good job!" });
      nextQuestion();
    } else {
      setIsSuccess(false);
      inputTextField.current?.focus();
      isCountingdown ||
      isEmptyInput ||
      isLoading ||
      isGeneratingVariations ||
      isLoading
        ? pauseTimer()
        : startTimer();
    }
  }, [highlights]);
  //!SECTION

  //SECTION - User input validation condition
  useEffect(() => {
    if (userInputMatchedTabooWords.length > 0) {
      setUserInputError(
        `Uh-oh, you hit taboo words: ${userInputMatchedTabooWords.join(', ')}`
      );
    } else {
      setUserInputError(undefined);
    }
  }, [userInputMatchedTabooWords]);
  //!SECTION

  const generateHighlightedMessage = (message: string): JSX.Element[] => {
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
          makeNormalMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
        endIndex = highlight.end;
        // Highlighted part
        parts.push(
          makeHighlightMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
      }
      parts.push(makeNormalMessagePart(message.substring(endIndex)));
    }
    return parts;
  };

  const makeNormalMessagePart = (message: string) => {
    return <span key={uniqueId(message)}>{message}</span>;
  };

  const makeHighlightMessagePart = (message: string) => {
    return (
      <span
        key={uniqueId(message)}
        className='rounded-lg px-1 py-1 bg-green-400 text-black'
      >
        {message}
      </span>
    );
  };

  if (!level) {
    return (
      <section className='flex justify-center h-full pt-20 px-4'>
        <h1 className='fixed z-20 top-3 w-full flex justify-center'>
          <div className='rounded-lg shadow-lg px-3 py-1 w-fit'>Taboo AI</div>
        </h1>
        <Skeleton numberOfRows={10} />
      </section>
    );
  }

  return (
    <section className='flex justify-center h-full'>
      {isCountingdown ? (
        <div className='fixed z-50 top-1/2 w-full text-center text-5xl animate-bounce'>
          {countdown.time === 0
            ? 'Start'
            : countdown.time === -1
            ? ''
            : countdown.time}
        </div>
      ) : isGeneratingVariations ? (
        <div className='fixed z-50 top-1/2 w-full text-center text-3xl animate-bounce'>
          {renderWaitingMessageForVariations()}
        </div>
      ) : (
        <></>
      )}
      <Timer
        className='fixed top-3 right-3 z-50 shadow-lg'
        time={time}
        status={timerStatus}
      />
      <section className='flex flex-col gap-4 text-center h-full w-full pt-20'>
        <div className='flex-grow w-full flex flex-col gap-4 px-4 pb-4 overflow-y-scroll scrollbar-hide'>
          {conversation.map((prompt, idx) => (
            <p
              key={idx}
              className={cn(
                prompt.role === 'user'
                  ? 'chat-bubble-right'
                  : 'chat-bubble-left'
              )}
            >
              {prompt.role === 'assistant' &&
              idx === conversation.length - 1 ? (
                generateHighlightedMessage(prompt.content)
              ) : prompt.role === 'error' ? (
                <span className='text-slate-400'>{prompt.content}</span>
              ) : prompt.role === 'assistant' ? (
                prompt.content.split('').map((c, i) => (
                  <span
                    key={`ai-prompt-character-${i}`}
                    className={`animate-pulse animation-delay-${i * 100}`}
                  >
                    {c}
                  </span>
                ))
              ) : (
                `${prompt.content}`
              )}
            </p>
          ))}
          <div id='chat-end'></div>
        </div>

        <section className='border-t-border border-t-[1px] w-full flex flex-col transition-colors bg-card text-card-foreground'>
          <Progress
            className='rounded-none h-1'
            value={(currentProgress / CONSTANTS.numberOfQuestionsPerGame) * 100}
          />
          <div className='relative mb-4 flex flex-col items-center gap-2 pt-4 px-4 text-card-foreground'>
            <span className='font-light text-base'>Make AI Say:</span>
            <span className='text-card text-xl bg-card-foreground px-2 py-1 rounded-lg font-bold'>
              {target}
            </span>
          </div>
          <form onSubmit={onFormSubmit} className='flex flex-col gap-2'>
            <div className='flex relative items-center justify-center gap-4 px-4'>
              <IconButton
                id='clear'
                type='button'
                tooltip='Clear input'
                aria-label='Clear input button'
                disabled={
                  !level ||
                  isLoading ||
                  isCountingdown ||
                  isGeneratingVariations ||
                  isSuccess
                }
                className='absolute right-20 z-10 shadow-lg rounded-full !w-[20px] !h-[20px]'
                onClick={() => {
                  setUserInput('');
                  setIsEmptyInput(true);
                  inputTextField.current?.focus();
                }}
              >
                <X size={12} />
              </IconButton>
              <Input
                id='user-input'
                disabled={
                  !level ||
                  isLoading ||
                  isCountingdown ||
                  isGeneratingVariations ||
                  isSuccess
                }
                ref={inputTextField}
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
                onChange={onInputChange}
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
                  isLoading ||
                  isSuccess
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
                className='text-red-400 leading-snug px-4 animate-fade-in'
              >
                {userInputError}
              </Label>
            )}
          </form>
          <div className='text-base mt-4 w-full px-4 pb-8 overflow-x-auto whitespace-nowrap'>
            <span>
              <span className='font-light italic'>Taboos: </span>
              <span className='text-red-400'>
                {variations.map(_.startCase).join(', ')}
              </span>{' '}
              {isGeneratingVariations && (
                <span className=''>
                  ({renderWaitingMessageForVariations()})
                </span>
              )}
            </span>
          </div>
        </section>
      </section>
    </section>
  );
}

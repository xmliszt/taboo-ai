'use client';

import { FormEvent, useState, useEffect, useRef, ChangeEvent } from 'react';
import Timer from './(components)/Timer';
import { AiOutlineSend, AiFillCloseCircle } from 'react-icons/ai';
import { getQueryResponse, getWordVariations } from '../(services)/aiService';
import InputDisplay from './(components)/InputDisplay';
import _ from 'lodash';
import { Author } from './(models)/Author.enum';
import ProgressBar from './(components)/ProgressBar';
import { CONSTANTS } from '../constants';
import { useTimer } from 'use-timer';
import { useRouter } from 'next/navigation';
import { cacheScore, clearScores, getLevelCache } from '../(caching)/cache';
import { Highlight } from './(models)/Chat.interface';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IVariation from '../(models)/variationModel';
import { getMockResponse, getMockVariations } from '../utilities';

interface LevelPageProps {}

export default function LevelPage(props: LevelPageProps) {
  //SECTION - States
  const [isMounted, setIsMounted] = useState(false);
  const [userInput, setUserInput] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [target, setTarget] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] =
    useState<boolean>(false);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [userInputHighlights, setUserInputHighlights] = useState<Highlight[]>(
    []
  );
  const [isValidInput, setIsValidInput] = useState<boolean>(true);
  const [isEmptyInput, setIsEmptyInput] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showSuccessBackground, setShowSuccessBackground] = useState(false);
  const [isResponseFaded, setIsResponseFaded] = useState<boolean>(false);
  const [isInputConfirmed, setIsInputConfirmed] = useState<boolean>(false);
  const [inputShouldFadeOut, setInputShouldFadeOut] = useState<boolean>(false);
  const [isOverloaded, setIsOverloaded] = useState<boolean>(false);
  const [responseShouldFadeOut, setResponseShouldFadeOut] =
    useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(5);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 0,
    timerType: 'INCREMENTAL',
  });
  const countdown = useTimer({
    initialTime: 3,
    endTime: -1,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      setIsCountdown(false);
      start();
      inputTextField.current?.focus();
    },
  });
  const [isCountingdown, setIsCountdown] = useState<boolean>(false);
  const inputTextField = useRef<HTMLInputElement>(null);
  const router = useRouter();
  //!SECTION

  const generateNewTarget = (words: string[]): string => {
    const _target = words[Math.floor(Math.random() * words.length)];
    const picked = [...pickedWords];
    picked.push(_target);
    setPickedWords(picked);
    const unused = [...words];
    _.remove(unused, (s) => s === _target);
    setWords(unused);
    window.dispatchEvent(
      new CustomEvent<{ target: string }>('onTargetChanged', {
        detail: { target: _target },
      })
    );
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
  ): Highlight[] => {
    const highlights: Highlight[] = [];
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
      for (const variation of variations) {
        const parts = [variation];
        for (const part of parts) {
          const regex = getRegexPattern(part);
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
        }
      }
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
    setIsOverloaded(false);
    setResponseText('');
    setResponseShouldFadeOut(true); // Fade out current response if any
    if (isValidInput && userInput.length > 0) {
      setInputShouldFadeOut(false);
      setIsInputConfirmed(true); // Input ping animation
      fetchResponse(userInput);
    }
  };
  //!SECTION

  //SECTION - Fetch Response
  const fetchResponse = async (prompt: string) => {
    setIsLoading(true);
    pause();
    // * Make sure response fade out completely!
    setTimeout(async () => {
      try {
        let responseText: string | undefined;
        if (
          (process.env.NEXT_PUBLIC_ENV === 'development' ||
            process.env.NEXT_PUBLIC_ENV === 'preview') &&
          localStorage.getItem('dev')
        ) {
          responseText = await getMockResponse(
            target ?? '',
            localStorage.getItem('mode') ?? '1'
          );
        } else {
          responseText = await getQueryResponse(prompt);
        }
        setIsInputConfirmed(false); // Reset input ping animation
        if (responseText === undefined || responseText === null) {
          setIsOverloaded(true);
          setIsLoading(false);
          start();
          return;
        }
        setIsOverloaded(false);
        setInputShouldFadeOut(true); // Input start fading out
        setResponseShouldFadeOut(true); // Fade out current response if any
        // * Wait for input fade out completely, then show response
        setTimeout(() => {
          responseText && setResponseText(responseText);
          setIsLoading(false);
          setResponseShouldFadeOut(false); // Let new response fade in
          setIsResponseFaded(false);
          setInputShouldFadeOut(false); // Reset input fade animation
        }, 1000);
      } catch (err) {
        // Server error
        setIsSuccess(false);
        setInputShouldFadeOut(true); // Input start fading out
        setIsInputConfirmed(false); // Reset input ping animation
        setResponseShouldFadeOut(true); // Fade out current response if any
        toast.error(CONSTANTS.errors.overloaded);
        setIsLoading(false);
        start();
      }
    }, 1000);
  };
  //!SECTION

  //SECTION - Next Question
  const nextQuestion = async () => {
    pause();
    const question = userInput.slice();
    cacheScore({
      id: currentProgress,
      target: target ?? '',
      question: question,
      response: responseText,
      difficulty: difficulty,
      completion: time,
      responseHighlights: highlights,
    });
    setShowSuccessBackground(true);
    setIsSuccess(true);
    setIsResponseFaded(true);
    setTimeout(() => {
      setShowSuccessBackground(false);
    }, 1000);
    currentProgress === CONSTANTS.numberOfQuestionsPerGame &&
      toast.success('Game Over! Generating Results...');
    setTimeout(() => {
      setCurrentProgress((progress) => progress + 1);
    }, 5000);
  };
  //!SECTION

  const generateVariationsForTarget = (
    retries: number,
    target: string,
    callback: (variations?: IVariation) => void
  ) => {
    setRetryCount(retries);
    localStorage.getItem('dev')
      ? getMockVariations(target, true)
          .then((variations) => {
            callback(variations);
          })
          .catch(() => {
            if (retries > 0) {
              generateVariationsForTarget(retries - 1, target, callback);
            } else {
              callback();
            }
          })
      : getWordVariations(target)
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
  };

  const startCountdown = () => {
    countdown.start();
    setIsCountdown(true);
  };

  useEffect(() => {
    !isMounted && setIsMounted(true);
  }, []);

  //SECTION - When target changed
  useEffect(() => {
    if (target) {
      setVariations([target]);
      setIsGeneratingVariations(true);
      toast.info('Generating new taboo words...');
      generateVariationsForTarget(5, target, (variations) => {
        setTimeout(() => {
          setIsGeneratingVariations(false);
          if (variations && variations.target === target) {
            setVariations(variations.variations);
          } else {
            setVariations([target]);
          }
          setResponseShouldFadeOut(true);
          setResponseText('');
          startCountdown();
        }, 2000);
      });
    }
  }, [target]);
  //!SECTION

  //SECTION - At the start of the game
  useEffect(() => {
    if (isMounted) {
      clearScores();
      const level = getLevelCache();
      if (level !== null) {
        reset();
        setDifficulty(level.difficulty);
        setWords(level.words);
        const _target = generateNewTarget(level.words);
        setTarget(_target);
        setCurrentProgress(1);
        setIsSuccess(false);
        setResponseShouldFadeOut(false); // Let new response fade in
        setResponseText(
          'Think about your prompt while we generate the Taboo words.'
        );
      } else {
        throw Error('No level is chosen');
      }
    }
  }, [isMounted]);
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
      setInputShouldFadeOut(false);
      setIsSuccess(false);
    }
  }, [currentProgress]);
  //!SECTION

  //SECITON - Timer control
  useEffect(() => {
    if (isCountingdown) {
      reset();
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
    setIsOverloaded(false);
    if (userInput) {
      const highlights = generateHighlights(userInput, false);
      setUserInputHighlights(highlights);
    } else {
      setUserInputHighlights([]);
    }
  }, [userInput]);
  //!SECTION

  //SECTION - When highlights updated
  useEffect(() => {
    if (highlights.length > 0) {
      nextQuestion();
    } else {
      setIsSuccess(false);
      inputTextField.current?.focus();
      isCountingdown ||
      isEmptyInput ||
      isLoading ||
      isGeneratingVariations ||
      isLoading
        ? pause()
        : start();
    }
  }, [highlights]);
  //!SECTION

  //SECTION - User input validation condition
  useEffect(() => {
    setIsValidInput(userInputHighlights.length == 0);
  }, [userInputHighlights]);
  //!SECTION

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      {isCountingdown && (
        <div
          className={`fixed z-50 top-1/3 w-full h-24 text-center text-[3rem] lg:text-[5rem] animate-bounce`}
        >
          {countdown.time === 0
            ? 'Start'
            : countdown.time === -1
            ? ''
            : countdown.time}
        </div>
      )}
      {isOverloaded && (
        <div className='animate-fadeIn px-16 fixed z-50 top-1/3 w-full h-24 text-center text-lg lg:text-2xl'>
          {CONSTANTS.errors.overloaded}
        </div>
      )}
      <div className='fixed top-2 lg:top-2 w-full flex flex-col gap-1 justify-center items-center'>
        <Timer time={time} />
        <span className='text-xs lg:text-sm lg:block'>TIMER {status}</span>
      </div>
      <section
        className={`flex flex-col gap-4 text-center h-full w-full transition-colors ease-in-out dark:bg-neon-gray ${
          isValidInput ? '' : 'bg-red dark:bg-neon-red-light'
        } ${showSuccessBackground && 'bg-green dark:bg-neon-green'}`}
      >
        <section className='fixed top-20 lg:top-24 left-0 right-0  w-full z-30 flex justify-center'>
          <ProgressBar
            current={currentProgress}
            total={CONSTANTS.numberOfQuestionsPerGame}
          />
        </section>
        <section className='h-16 lg:h-32 w-full relative'></section>
        <section className='mt-8 absolute bottom-40 top-20 lg:bottom-60 flex-grow w-full flex flex-col gap-4 justify-center items-center'>
          <div
            hidden={!isValidInput || showSuccessBackground}
            className={`h-10 w-full absolute z-20 top-0 gradient-down dark:gradient-down-dark transition-colors`}
          ></div>
          <div className='h-full w-full flex-grow leading-normal absolute'>
            {responseText.length > 0 ? (
              <InputDisplay
                target={target}
                message={responseText}
                highlights={highlights}
                author={Author.AI}
                faded={isResponseFaded}
                inputConfirmed={false}
                shouldFadeOut={responseShouldFadeOut}
                shouldFadeIn={!responseShouldFadeOut}
              />
            ) : (
              <InputDisplay
                target={target}
                message={userInput}
                highlights={userInputHighlights}
                author={Author.Me}
                faded={false}
                inputConfirmed={isInputConfirmed}
                shouldFadeOut={inputShouldFadeOut}
                shouldFadeIn={!inputShouldFadeOut}
              />
            )}
          </div>
          <div
            hidden={!isValidInput || showSuccessBackground}
            className={`h-10 w-full absolute z-20 bottom-0 gradient-up dark:gradient-up-dark transition-colors `}
          ></div>
          <div></div>
        </section>
        <section className='absolute bottom-0 w-full pb-8 flex flex-col bg-gray dark:bg-neon-black rounded-t-3xl transition-colors  drop-shadow-[0_-5px_20px_rgba(0,0,0,0.7)] lg:drop-shadow-[0_-15px_50px_rgba(0,0,0,1)] z-30'>
          <section className='relative w-full h-14 lg:h-24 z-10 top-0'>
            <div className='z-10 absolute left-0 w-16 h-full gradient-right dark:gradient-right-dark rounded-tl-3xl transition-colors'></div>
            <h1 className='absolute left-10 right-10 px-5 flex-grow text-center lg:py-6 py-4 text-xl lg:text-3xl text-red dark:text-neon-red whitespace-nowrap overflow-x-scroll scrollbar-hide'>
              Make AI Say:{' '}
              <span className='font-extrabold text-black dark:text-neon-white whitespace-nowrap'>
                {target}
              </span>{' '}
              <span className='font-light text-sm'>(case-insensitive)</span>
            </h1>
            <div className='z-10 absolute right-0 h-full w-16 gradient-left dark:gradient-left-dark rounded-tr-3xl transition-colors'></div>
          </section>
          <form onSubmit={onFormSubmit}>
            <div className='flex relative items-center justify-center gap-4 px-4'>
              <button
                id='clear'
                type='button'
                aria-label='Clear input button'
                disabled={
                  isLoading ||
                  isCountingdown ||
                  isGeneratingVariations ||
                  isSuccess
                }
                className='absolute right-16 lg:right-20 z-10 text-lg lg:text-2xl transition-opacity ease-in-out drop-shadow-lg border-2 lg:border-8 border-white bg-white dark:bg-neon-gray text-black hover:text-white hover:bg-black hover:dark:text-neon-black hover:dark:bg-neon-green hover:dark:border-neon-green dark:text-neon-white dark:border-neon-green rounded-full'
                onClick={() => {
                  setUserInput('');
                  setIsEmptyInput(true);
                  inputTextField.current?.focus();
                }}
              >
                <AiFillCloseCircle />
              </button>
              <input
                disabled={
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
                className={`flex-grow ${
                  !isValidInput
                    ? 'bg-red dark:bg-neon-black dark:text-neon-white dark:border-neon-red-light text-gray'
                    : ''
                }`}
                type='text'
                value={userInput}
                onChange={onInputChange}
                maxLength={100}
              />
              <button
                id='submit'
                disabled={
                  isGeneratingVariations ||
                  isCountingdown ||
                  isEmptyInput ||
                  !isValidInput ||
                  isLoading ||
                  isSuccess
                }
                type='submit'
                className={`text-xl lg:text-3xl transition-opacity ease-in-out dark:text-neon-red-light ${
                  isEmptyInput || !isValidInput ? 'opacity-50' : ''
                }`}
                aria-label='submit button'
              >
                <AiOutlineSend />
              </button>
            </div>
          </form>
          <div className='text-sm lg:text-base mt-4 overflow-x-scroll scrollbar-hide w-full px-4 whitespace-nowrap'>
            <span className=''>
              Taboo words:{' '}
              <span className='text-red dark:text-neon-red'>
                {variations.join(', ')}
              </span>{' '}
              {isGeneratingVariations && (
                <span className='text-black dark:text-gray'>
                  ({renderWaitingMessageForVariations()})
                </span>
              )}
            </span>
          </div>
        </section>
      </section>
    </>
  );
}

'use client';

import { FormEvent, useState, useEffect, useRef, ChangeEvent } from 'react';
import Timer from './(components)/Timer';
import { AiOutlineSend } from 'react-icons/ai';
import { getQueryResponse } from '../../(services)/aiService';
import InputDisplay from './(components)/InputDisplay';
import _ from 'lodash';
import { Author } from './(models)/Author.enum';
import ProgressBar from './(components)/ProgressBar';
import { CONSTANTS } from '../../constants';
import { useTimer } from 'use-timer';
import { useRouter } from 'next/navigation';
import { cacheScore, clearScores, getLevelCache } from '../../(caching)/cache';
import { Highlight } from './(models)/Chat.interface';
import BackButton from '../../(components)/BackButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LevelPage() {
  const [userInput, setUserInput] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(0);
  const [target, setTarget] = useState<string | null>(null);
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
  const [isResponseFaded, setIsResponseFaded] = useState<boolean>(false);
  const [isInputConfirmed, setIsInputConfirmed] = useState<boolean>(false);
  const [inputShouldFadeOut, setInputShouldFadeOut] = useState<boolean>(false);
  const [responseShouldFadeOut, setResponseShouldFadeOut] =
    useState<boolean>(false);
  const { time, start, pause, reset } = useTimer({
    initialTime: 0,
    timerType: 'INCREMENTAL',
  });
  const inputTextField = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const generateNewTarget = (words: string[]) => {
    reset();
    start();
    const _target = words[Math.floor(Math.random() * words.length)];
    setTarget(_target);
    const picked = [...pickedWords];
    picked.push(_target);
    setPickedWords(picked);
    const unused = [...words];
    _.remove(unused, (s) => s === _target);
    setWords(unused);
    inputTextField.current?.focus();
  };

  const getRegexPattern = (target: string): RegExp => {
    const magicSeparator = '\\W*';
    const groupRegexString = `(${target.split('').join(magicSeparator)})`;
    return new RegExp(groupRegexString, 'gi');
  };

  const generateHighlights = (
    target: string,
    str: string,
    isFullMatch: boolean
  ): Highlight[] => {
    const parts = isFullMatch ? [target] : target.split(' ');
    const highlights: Highlight[] = [];
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
        highlights.push({ start: startIndex, end: endIndex });
      }
    }
    return highlights;
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResponseText('');
    setUserInput(event.target.value);
    setIsEmptyInput(event.target.value.length <= 0);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isValidInput && userInput.length > 0) {
      setIsInputConfirmed(true); // Input ping animation
      fetchResponse(userInput);
    }
  };

  const fetchResponse = async (prompt: string) => {
    setIsLoading(true);
    pause();
    // ! Make sure response fade out completely!
    setTimeout(async () => {
      const responseText = await getQueryResponse(prompt);
      if (!responseText) throw Error('Response Failed!');
      start();
      setIsLoading(false);
      setInputShouldFadeOut(true); // Input start fading out
      setIsInputConfirmed(false); // Reset input ping animation
      setResponseShouldFadeOut(true); // Fade out current response if any
      // Wait for input fade out completely, then show response
      setTimeout(() => {
        responseText && setResponseText(responseText);
        setResponseShouldFadeOut(false); // Let new response fade in
        setIsResponseFaded(false);
        setInputShouldFadeOut(false); // Reset input fade animation
      }, 1000);
    }, 1000);
  };

  const nextQuestion = () => {
    const isLastRound = currentProgress === CONSTANTS.numberOfQuestionsPerGame;
    setIsSuccess(true);
    toast.success(
      `Congratulations! ${
        isLastRound
          ? 'You have finished the game!'
          : 'Here comes the next word!'
      }`
    );
    const question = userInput.slice();
    cacheScore({
      id: currentProgress,
      target: target ?? '',
      question: question,
      response: responseText,
      difficulty: difficulty,
      completion: time,
    });
    setTimeout(() => {
      if (isLastRound) {
        router.push('/result');
      } else {
        generateNewTarget(words);
        setCurrentProgress((progress) => progress + 1);
        setUserInput('');
        inputTextField.current?.focus();
        setIsSuccess(false);
        setIsResponseFaded(true);
        setInputShouldFadeOut(false);
      }
    }, 2000);
  };

  // * At the start of the game
  useEffect(() => {
    clearScores();
    const level = getLevelCache();
    if (level !== null) {
      setDifficulty(level.difficulty);
      setWords(level.words);
      generateNewTarget(level.words);
      setCurrentProgress(1);
    } else {
      throw Error('Unable to fetch level!');
    }
  }, []);

  // * Compute highlight match
  useEffect(() => {
    if (target !== null) {
      const highlights = generateHighlights(target, responseText, true);
      setHighlights(highlights);
    }
  }, [responseText]);

  // * Compute user input validation match
  useEffect(() => {
    if (target !== null) {
      const highlights = generateHighlights(target, userInput, false);
      setUserInputHighlights(highlights);
    }
  }, [userInput]);

  // * Next Question Condition
  useEffect(() => {
    highlights.length > 0 && nextQuestion();
  }, [highlights]);

  // * User input validation condition
  useEffect(() => {
    setIsValidInput(userInputHighlights.length == 0);
  }, [userInputHighlights]);

  return (
    <>
      {/* <Loading isLoading={isLoading} message="Talking to AI..." /> */}
      <ToastContainer
        position='top-center'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      <BackButton href='/levels' />
      <div className='fixed top-3 lg:top-2 w-full flex justify-center items-center'>
        <Timer time={time} />
      </div>
      <section
        className={`flex flex-col gap-4 text-center h-full w-full transition-colors ease-in-out dark:bg-neon-gray ${
          isValidInput ? '' : 'bg-red dark:bg-neon-red-light'
        } ${isSuccess && 'bg-green dark:bg-neon-green'}`}
      >
        <section className='fixed top-16 left-0 right-0 lg:top-24 w-full z-30 flex justify-center'>
          <ProgressBar
            current={currentProgress}
            total={CONSTANTS.numberOfQuestionsPerGame}
          />
        </section>
        <section className='h-16 lg:h-32 w-full relative'></section>
        <section className='mt-8 absolute bottom-32 top-16 lg:bottom-56 flex-grow w-full flex flex-col gap-4 justify-center items-center'>
          <div
            hidden={!isValidInput || isSuccess}
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
            hidden={!isValidInput || isSuccess}
            className={`h-10 w-full absolute z-20 bottom-0 gradient-up dark:gradient-up-dark transition-colors `}
          ></div>
          <div></div>
        </section>
        <section className='absolute bottom-0 w-full pb-8 flex flex-col bg-gray dark:bg-neon-black rounded-t-3xl transition-colors  drop-shadow-[0_-5px_20px_rgba(0,0,0,0.7)] lg:drop-shadow-[0_-15px_50px_rgba(0,0,0,1)] z-30'>
          <section className='relative w-full h-14 lg:h-24 z-10 top-0'>
            <div className='z-10 absolute left-0 w-16 h-full gradient-right dark:gradient-right-dark rounded-tl-3xl transition-colors'></div>
            <h1 className='absolute left-10 right-10 px-5 flex-grow text-center lg:py-6 py-4 text-xl lg:text-3xl text-red dark:text-neon-red whitespace-nowrap overflow-x-scroll scrollbar-hide'>
              TABOO:{' '}
              <span className='font-extrabold text-black dark:text-neon-white whitespace-nowrap'>
                {target}
              </span>
            </h1>
            <div className='z-10 absolute right-0 h-full w-16 gradient-left dark:gradient-left-dark rounded-tr-3xl transition-colors'></div>
          </section>
          <form onSubmit={onFormSubmit}>
            <div className='flex items-center justify-center gap-4 px-4'>
              <input
                disabled={isLoading}
                autoFocus
                placeholder='Start your conversation with AI here...'
                className={`flex-grow ${
                  !isValidInput
                    ? 'bg-red dark:bg-neon-black dark:text-neon-white dark:border-neon-red-light text-gray'
                    : ''
                }`}
                ref={inputTextField}
                type='text'
                value={userInput}
                onChange={onInputChange}
                maxLength={100}
              />
              <button
                id='submit'
                disabled={
                  userInput.length == 0 ||
                  isEmptyInput ||
                  !isValidInput ||
                  isLoading
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
        </section>
      </section>
    </>
  );
}

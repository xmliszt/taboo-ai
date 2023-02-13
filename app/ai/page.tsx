'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { getCreativeLevel } from '../(services)/aiService';
import { CONSTANTS } from '../constants';
import { useRouter } from 'next/navigation';
import { cacheLevel } from '../(caching)/cache';
import BackButton from '../(components)/BackButton';
import LoadingMask from '../(components)/Loading';

export default function AiPage() {
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [somethingWrong, setSomethingWrong] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    setIsValid(topic.length > 0);
    if (topic.length > 0) {
      setIsLoading(true);
      try {
        const level = await getCreativeLevel(topic, difficulty);
        if (level) {
          if (level.words.length < CONSTANTS.numberOfQuestionsPerGame) {
            return setSomethingWrong(true);
          }
          cacheLevel(level);
          router.push('/level/' + level.id);
        } else {
          throw new Error(CONSTANTS.errors.overloaded);
        }
      } catch {
        setSomethingWrong(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    setIsValid(event.target.value.length > 0);
    setSomethingWrong(false);
  };

  return (
    <>
      <LoadingMask
        isLoading={isLoading}
        message='Asking AI for taboo words...'
      />
      <section
        className={`w-full h-screen flex justify-center items-center transition-colors ease-in-out ${
          !isValid || somethingWrong ? 'bg-red dark:bg-neon-red-light' : ''
        }`}
      >
        <BackButton href='/levels' />
        <form onSubmit={submitForm}>
          <div className='flex flex-col gap-6 justify-center items-center'>
            <label
              id='topicInputLabel'
              aria-label='Topic Input Label'
              className='text-2xl lg:text-5xl text-center transition-all ease-in-out'
              htmlFor='topicInput'
            >
              {somethingWrong
                ? CONSTANTS.errors.overloaded
                : isValid
                ? 'Enter A Topic'
                : 'Topic cannot be blank!'}
            </label>
            <label
              htmlFor='topicInput'
              className='text-xs text-center px-5 lg:text-lg lg:px-16'
              aria-label='AI Mode Explanation'
            >
              In <b>AI Mode</b>, the topic you provided here will be used for AI
              to generate the 5 &quot;Guess Words&quot; for you to play the
              Taboo game later on! Basically, you let AI create a{' '}
              <b>custom Taboo game</b> for you, instead of playing with the
              pre-defined topics! <b>Difficulty Levels</b> determine how hard
              the word will be in the generated game.
            </label>
            <div className='flex flex-col xs:flex-row md:flex-row lg:flex-row gap-4'>
              <input
                aria-labelledby='topicInputLabel'
                aria-label='topic input field'
                aria-placeholder='for example: Planets'
                autoFocus
                id='topicInput'
                type='text'
                value={topic}
                onChange={onInputChange}
                placeholder='e.g. Planets'
                maxLength={50}
                className={`flex-grow h-12 lg:h-16 ${
                  (!isValid || somethingWrong) &&
                  'border-red dark:bg-neon-red-light dark:text-neon-gray dark:border-neon-white text-gray'
                }`}
              />
              <select
                name='difficulty'
                id='difficulty'
                value={difficulty}
                aria-labelledby='difficultyLabel'
                aria-label='select difficulty'
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className='form-select appearance-none
              h-12
              px-4
              lg:h-16
              text-center
              text-1xl
              lg:text-3xl
              bg-white text-black bg-clip-padding bg-no-repeat
              dark:bg-neon-black dark:text-neon-white
              border-4 border-white
              rounded-full
              transition
              ease-in-out
              hover:bg-black
              hover:text-white
              hover:border-gray
              hover:dark:bg-neon-gray
              hover:dark:text-neon-white
              hover:dark:border-neon-red
              hover:cursor-pointer
              focus:outline-none'
              >
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
              <label
                id='difficultyLabel'
                aria-label='Difficulty Level Selection Label'
                htmlFor='difficulty'
                className='text-xs lg:text-lg text-center text-yellow dark:text-neon-yellow'
              >
                Choose A Difficulty Level
              </label>
            </div>
            <button
              type='submit'
              disabled={somethingWrong || !isValid}
              className='mt-8 w-10/12 h-12 lg:h-16'
              aria-label='Confirm to submit your input'
            >
              Confirm
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

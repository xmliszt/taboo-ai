'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { BiPaste } from 'react-icons/bi';
import { toast } from 'react-toastify';
import BackButton from '../(components)/BackButton';
import LoadingMask from '../(components)/LoadingMask';
import { getScoresCache, setUser } from '../../lib/cache';
import { CONSTANTS } from '../../lib/constants';
import { getUserInfoByRecoveryKey } from '../../lib/services/frontend/userService';

const RecoveryPage = () => {
  const [hasScores, setHasScores] = useState<boolean | null>(null);
  const [recoveryKey, setRecoveryKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (hasScores === null) {
      const scoresCache = getScoresCache();
      setHasScores(scoresCache !== null);
    }
  }, [hasScores]);

  const onPaste = async () => {
    const clipboardContent = await navigator.clipboard.readText();
    if (clipboardContent) {
      setRecoveryKey(clipboardContent);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const user = await getUserInfoByRecoveryKey(recoveryKey);
      setUser(user);
      window.dispatchEvent(
        new CustomEvent(CONSTANTS.eventKeys.recoverySuccess)
      );
      router.push(hasScores ? '/result' : '/');
    } catch (error) {
      console.error(error);
      toast.error(
        'Sorry, we are unable to retrieve information about this account.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingMask isLoading={isLoading} message='Recovering account...' />
      <BackButton href={hasScores ? '/result' : '/'} />
      <h1 className='fixed top-0 w-full h-20 py-4 text-center gradient-down dark:gradient-down-dark-black z-10'>
        Recover Your Scores
      </h1>
      <section className='w-full h-full py-16 px-8 flex flex-col justify-center items-center gap-4'>
        <form
          className='flex flex-col gap-4 justify-center items-center'
          onSubmit={submit}
        >
          <label htmlFor='recovery-key-input'>Enter your recovery key</label>
          <div className='flex flex-row gap-2 h-12'>
            <input
              type='text'
              id='recovery-key-input'
              placeholder='Recovery key...'
              className='flex-grow h-full'
              value={recoveryKey}
              onChange={(e) => {
                e.preventDefault();
                setRecoveryKey(e.target.value);
              }}
            />
            <button
              id='paste'
              type='button'
              className='flex justify-center items-center h-full aspect-square'
              aria-label='paste recovery key from clipboard'
              onClick={onPaste}
            >
              <BiPaste />
            </button>
          </div>
          <button
            type='submit'
            className='py-4 px-6'
            aria-label='submit recovery key'
          >
            Submit
          </button>
        </form>
        <article className='text-justify text-gray leading-5'>
          <h1>
            <i>What is Recovery Key?</i>
          </h1>
          <p>
            <b>Recovery Key</b> is used to restore your saved games. We use{' '}
            <b>Recovery Key</b> to identify who you are and hence retrieve the
            games for you.
          </p>
        </article>
      </section>
    </>
  );
};

export default RecoveryPage;

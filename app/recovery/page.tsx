'use client';

import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { BiPaste } from 'react-icons/bi';
import LoadingMask from '../(components)/LoadingMask';
import { getScoresCache, setUser } from '../../lib/cache';
import {
  addDeviceToUser,
  getUserInfoByRecoveryKey,
  updateUserLastLoginTime,
} from '../../lib/services/frontend/userService';
import { delayRouterPush } from '../../lib/utilities';
import useToast from '../../lib/hook/useToast';

const RecoveryPage = () => {
  const [hasScores, setHasScores] = useState<boolean | null>(null);
  const [recoveryKey, setRecoveryKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasteAllow, setIsPasteAllow] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (hasScores === null) {
      const scoresCache = getScoresCache();
      setHasScores(scoresCache !== null);
    }
    try {
      const isAllow =
        window.isSecureContext || window.navigator.clipboard !== undefined;
      setIsPasteAllow(isAllow);
    } catch (error) {
      console.error(error);
      setIsPasteAllow(false);
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
      await updateUserLastLoginTime(
        user.nickname,
        user.recovery_key,
        moment().valueOf()
      );
      await addDeviceToUser(
        user.nickname,
        user.recovery_key,
        navigator.userAgent
      );
      toast({
        title: 'Account recovered successfully!',
        status: 'success',
        duration: 1000,
      });
      delayRouterPush(router, hasScores ? '/result' : '/', { delay: 1000 });
    } catch (error) {
      console.error(error);
      toast({
        title:
          'Sorry, we are unable to retrieve information about this account.',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingMask isLoading={isLoading} message='Recovering account...' />
      <h1 className='fixed top-0 w-full h-20 py-4 text-center z-10'>
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
              type='password'
              id='recovery-key-input'
              placeholder='Recovery key...'
              className='flex-grow h-full'
              value={recoveryKey}
              onChange={(e) => {
                e.preventDefault();
                setRecoveryKey(e.target.value);
              }}
            />
            {isPasteAllow && (
              <button
                id='paste'
                data-style='none'
                type='button'
                className='flex justify-center items-center h-full aspect-square'
                aria-label='paste recovery key from clipboard'
                onClick={onPaste}
              >
                <BiPaste />
              </button>
            )}
          </div>
          <button
            disabled={recoveryKey.length <= 0}
            type='submit'
            className='py-4 px-6'
            aria-label='submit recovery key'
          >
            Submit
          </button>
        </form>
        <article className=' text-gray leading-5'>
          <p className='text-xl'>
            <i>What is Recovery Key?</i>
          </p>
          <p className='text-justify'>
            <b>Recovery Key</b> is used to restore your saved games. We use{' '}
            <b>Recovery Key</b> to identify who you are, and retrieve your
            scores in the leaderboard.
          </p>
          <p className='text-justify'>
            <b>Forgot about your recovery key?</b> We understand that losing
            your recovery key can be frustrating, but unfortunately, we
            don&apos;t have any way to retrieve it as we don&apos;t store any
            additional information for security reasons. However, don&apos;t
            worry! We have a solution for you. You can simply try our daily
            challenge and create a new nickname and get a new recovery key at
            the end of the game. We apologize for any inconvenience this may
            have caused, but we hope this alternative method helps you get back
            on track.{' '}
          </p>
          <Link
            className='underline text-yellow dark:text-neon-green'
            href='/daily-challenge/loading'
          >
            👉🏻 Attempt the daily challenge!
          </Link>
        </article>
      </section>
    </>
  );
};

export default RecoveryPage;

'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { getScoresCache, setUser } from '../../lib/cache';
import LoadingMask from '../(components)/LoadingMask';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { createUser } from '../../lib/services/frontend/userService';
import { useRouter } from 'next/navigation';
import UserKeyDisplayModal from '../(components)/UserKeyDisplayModal';
import { delayRouterPush } from '../../lib/utilities';
import useToast from '../../lib/hook/useToast';

const SignupPage = () => {
  const [nickname, setNickname] = useState<string>('');
  const [isValidNickname, setIsValidNickname] = useState(true);
  const [userKey, setUserKey] = useState<string>('');
  const [hasScores, setHasScores] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSaveKeyModal, setShowSaveKeyModal] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (hasScores === null) {
      const scoresCache = getScoresCache();
      setHasScores(scoresCache !== null);
    }
  }, [hasScores]);

  const signup = (e: FormEvent) => {
    e.preventDefault();
    if (nickname.length <= 0 || !isValidNickname) {
      setErrorMessage('Please enter nickname before submitting!');
    } else {
      confirmAlert({
        title: 'Your Nickname is...',
        message: nickname,
        buttons: [
          { label: 'Submit', onClick: submitNickname },
          { label: 'Wait! Let me change!' },
        ],
      });
    }
  };

  const submitNickname = async () => {
    try {
      setIsLoading(true);
      const newUser = await createUser(nickname);
      setUser(newUser);
      setUserKey(newUser.recovery_key);
      setShowSaveKeyModal(true);
    } catch (error) {
      if (error.message === 'User already exists!') {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          'Sorry! We are unable to submit your nickname at the moment. Please try again later!'
        );
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUserNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    const inputNickname = e.target.value;
    const isValid = inputNickname.match(usernameRegex);
    setNickname(e.target.value);
    if (!isValid) {
      setErrorMessage(
        "Nickname must only contains alphanumeric characters A-Z, a-z, 0-9 and '-'."
      );
      setIsValidNickname(false);
    } else {
      setErrorMessage(null);
      setIsValidNickname(true);
    }
  };

  const onUserConfirmSavedKey = () => {
    confirmAlert({
      title: 'Have you saved your Recovery Key?',
      message:
        'Make sure you have saved your Recovery Key because it will not be shown again.',
      buttons: [
        {
          label: 'Yes I have saved it!',
          onClick: () => {
            setShowSaveKeyModal(false);
            toast({
              title: 'Nickname submitted successfully!',
              status: 'success',
              duration: 1000,
            });
            delayRouterPush(router, hasScores ? '/result' : '/');
          },
        },
        {
          label: 'Wait, let me save it!',
        },
      ],
    });
  };

  return (
    <>
      {showSaveKeyModal && (
        <UserKeyDisplayModal
          userKey={userKey}
          onConfirm={onUserConfirmSavedKey}
        />
      )}
      <LoadingMask
        isLoading={isLoading}
        message='Submitting your nickname...'
      />
      <section className='w-full h-full flex justify-center items-center leading-normal'>
        <div
          className={`h-4/5 aspect-square max-w-[80vw] max-h-[80vh] rounded-3xl drop-shadow-lg bg-white dark:bg-neon-gray p-4 lg:p-16 transition-all ${
            errorMessage !== null
              ? 'border-red dark:border-neon-red border-8'
              : 'border-none'
          }`}
        >
          <form
            onSubmit={signup}
            className='flex flex-col h-full gap-4 text-center'
          >
            <label
              htmlFor='nickname-input'
              aria-label='lable for the nickname input'
              className='text-black dark:text-neon-white text-xl lg:text-3xl'
            >
              Register Your Nickname
            </label>
            <input
              id='nickname-input'
              type='text'
              aria-label='input your nickname here'
              placeholder='Enter your nickname...'
              maxLength={12}
              className='h-24 lg:h-36 rounded-3xl w-full text-2xl lg:text-4xl focus:!border-green focus:dark:!border-neon-green'
              onChange={onUserNicknameChange}
            />
            <label
              htmlFor='nickname-input'
              className='text-black dark:text-neon-white'
            >
              Tell us your nickname so that we can <b>uniquely identify you</b>{' '}
              in the leaderboard!
            </label>
            <div className='flex-grow text-2xl text-red dark:text-neon-red h-full items-center justify-center flex'>
              {errorMessage}
            </div>
            <button className='h-24 lg:h-36 text-2xl lg:text-4xl !bg-green dark:!bg-neon-black !text-white dark:!text-neon-white'>
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignupPage;

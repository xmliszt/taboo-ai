'use client';

import { TiTick } from 'react-icons/ti';
import { BiCopy } from 'react-icons/bi';
import { useState } from 'react';
import copy from 'clipboard-copy';
import useToast from '../../lib/hook/useToast';

interface UserKeyDisplayModalProps {
  userKey: string;
  onConfirm: () => void;
}
export default function UserKeyDisplayModal(props: UserKeyDisplayModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    await copy(props.userKey);
    toast({
      title: 'Recovery Key is copied to clipboard!',
      status: 'success',
      duration: 2000,
    });
    setIsCopied(true);
  };

  return (
    <div className='fixed w-full h-full z-50 bg-black dark:text-neon-black bg-opacity-80 backdrop-blur flex flex-col gap-6 justify-center items-center'>
      <div className='text-lg lg:text-3xl text-center dark:text-neon-white flex items-center flex-col gap-4 max-w-[80%] lg:max-w-2xl'>
        <h1 className='text-2xl lg:text-4xl'>Save Your Recovery Key</h1>
        <article className='text-white-faded flex flex-col gap-2'>
          <i>What is it used for?</i>
          <p className='text-sm lg:text-base max-h-56 overflow-y-scroll lg:scrollbar-hide'>
            Taboo.AI does not require <b>username and password</b> to save your
            progress. However, for you to join the leaderboard, we need to
            identify each individual unqiue user. You do not need to do anything
            if you use the same browser to play Taboo.AI, we will{' '}
            <b>remember you</b> every time you play! However, if you decide to{' '}
            <b>change a device or browser</b>, the new device or browser will
            not remember who you are, hence you will be prompted to use{' '}
            <b>Recovery Key</b> to restore your submitted scores in the
            leaderboard.
          </p>
        </article>
        <div
          className={`w-full flex flex-row gap-4 ${
            isCopied
              ? 'bg-green dark:bg-neon-green'
              : 'bg-white dark:bg-neon-red '
          } transition-colors text-black p-2 rounded-lg drop-shadow-lg`}
        >
          <p className='flex-grow p-2 rounded-md shadow-md bg-black text-white dark:bg-neon-black dark:text-neon-white'>
            {props.userKey}
          </p>
          <button
            id='copy'
            data-style='none'
            className='flex-grow-0 h-full aspect-square rounded-md bg-white dark:bg-neon-gray text-black dark:text-neon-white p-2 flex justify-center items-center'
            onClick={copyToClipboard}
          >
            {isCopied ? <TiTick /> : <BiCopy />}
          </button>
        </div>
        <button className='flex-grow w-2/5 h-12' onClick={props.onConfirm}>
          Next
        </button>
      </div>
    </div>
  );
}

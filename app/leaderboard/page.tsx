'use client';

import BackButton from '../(components)/BackButton';
import { isMobile } from 'react-device-detect';
import LoadingMask from '../(components)/LoadingMask';
import { useState } from 'react';

interface LeaderboardPageProps {}

const LeaderboardPage = (props: LeaderboardPageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <LoadingMask
        key='loading-mask'
        isLoading={isLoading}
        message='Submitting your scores to the leaderboard...'
      />
      <BackButton href='/' />
      <h1 className='fixed top-0 w-full h-20 py-4 text-center gradient-down dark:gradient-down-dark-black z-10'>
        Leaderboard
      </h1>
    </>
  );
};

export default LeaderboardPage;

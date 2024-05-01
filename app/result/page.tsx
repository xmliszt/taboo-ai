import React from 'react';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { ResultClientWrapper } from '@/app/result/result-client-wrapper';
import { fetchGame } from '@/app/result/server/fetch-game';

type ResultPageProps = {
  searchParams: {
    id?: string;
    key?: string;
  };
};

export default async function ResultPage(props: ResultPageProps) {
  if (!props.searchParams.id) throw new Error('No game id provided');

  const user = await fetchUserProfile();
  const hashedKey = props.searchParams.key;
  const remotelyFetchedGame = await fetchGame(props.searchParams.id);

  return (
    <main className='relative pb-20'>
      <ResultClientWrapper
        user={user}
        storedHashKey={hashedKey}
        remotelyFetchedGame={remotelyFetchedGame}
      />
    </main>
  );
}

import React from 'react';
import { AsyncReturnType } from 'type-fest';

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
  // Fetch user profile if possible
  let user: AsyncReturnType<typeof fetchUserProfile> | undefined;
  try {
    user = await fetchUserProfile();
  } catch (error) {
    // do nothing
  }

  const hashedKey = props.searchParams.key;

  // Fetch the game remotely if possible
  let remotelyFetchedGame: AsyncReturnType<typeof fetchGame> | undefined = undefined;
  if (props.searchParams.id) {
    remotelyFetchedGame = await fetchGame(props.searchParams.id);
  }

  return (
    <main className='relative'>
      <section className='!leading-screenshot pb-24 pt-4'>
        <ResultClientWrapper
          user={user}
          storedHashKey={hashedKey}
          remotelyFetchedGame={remotelyFetchedGame}
        />
      </section>
    </main>
  );
}

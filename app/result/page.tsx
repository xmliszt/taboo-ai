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
  const user = await fetchUserProfile();
  const hashedKey = props.searchParams.key;

  return (
    <main className='relative pb-20'>
      <ResultClientWrapper
        user={user}
        storedHashKey={hashedKey}
        remotelyFetchedGame={
          props.searchParams?.id ? await fetchGame(props.searchParams.id) : undefined
        }
      />
    </main>
  );
}

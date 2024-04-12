import Link from 'next/link';

import { fetchGamesCompletedByUserWithLevelInfo } from '@/app/profile/server/fetch-user-completed-games';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';

import { ProfileRecentGameCard } from './profile-recent-game-card';

export async function ProfileRecentGamesScrollView() {
  const user = await fetchUserProfile();
  const numberOfMostRecentGamesToDisplay = user.subscription?.customer_plan_type === 'pro' ? 20 : 5;
  const userGames = await fetchGamesCompletedByUserWithLevelInfo(
    user.id,
    numberOfMostRecentGamesToDisplay,
    0
  );

  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Past games</h2>
      </div>
      <div className='text-sm leading-snug text-muted-foreground'>
        You can view most recent {`${numberOfMostRecentGamesToDisplay} games`}.{' '}
        {user.subscription?.customer_plan_type === 'free' && (
          <span>
            To view more past games, upgrade to Pro plan:{' '}
            <Link className='animate-pulse p-0 underline' href='/pricing'>
              Upgrade my plan
            </Link>
          </span>
        )}
      </div>
      <div className='flex w-full snap-x snap-mandatory flex-row justify-start gap-4 overflow-x-auto rounded-lg border p-8 leading-snug'>
        {userGames.map((game) => (
          <ProfileRecentGameCard key={game.game_id} game={game} />
        ))}
        <ProfileRecentGameCard
          game={{ ...userGames[0], game_id: 'play-more', level_name: 'Play more games' }}
        />
      </div>
    </div>
  );
}

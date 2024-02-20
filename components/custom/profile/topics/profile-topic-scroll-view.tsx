import Link from 'next/link';

import { fetchUniqueTopicsCompletedByUser } from '@/app/profile/server/fetch-user-completed-topics';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';

import { ProfileTopicsCardView } from './profile-topics-card-view';

export async function ProfilePlayedTopicScrollView() {
  const user = await fetchUserProfile();
  const playedTopics = await fetchUniqueTopicsCompletedByUser(user.id);

  return (
    <div className='flex w-full flex-col justify-start gap-2'>
      <div className='flex w-full flex-row items-center gap-2'>
        <h2 className='text-2xl'>Completed topics</h2>
      </div>
      <div className='flex w-full snap-x snap-mandatory flex-row justify-start gap-12 overflow-x-auto rounded-lg border px-12 py-8 leading-snug'>
        {playedTopics.length === 0 ? (
          <div className='w-full text-center'>
            You have not completed any topics yet.{' '}
            <Link href='/levels' className='underline transition-all hover:text-muted-foreground'>
              Go play some topics
            </Link>
            .
          </div>
        ) : (
          playedTopics.map((topic) => <ProfileTopicsCardView key={topic.level_id} topic={topic} />)
        )}
      </div>
    </div>
  );
}

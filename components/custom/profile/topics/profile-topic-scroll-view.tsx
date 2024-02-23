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
      <p className='text-sm text-muted-foreground'>
        Golden aura indicates you are the top scorer for this topic
      </p>
      <div className='flex w-full snap-x snap-mandatory flex-row justify-start gap-4 overflow-x-auto rounded-lg border p-8 leading-snug'>
        {playedTopics.map((topic) => (
          <ProfileTopicsCardView key={topic.level_id} topic={topic} />
        ))}
        <ProfileTopicsCardView topic={{ ...playedTopics[0], level_id: 'play-more' }} />
      </div>
    </div>
  );
}

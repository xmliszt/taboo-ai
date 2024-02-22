import { Suspense } from 'react';
import Image from 'next/image';

import { NicknameEditor } from '@/app/profile/nickname-editor';
import { ProfileAlertInfo } from '@/app/profile/profile-alert-info';
import { ProfileFeedbackFloatingButton } from '@/app/profile/profile-feedback-floating-button';
import { ProfileScrollControl } from '@/app/profile/profile-scroll-control';
import { fetchUserProfileWithSubscription } from '@/app/profile/server/fetch-user-profile';
import { ProfilePrivacySettingsCard } from '@/components/custom/profile/privacy/profile-privacy-settings-card';
import { ProfileDangerZone } from '@/components/custom/profile/profile-danger-zone';
import { ProfileSubscriptionCard } from '@/components/custom/profile/profile-subscription-card';
import { ProfileRecentGamesScrollView } from '@/components/custom/profile/recent-games/profile-recent-games-scroll-view';
import { ProfileStatisticsCardView } from '@/components/custom/profile/statistics/profile-statistics-card-view';
import { ProfilePlayedTopicScrollView } from '@/components/custom/profile/topics/profile-topic-scroll-view';
import { Skeleton } from '@/components/custom/skeleton';

export default async function ProfilePage() {
  const user = await fetchUserProfileWithSubscription();

  return (
    <ProfileScrollControl>
      {/* Avatar */}
      <div className='flex flex-col items-center gap-4'>
        <Image
          className='rounded-full border-2 border-primary shadow-md'
          src={user.photo_url ?? '/images/placeholder.png'}
          width={80}
          height={80}
          alt='Profile Photo'
        />
      </div>
      <NicknameEditor initialNickname={user.nickname ?? user.name} />
      <ProfileAlertInfo />
      <Suspense fallback={<Skeleton className='h-[350px] w-full' numberOfRows={12} />}>
        <ProfileRecentGamesScrollView />
      </Suspense>
      <Suspense fallback={<Skeleton className='h-[350px] w-full' numberOfRows={12} />}>
        <ProfilePlayedTopicScrollView />
      </Suspense>
      <Suspense fallback={<Skeleton className='h-[500px] w-full' numberOfRows={12} />}>
        <ProfileStatisticsCardView />
      </Suspense>
      <ProfilePrivacySettingsCard className='w-full' user={user} />
      <ProfileSubscriptionCard className='w-full' user={user} />
      <ProfileDangerZone className='w-full' user={user} />
      <ProfileFeedbackFloatingButton user={user} />
    </ProfileScrollControl>
  );
}

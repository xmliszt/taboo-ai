'use client';

import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { updateUserFromUser } from '@/lib/services/userService';
import { isMobile, isTablet } from 'react-device-detect';
import { Spinner } from '@/components/custom/spinner';
import { useRouter, useSearchParams } from 'next/navigation';
import ConstructionBlock from '@/components/custom/common/construction-block';
import ProfileDangerZone from '@/components/custom/profile/profile-danger-zone';
import ProfileRecentGamesScrollView from '@/components/custom/profile/profile-recent-games-scroll-view';
import ProfileStatisticsCardView from '@/components/custom/profile/profile-statistics-card-view';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { LoginReminderProps } from '@/components/custom/globals/login-reminder-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookX, X } from 'lucide-react';
import ProfilePrivacySettingsCard from '@/components/custom/profile/profile-privacy-settings-card';
import ProfilePlayedTopicScrollView from '@/components/custom/profile/profile-topic-scroll-view';
import ProfileSubscriptionCard from '@/components/custom/profile/profile-subscription-card';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, status } = useAuth();
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isNicknameUpdating, setIsNicknameUpdating] = useState(false);
  const [hideAlert, setHideAlert] = useState(false);
  const oldNickname = useRef<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const anchor = searchParams.get('anchor');
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast({
        title: 'You need to sign in to view your profile.',
      });
      EventManager.fireEvent<LoginReminderProps>(
        CustomEventKey.LOGIN_REMINDER,
        {
          title: 'You need to sign in to view your profile.',
          redirectHref: '/profile',
        }
      );
      router.push('/');
      return;
    }
    if (status === 'authenticated' && (user?.nickname || user?.name)) {
      const name = user.nickname ?? user.name ?? '';
      setNickname(name);
      oldNickname.current = name;
    }
  }, [user, status]);

  const refreshNickname = async () => {
    if (user?.email && nickname && nickname !== oldNickname.current) {
      try {
        setIsNicknameUpdating(true);
        const updatedUser = await updateUserFromUser({
          email: user.email,
          nickname,
        });
        if (updatedUser.nickname) {
          setNickname(updatedUser.nickname);
          oldNickname.current = updatedUser.nickname;
        }
        toast({ title: 'Nickname updated!' });
      } catch (error) {
        console.error(error);
        toast({
          title:
            'Sorry, we are unable to update your nickname. Please try again!',
          variant: 'destructive',
        });
      } finally {
        setIsNicknameUpdating(false);
      }
    }
  };

  return (
    <main className='pt-20 px-10 py-32 bg-background text-foreground flex flex-col items-center gap-16 overflow-auto'>
      <div className='flex flex-col gap-4 items-center'>
        <Image
          className='rounded-full shadow-md border-2 border-primary'
          src={user?.photoUrl ?? '/images/placeholder.png'}
          width={80}
          height={80}
          alt='Profile Photo'
        />
        <div className='flex flex-col gap-2 justify-start'>
          <Input
            id='nickname-edit-input'
            disabled={isNicknameUpdating}
            ref={nicknameInputRef}
            className='h-14 !text-2xl font-extralight text-center border-[1px] hover:border-2 border-neutral-500 px-2 py-2 rounded-lg transition-all ease-in-out hover:cursor-text focus:outline-none focus:ring-0 focus:border-0 max-w-[300px]'
            placeholder='Edit Nickname'
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
            onBlur={() => {
              refreshNickname();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                nicknameInputRef.current?.blur();
              }
            }}
          />
          <label
            htmlFor='nickname-edit-input'
            className='italic text-muted-foreground text-sm font-extra flex flex-row gap-2 items-center'
          >
            {isNicknameUpdating && <Spinner size={12} />}{' '}
            {isMobile || isTablet ? 'Tap' : 'Click'} to edit nickname
          </label>
        </div>
      </div>
      {!hideAlert && (
        <Alert className='text-gray-500 border-gray-500 opacity-70 -mb-10 relative'>
          <BookX size={20} />
          <AlertTitle className='leading-snug'>
            <X
              size={15}
              className='absolute top-2 right-2 hover:cursor-pointer'
              onClick={() => {
                setHideAlert(true);
              }}
            />
            Custom AI generated games will not be included in the records.
          </AlertTitle>
          <AlertDescription>
            If you would like to see your custom games here, first play the game
            via AI Mode, and then follow the prompt to contribute your AI custom
            topic to us. Then once your topic is officially added to Taboo AI,
            you can play again and your game will be saved to your records.
          </AlertDescription>
        </Alert>
      )}

      {user && <ProfileRecentGamesScrollView user={user} />}
      {user && <ProfilePlayedTopicScrollView user={user} />}
      {user && <ProfileStatisticsCardView email={user.email} />}

      <ConstructionBlock
        title='Flashcard under construction...'
        description='You will soon be able to create your own flashcards with the words you have played, kickstart custom game from the flashcard, organize them into decks and share them with your friends...'
        className='w-full max-w-[500px]'
      />

      {user && (
        <ProfilePrivacySettingsCard
          className='w-full max-w-[500px]'
          user={user}
        />
      )}

      {user && <ProfileSubscriptionCard className='w-full max-w-[500px]' />}

      {user && status === 'authenticated' && (
        <ProfileDangerZone className='w-full max-w-[500px]' />
      )}
    </main>
  );
}

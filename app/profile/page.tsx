'use client';

import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { updateUserFromUser } from '@/lib/services/userService';
import { isMobile } from 'react-device-detect';
import { Spinner } from '@/components/custom/spinner';
import { useRouter } from 'next/navigation';
import ConstructionBlock from '@/components/custom/common/construction-block';
import ProfileDangerZone from '@/components/custom/profile/profile-danger-zone';
import AccessLinkCard, {
  MenuItem,
} from '@/components/custom/common/access-link-card';
import { CONSTANTS } from '@/lib/constants';
import { ScrollText } from 'lucide-react';
import { bindPersistence, getPersistence } from '@/lib/persistence/persistence';
import IGame from '@/lib/types/game.type';
import { HASH } from '@/lib/hash';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, status } = useAuth();
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState<string>('');
  const [isNicknameUpdating, setIsNicknameUpdating] = useState(false);
  const [game, setGame] = useState<IGame | null>(null);
  const oldNickname = useRef<string>('');

  useEffect(() => {
    const game = getPersistence<IGame>(HASH.game);
    setGame(game);
    bindPersistence<IGame>(HASH.game, setGame);
  }, []);

  const seeMyLastResultMenuItem: MenuItem = useMemo(() => {
    return {
      path: '/result',
      title: 'See my last result',
      subtitle:
        'We found your last played result is cached in the app. You can revisit it here!',
      visible:
        game != null &&
        game.scores.length === CONSTANTS.numberOfQuestionsPerGame,
      href: '/result',
    };
  }, [game]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast({
        title: 'You need to sign in to view your profile.',
      });
      router.push('/');
      return;
    }
    if (status === 'authenticated' && user?.nickname) {
      setNickname(user.nickname);
      oldNickname.current = user.nickname;
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
    <section className='pt-20 px-10 py-32 bg-background text-foreground flex flex-col items-center gap-6 overflow-auto'>
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
            {isMobile ? 'Tap' : 'Click'} to edit nickname
          </label>
        </div>
      </div>

      {seeMyLastResultMenuItem.visible && (
        <AccessLinkCard
          idx={1}
          item={seeMyLastResultMenuItem}
          className='w-full max-w-[500px]'
          icon={<ScrollText />}
        />
      )}

      <ConstructionBlock
        title='Game Statistics is coming soon!'
        description='You will soon be able to view your game statistics, including the number of games played, your best scores, your favorite topics, etc...'
        className='w-full max-w-[500px]'
      />
      <ConstructionBlock
        title='Public Topic Ranking is coming soon!'
        description='You will soon be able to submit your well-played games to the public topic ranking, for others to view and learn from your clues, you will also stand a chance to be the top player for a particular topic in the leaderboard!'
        className='w-full max-w-[500px]'
      />
      <ConstructionBlock
        title='Flashcard under construction...'
        description='You will soon be able to create your own flashcards with the words you have played, kickstart custom game from the flashcard, organize them into decks and share them with your friends...'
        className='w-full max-w-[500px]'
      />
      {user && status === 'authenticated' && (
        <ProfileDangerZone className='w-full max-w-[500px]' />
      )}
    </section>
  );
}

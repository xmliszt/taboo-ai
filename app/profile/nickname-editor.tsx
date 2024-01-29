'use client';

import { useRef, useState } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { toast } from 'sonner';

import { updateUserNickname } from '@/app/profile/server/update-user-nickname';
import { Spinner } from '@/components/custom/spinner';
import { Input } from '@/components/ui/input';

type NicknameEditorProps = {
  initialNickname: string;
};
export function NicknameEditor(props: NicknameEditorProps) {
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState<string>(props.initialNickname);
  const [isNicknameUpdating, setIsNicknameUpdating] = useState(false);
  const oldNickname = useRef<string>(props.initialNickname);

  async function updateUserNicknameIfNeeded(newNickname: string) {
    try {
      setIsNicknameUpdating(true);
      await updateUserNickname(newNickname);
      oldNickname.current = nickname;
      toast.success('Nickname updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update nickname. Please try again later.');
    } finally {
      setIsNicknameUpdating(false);
    }
  }

  return (
    <div className='-mt-6 flex flex-col justify-start gap-2'>
      <Input
        id='nickname-edit-input'
        disabled={isNicknameUpdating}
        ref={nicknameInputRef}
        className='h-14 max-w-[300px] rounded-lg border-[1px] border-neutral-500 px-2 py-2 text-center !text-2xl font-extralight transition-all ease-in-out hover:cursor-text hover:border-2 focus:border-0 focus:outline-none focus:ring-0'
        placeholder='Edit Nickname'
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
        }}
        onBlur={async () => {
          if (nickname !== oldNickname.current) {
            await updateUserNicknameIfNeeded(nickname);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            nicknameInputRef.current?.blur();
          }
        }}
      />
      <label
        htmlFor='nickname-edit-input'
        className='font-extra flex flex-row items-center gap-2 text-sm italic text-muted-foreground'
      >
        {isNicknameUpdating && <Spinner size={12} />} {isMobile || isTablet ? 'Tap' : 'Click'} to
        edit nickname
      </label>
    </div>
  );
}

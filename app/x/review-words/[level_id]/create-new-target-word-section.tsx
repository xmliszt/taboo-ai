'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toLower, trim } from 'lodash';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { generateTabooWordsFromAI } from '@/app/level/[id]/server/generate-taboo-words-from-ai';
import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import { updateLevel } from '@/app/x/review-words/[level_id]/server/update-level';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { upsertWordWithTabooWords } from '@/lib/services/wordService';
import { Database } from '@/lib/supabase/extension/types';

type CreateNewTargetWordSectionProps = {
  level: Database['public']['Tables']['levels']['Row'];
  user?: UserProfile;
};
export function CreateNewTargetWordSection(props: CreateNewTargetWordSectionProps) {
  const router = useRouter();
  const [targetWord, setTargetWord] = useState('');
  const [tabooWords, setTabooWords] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submitNewTargetWord(data: FormData) {
    confirmAlert({
      title: 'Create New Target Word',
      description: `Are you sure you want to create the new target word "${targetWord}"?`,
      confirmLabel: 'Create',
      onConfirm: () => performCreateNewTargetWordAction(data),
    });
  }

  function performCreateNewTargetWordAction(data: FormData) {
    const targetWord = toLower(trim(data.get('target') as string));
    const tabooWords = Array.from(data.getAll('taboo')).map((taboo) =>
      toLower(trim(taboo as string))
    );
    startTransition(async () => {
      await upsertWordWithTabooWords(targetWord, tabooWords, true, props.user?.id);
      await updateLevel(props.level.id, { words: [...props.level.words, targetWord] });
      toast.success(`Created new target word for level ${props.level.name}`);
      setIsCreating(false);
      setTargetWord('');
      setTabooWords([]);
      router.refresh();
    });
  }

  function generateTabooWords() {
    startTransition(async () => {
      const newWord = await generateTabooWordsFromAI(targetWord, props.level.name);
      const tabooWords = newWord.taboos;
      setTabooWords(tabooWords);
    });
  }

  if (!isCreating) {
    return (
      <Button
        onClick={() => setIsCreating(true)}
        size={'sm'}
        className={'h-12 w-full rounded-none'}
      >
        Create New Target Word
      </Button>
    );
  }
  return (
    <form aria-disabled={isPending} action={submitNewTargetWord} className={'px-2'}>
      <h2 className={'my-2 text-center'}>New Target Word</h2>
      <Input
        autoFocus
        className={'h-6 rounded-none !text-[12px]'}
        name={'target'}
        value={targetWord}
        onChange={(e) => setTargetWord(e.target.value)}
        placeholder={'Create a target word...'}
      />
      {tabooWords.map((tabooWord, idx) => (
        <div key={idx} className={'my-1 flex flex-row items-center gap-1'}>
          <div className={'flex h-4 w-4 items-center justify-center'}>{idx + 1}</div>
          <Input
            autoFocus
            className={'h-4 flex-grow rounded-none !text-[12px]'}
            placeholder={'New taboo word...'}
            name={'taboo'}
            value={tabooWord}
            onChange={(e) =>
              setTabooWords([
                ...tabooWords.slice(0, idx),
                e.target.value,
                ...tabooWords.slice(idx + 1),
              ])
            }
          />
          <Button
            type={'button'}
            onClick={() =>
              setTabooWords([...tabooWords.slice(0, idx), ...tabooWords.slice(idx + 1)])
            }
            size={'sm'}
            variant={'destructive'}
            className={'aspect-square h-6 w-6 rounded-none px-1'}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      ))}
      <Button
        disabled={isPending}
        type={'button'}
        onClick={() => setTabooWords([...tabooWords, ''])}
        size={'sm'}
        variant={'outline'}
        className={'mt-2 h-6 w-full rounded-none'}
      >
        Add a new taboo word
      </Button>
      <Button
        disabled={isPending}
        type={'button'}
        onClick={generateTabooWords}
        size={'sm'}
        variant={'outline'}
        className={'h-6 w-full rounded-none'}
      >
        Generate taboo words
      </Button>

      <Button
        disabled={isPending}
        type={'submit'}
        size={'sm'}
        className={'h-6 w-full rounded-none'}
      >
        Create new target word
      </Button>
    </form>
  );
}

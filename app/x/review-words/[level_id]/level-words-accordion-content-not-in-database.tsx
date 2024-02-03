'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toLower, trim } from 'lodash';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AsyncReturnType } from 'type-fest';

import { generateTabooWordsFromAI } from '@/app/level/[id]/server/generate-taboo-words-from-ai';
import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import { fetchLevel } from '@/app/x/review-words/[level_id]/server/fetch-level';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { upsertWordWithTabooWords } from '@/lib/services/wordService';

type LevelWordsAccordionContentNotInDatabaseProps = {
  level: AsyncReturnType<typeof fetchLevel>;
  word: string;
  user?: UserProfile;
};

export function LevelWordsAccordionContentNotInDatabase(
  props: LevelWordsAccordionContentNotInDatabaseProps
) {
  const router = useRouter();
  const [tabooWords, setTabooWords] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function generateTabooWords() {
    startTransition(async () => {
      const word = await generateTabooWordsFromAI(props.word, props.level.name);
      const tabooWords = word.taboos;
      setTabooWords(tabooWords);
    });
  }

  function saveTargetWord() {
    confirmAlert({
      title: 'Save Target Word',
      description: `Are you sure you want to save the target word "${props.word}"?`,
      confirmLabel: 'Save',
      onConfirm: () => performSaveTargetWordAction(),
    });
  }

  function performSaveTargetWordAction() {
    if (tabooWords.length < 5) {
      toast.error('Please add at least 5 taboo words');
      return;
    }
    startTransition(async () => {
      await upsertWordWithTabooWords(toLower(trim(props.word)), tabooWords, true, props.user?.id);
      toast.success(`Saved target word for level ${props.level.name}`);
      router.refresh();
    });
  }

  return (
    <div>
      <div>
        This target word is not saved in the database. Hence there are no taboo words available.
      </div>
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
        className={'h-6 w-full rounded-none'}
        onClick={generateTabooWords}
      >
        Generate taboo words
      </Button>
      <Button
        disabled={isPending}
        type={'submit'}
        size={'sm'}
        className={'h-6 w-full rounded-none bg-green-500 text-white hover:bg-green-600'}
        onClick={saveTargetWord}
      >
        Save
      </Button>
    </div>
  );
}

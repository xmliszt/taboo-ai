'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toLower } from 'lodash';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { AsyncReturnType } from 'type-fest';

import { EditableRow } from '@/app/x/review-words/[level_id]/editable-row';
import { fetchLevel } from '@/app/x/review-words/[level_id]/server/fetch-level';
import { updateLevel } from '@/app/x/review-words/[level_id]/server/update-level';
import { updateTarget, updateWord } from '@/app/x/review-words/[level_id]/server/update-word';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database } from '@/lib/supabase/extension/types';

export function LevelWordsAccordionContentExistedInDatabase(props: {
  level: AsyncReturnType<typeof fetchLevel>;
  word: Database['public']['Tables']['words']['Row'];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAddingNewTabooWord, setIsAddingNewTabooWord] = useState(false);
  const [newTabooWord, setNewTabooWord] = useState<string>('');

  function submitEditTarget(data: FormData) {
    startTransition(async () => {
      const newTargetWord = data.get('value') as string;
      await updateTarget(props.word.word, newTargetWord);
      const newTargetWords = [...props.level.words];
      newTargetWords[props.level.words.indexOf(props.word.word)] = newTargetWord;
      await updateLevel(props.level.id, { words: newTargetWords });
      toast.success(`Updated target word for ${props.word.word}`);
      router.refresh();
    });
  }

  function deleteTarget(targetWord: string) {
    confirmAlert({
      title: 'Delete Target Word',
      description: `Are you sure you want to delete the target word "${targetWord}"?`,
      confirmLabel: 'Delete',
      onConfirm: () => performDeleteTargetAction(targetWord),
    });
  }

  function performDeleteTargetAction(targetWord: string) {
    startTransition(async () => {
      const newTargetWords = [...props.level.words];
      newTargetWords.splice(newTargetWords.indexOf(targetWord), 1);
      await updateLevel(props.level.id, { words: newTargetWords });
      toast.success(`Deleted target word for ${targetWord}`);
      router.refresh();
    });
  }

  function submitEdit(data: FormData, idx: number) {
    startTransition(async () => {
      const newTabooWord = toLower(data.get('value') as string);
      const newTaboos = [...props.word.taboos];
      newTaboos[idx] = newTabooWord;
      await updateWord(props.word.word, newTaboos);
      toast.success(`Updated taboo words for ${props.word.word}`);
      router.refresh();
    });
  }

  function deleteTabooWord(idx: number) {
    confirmAlert({
      title: 'Delete Taboo Word',
      description: `Are you sure you want to delete the taboo word "${props.word.taboos[idx]}"?`,
      confirmLabel: 'Delete',
      onConfirm: () => performDeleteTabooWordAction(idx),
    });
  }

  function performDeleteTabooWordAction(idx: number) {
    startTransition(async () => {
      const newTaboos = [...props.word.taboos];
      newTaboos.splice(idx, 1);
      await updateWord(props.word.word, newTaboos);
      toast.success(`Deleted taboo word for ${props.word.word}`);
      router.refresh();
    });
  }

  function addNewTabooWord(data: FormData) {
    startTransition(async () => {
      const newTabooWord = toLower(data.get('value') as string);
      const newTaboos = [...props.word.taboos, newTabooWord];
      await updateWord(props.word.word, newTaboos);
      toast.success(`Added new taboo word for ${props.word.word}`);
      router.refresh();
    });
  }

  return (
    <div>
      <EditableRow
        title={'Target word'}
        value={props.word.word}
        onSubmit={submitEditTarget}
        onDelete={() => {
          deleteTarget(props.word.word);
        }}
      />
      {props.word.taboos.map((tabooWord, idx) => (
        <EditableRow
          key={idx}
          disabled={isPending}
          title={`${idx + 1}`}
          value={tabooWord}
          onSubmit={(data) => {
            submitEdit(data, idx);
          }}
          onDelete={() => deleteTabooWord(idx)}
        />
      ))}
      <form
        action={(data) => {
          addNewTabooWord(data);
          setIsAddingNewTabooWord(false);
        }}
      >
        {!isAddingNewTabooWord ? (
          <Button
            className={'h-6 w-full rounded-none text-center'}
            onClick={() => {
              setIsAddingNewTabooWord(true);
            }}
          >
            Add a new taboo word
          </Button>
        ) : (
          <div className={'flex flex-row items-center gap-2 p-1'}>
            <Input
              autoFocus
              className={'h-4 flex-grow rounded-none !text-[12px]'}
              placeholder={'New taboo word...'}
              name={'value'}
              value={newTabooWord}
              onChange={(event) => setNewTabooWord(event.target.value)}
            />
            <div className={'flex flex-row items-center'}>
              <Button
                className={'h-6 w-6 rounded-none px-1'}
                type='submit'
                disabled={isPending || newTabooWord.length === 0}
              >
                <Check size={15} />
              </Button>
              <Button
                className={'h-6 w-6 rounded-none px-1'}
                onClick={() => {
                  setIsAddingNewTabooWord(false);
                  setNewTabooWord('');
                }}
              >
                <X size={15} />
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

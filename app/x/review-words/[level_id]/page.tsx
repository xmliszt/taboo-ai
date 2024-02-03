import { revalidatePath } from 'next/cache';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { CreateNewTargetWordSection } from '@/app/x/review-words/[level_id]/create-new-target-word-section';
import { EditableRow } from '@/app/x/review-words/[level_id]/editable-row';
import { LevelVerificationSection } from '@/app/x/review-words/[level_id]/level-verification-section';
import { LevelWordsAccordion } from '@/app/x/review-words/[level_id]/level-words-accordion';
import { NewLevelButtonGroup } from '@/app/x/review-words/[level_id]/new-level-button-group';
import { NonEditableRow } from '@/app/x/review-words/[level_id]/non-editable-row';
import { fetchAllWords } from '@/app/x/review-words/[level_id]/server/fetch-all-words';
import { updateLevel } from '@/app/x/review-words/[level_id]/server/update-level';
import { ScrollArea } from '@/components/ui/scroll-area';

import { fetchLevel } from './server/fetch-level';

type ReviewWordsLevelPageProps = {
  params: {
    level_id: string;
  };
};

export default async function ReviewWordsLevelPage(props: ReviewWordsLevelPageProps) {
  const user = await fetchUserProfile();
  const [level, allWords] = await Promise.all([fetchLevel(props.params.level_id), fetchAllWords()]);

  return (
    <ScrollArea>
      {/* Edit a general topic information section */}
      <section className={'border border-ring p-2 pb-0'}>
        <h2 className={'text-center text-xl font-bold'}>Level Details</h2>
        <EditableRow
          title={'Name'}
          value={level.name}
          onSubmit={async (data) => {
            'use server';
            await updateLevel(level.id, { name: data.get('value') });
            revalidatePath('/x/review-words');
          }}
        />
        <NonEditableRow
          title={'Author'}
          value={level.author?.nickname ?? level.author?.name ?? 'Unknown'}
        />
        <NonEditableRow title={"Author's email"} value={level.author?.email ?? 'Unknown'} />
        <EditableRow
          title={'Difficulty'}
          value={level.difficulty.toString()}
          type={'number'}
          onSubmit={async (data) => {
            'use server';
            if (Number(data.get('value')) < 1 || Number(data.get('value')) > 3) {
              throw new Error('Difficulty must be between 1 and 3');
            }
            await updateLevel(level.id, { difficulty: Number(data.get('value')) });
            revalidatePath('/x/review-words');
          }}
        />
        <NonEditableRow title={'Created at'} value={new Date(level.created_at).toDateString()} />
        <NonEditableRow title={'Popularity'} value={level.popularity.toString()} />
        <NonEditableRow title={'Verified'} value={level.is_verified ? 'YES' : 'NO'} />
        <NonEditableRow title={'New'} value={level.is_new ? 'YES' : 'NO'} />
      </section>
      <NewLevelButtonGroup levelId={level.id} />
      {/* Edit individual target word section */}
      <LevelWordsAccordion level={level} words={level.words} allWords={allWords} />
      {/* Create new target word section */}
      <CreateNewTargetWordSection level={level} user={user} />
      {/* Verification section */}
      {level.author !== null && <LevelVerificationSection level={level} />}
    </ScrollArea>
  );
}

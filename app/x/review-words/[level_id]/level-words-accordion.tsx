import { AsyncReturnType } from 'type-fest';

import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import { LevelWordVerificationSection } from '@/app/x/review-words/[level_id]/level-word-verification-section';
import { LevelWordsAccordionContentNotInDatabase } from '@/app/x/review-words/[level_id]/level-words-accordion-content-not-in-database';
import { fetchLevel } from '@/app/x/review-words/[level_id]/server/fetch-level';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/supabase/extension/types';

import { LevelWordsAccordionContentExistedInDatabase } from './level-words-accordion-content-existed-in-database';

type LevelWordsAccordionProps = {
  level: AsyncReturnType<typeof fetchLevel>;
  words: string[];
  wordsInDatabase: Database['public']['Tables']['words']['Row'][];
  user?: UserProfile;
};

export function LevelWordsAccordion(props: LevelWordsAccordionProps) {
  return (
    <Accordion collapsible={true} type={'single'} defaultValue={props.words[0]} className={'px-2'}>
      {props.words.map((word) => (
        <AccordionItem key={word} value={word}>
          <AccordionTrigger>
            <div className={'flex flex-row items-center gap-4'}>
              {word}
              <Badge variant={'outline'}>
                {props.wordsInDatabase.find((w) => w.word === word)?.is_verified
                  ? 'verified'
                  : '[x] not verified'}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className={'w-full border-b pb-2 text-center font-bold'}>Taboo Words</div>
            {props.wordsInDatabase.find((w) => w.word === word) ? (
              <LevelWordsAccordionContentExistedInDatabase
                level={props.level}
                word={props.wordsInDatabase.find((w) => w.word === word)!}
              />
            ) : (
              <LevelWordsAccordionContentNotInDatabase
                level={props.level}
                word={word}
                user={props.user}
              />
            )}
            <LevelWordVerificationSection targetWord={word} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

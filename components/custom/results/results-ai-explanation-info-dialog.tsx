import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ResultsAiExplanationInfoDialogProps = {
  pro: boolean;
};

export function ResultsAiExplanationInfoDialog(props: ResultsAiExplanationInfoDialogProps) {
  return (
    <Popover>
      <PopoverTrigger asChild className='mr-1 inline hover:cursor-pointer'>
        <Sparkles size={15} className='animate-pulse' />
      </PopoverTrigger>
      <PopoverContent className='border border-muted-foreground bg-muted leading-snug text-card-foreground'>
        {props.pro ? (
          <span>
            You are on Pro plan, which unlocks exclusive AI-suggested hints with correct grammar and
            creative word choices for giving you additional insights on how to improve your writing.
          </span>
        ) : (
          <span>
            You are on FREE plan, which only provides basic AI evaluation and feedbacks. To unlock
            exclusive AI-suggested hints with correct grammar and creative word choices, consider{' '}
            <Link href='/pricing' className='underline'>
              becoming a Pro member
            </Link>
            .
          </span>
        )}
      </PopoverContent>
    </Popover>
  );
}

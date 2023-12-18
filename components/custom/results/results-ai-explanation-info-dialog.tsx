import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ResultsAiExplanationInfoDialogProps = {
  isAuthenticated: boolean;
};

export function ResultsAiExplanationInfoDialog(props: ResultsAiExplanationInfoDialogProps) {
  return (
    <Popover>
      <PopoverTrigger asChild className='mr-1 inline hover:cursor-pointer'>
        <Sparkles size={15} className='animate-pulse' />
      </PopoverTrigger>
      <PopoverContent className='border border-muted-foreground bg-muted leading-snug text-card-foreground'>
        {props.isAuthenticated ? (
          <span>
            You are on PRO plan. This AI explanation is powered by our most advanded AI model. It
            can provide you with more constructive feedbacks. It also suggests improvements on
            English grammar, word choice, sentence structure, creativity, and more.
          </span>
        ) : (
          <span>
            Here is a basic AI evaluation Taboo AI provides for you free of charge. If you want to
            gain more insights about your performance, get more constructive feedbacks, get
            intelligent suggestions from AI on how to improve your English grammar, word choice,
            sentence structure, creativity and much more. Consider{' '}
            <Link href='/pricing' className='underline'>
              subscribing to our PRO plan
            </Link>
            .
          </span>
        )}
      </PopoverContent>
    </Popover>
  );
}

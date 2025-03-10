'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PenTool } from 'lucide-react';
import { useTheme } from 'next-themes';

import { generateAITopic } from '@/app/ai/server/generate-ai-topic';
import { useAskForFeedback } from '@/components/ask-for-feedback-provider';
import { useAuth } from '@/components/auth-provider';
import { HoverPerspectiveContainer } from '@/components/custom/common/hover-perspective-container';
import { SignInReminderProps } from '@/components/custom/globals/sign-in-reminder-dialog';
import { Spinner } from '@/components/custom/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CONSTANTS } from '@/lib/constants';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { HASH } from '@/lib/hash';
import { setPersistence } from '@/lib/persistence/persistence';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AiPage() {
  useAskForFeedback();
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();

  const { resolvedTheme } = useTheme();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    // User must login to use AI mode
    if (!user) {
      EventManager.fireEvent<SignInReminderProps>(CustomEventKey.SIGN_IN_REMINDER, {
        title: 'Please sign in to use AI mode.',
        redirectHref: `/ai`,
      });
      return;
    }

    if (topic.length > 0) {
      setIsLoading(true);
      try {
        // form-event using server action
        const level = await generateAITopic(topic, Number(difficulty));
        if (level) {
          if (level.words.length < CONSTANTS.numberOfQuestionsPerGame) {
            return toast.error(CONSTANTS.errors.aiModeTopicTooFew);
          }
          setPersistence(HASH.level, level);
          router.push('/level/ai');
        } else {
          toast.error(CONSTANTS.errors.overloaded);
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong. Please try again!');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Topic cannot be blank.');
    }
  };

  return (
    <>
      <main className='flex flex-col items-center justify-center gap-y-4 px-10 py-8'>
        <div
          className={cn(
            'h-52 w-52 p-4 lg:h-64 lg:w-64 lg:p-8',
            isLoading
              ? 'animate-dynamic-breath [animation-duration:2000ms] [transition-duration:2000ms]'
              : 'animate-none'
          )}
        >
          <HoverPerspectiveContainer
            className={cn(
              'rounded-lg shadow-xl',
              isLoading
                ? 'animate-dynamic-spin [animation-duration:2000ms] [transition-duration:2000ms] [animation-timing-function:cubic-bezier(.5856,.0703,.4143,.9297)]'
                : 'animate-none duration-300'
            )}
          >
            <Image
              className='rounded-lg'
              src={
                resolvedTheme === 'dark'
                  ? 'https://github.com/xmliszt/resources/blob/main/taboo-ai/images/ai-mode-dark.png?raw=true'
                  : 'https://github.com/xmliszt/resources/blob/main/taboo-ai/images/ai-mode-light.png?raw=true'
              }
              alt='AI Mode'
              width={600}
              height={600}
            />
            <div
              className={cn(
                'unicorn-color absolute left-0 top-0 -z-10 h-full w-full rounded-lg after:blur-lg',
                isLoading ? 'animate-fade-inout' : 'animate-none'
              )}
            ></div>
          </HoverPerspectiveContainer>
        </div>
        <form onSubmit={submitForm}>
          <div className='flex max-w-xl flex-col items-center justify-center gap-y-8'>
            <div className='flex flex-col items-center justify-center gap-y-2'>
              <Input
                aria-label='topic input field'
                aria-placeholder='for example: Planets'
                autoFocus
                id='topicInput'
                type='text'
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder='Enter a topic: e.g. planets'
                maxLength={50}
                disabled={isLoading}
                className='w-full'
              />
              <label
                htmlFor='topicInput'
                className='text-xs leading-normal text-muted-foreground'
                aria-label='AI Mode Explanation'
              >
                Enter a topic and Taboo AI will generate a list of words for you to guess.
              </label>
            </div>
            <div className='flex w-full flex-col items-end gap-y-2'>
              <Label htmlFor='difficulty' className='text-xs text-muted-foreground'>
                Difficulty level
              </Label>
              <RadioGroup
                name='difficulty'
                id='difficulty'
                value={difficulty}
                aria-label='select difficulty'
                onValueChange={(v) => {
                  setDifficulty(v);
                }}
                className='flex flex-row gap-2'
              >
                <div className='flex flex-row items-center gap-2'>
                  <RadioGroupItem id='difficulty-1' value='1' />
                  <Label htmlFor='difficulty-1'>Easy</Label>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <RadioGroupItem id='difficulty-2' value='2' />
                  <Label htmlFor='difficulty-2'>Medium</Label>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <RadioGroupItem id='difficulty-3' value='3' />
                  <Label htmlFor='difficulty-3'>Hard</Label>
                </div>
              </RadioGroup>
            </div>
            {isLoading ? (
              <Button className='w-full' disabled>
                <Spinner />
              </Button>
            ) : (
              <Button
                type='submit'
                className='w-max px-6'
                aria-label='Confirm to submit your input'
              >
                <div className='flex flex-row items-center gap-2'>
                  <PenTool className='size-4' />
                  Generate a topic
                </div>
              </Button>
            )}
          </div>
        </form>
      </main>
    </>
  );
}

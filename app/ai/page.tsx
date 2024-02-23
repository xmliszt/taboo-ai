'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PenTool, SpellCheck2 } from 'lucide-react';
import { useTheme } from 'next-themes';

import { generateAITopic } from '@/app/ai/server/generate-ai-topic';
import { useAuth } from '@/components/auth-provider';
import { HoverPerspectiveContainer } from '@/components/custom/common/hover-perspective-container';
import { confirmAlert } from '@/components/custom/globals/generic-alert-dialog';
import { Spinner } from '@/components/custom/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CONSTANTS } from '@/lib/constants';
import { tryParseErrorAsGoogleAIError } from '@/lib/errors/google-ai-error-parser';
import { HASH } from '@/lib/hash';
import { setPersistence } from '@/lib/persistence/persistence';

export default function AiPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('1');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const isLocked = !user || user.subscription?.customer_plan_type === 'free';

  const { resolvedTheme } = useTheme();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    if (isLocked) {
      confirmAlert({
        title: 'Subscribe to pro plan to unlock AI generated topics!',
        description:
          'AI generated topics are exclusive to pro plan subscribers. Become a pro player and enjoy the endless possibilities from our intelligent AI.',
        confirmLabel: 'See pricing plans',
        onConfirm: () => {
          router.push('/pricing');
        },
      });
      return;
    }
    if (topic.length > 0) {
      setIsLoading(true);
      try {
        const level = await generateAITopic(topic, Number(difficulty));
        if (level) {
          if (level.words.length < CONSTANTS.numberOfQuestionsPerGame) {
            return setErrorMessage(CONSTANTS.errors.aiModeTopicTooFew);
          }
          setPersistence(HASH.level, level);
          router.push('/level/ai');
        } else {
          setErrorMessage(CONSTANTS.errors.overloaded);
        }
      } catch (error) {
        try {
          const googleError = tryParseErrorAsGoogleAIError(error, 'topic-generation');
          setErrorMessage(googleError.message);
        } catch (error) {
          console.error(error);
          setErrorMessage('Something went wrong. Please try again!');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Topic cannot be blank.');
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    setErrorMessage(undefined);
  };

  return (
    <>
      <main className='flex flex-col items-center px-10 py-8'>
        <div className='h-52 w-52 p-4 lg:h-64 lg:w-64 lg:p-8'>
          <HoverPerspectiveContainer className='rounded-lg shadow-xl'>
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
            <div className='unicorn-color absolute left-0 top-0 -z-10 h-full w-full rounded-lg after:blur-lg'></div>
          </HoverPerspectiveContainer>
        </div>
        {errorMessage !== undefined && (
          <Alert className='mb-8 max-w-xl animate-fade-in border-red-500 text-center font-extrabold text-red-500'>
            <SpellCheck2 color='red' />
            <AlertTitle className='leading-snug'>{errorMessage}</AlertTitle>
          </Alert>
        )}
        <form onSubmit={submitForm}>
          <div className='flex max-w-xl flex-col items-center justify-center gap-6'>
            <label
              htmlFor='topicInput'
              className='text-center text-sm leading-normal lg:text-base'
              aria-label='AI Mode Explanation'
            >
              Enter a topic and Taboo AI will generate a list of words for you to guess. The
              difficulty level will determine how easy or hard the words are.
            </label>
            <Input
              aria-label='topic input field'
              aria-placeholder='for example: Planets'
              autoFocus
              id='topicInput'
              type='text'
              value={topic}
              onChange={onInputChange}
              placeholder='Enter a topic: e.g. planets'
              maxLength={50}
              disabled={isLoading}
              className='w-full'
            />
            <Label htmlFor='difficulty'>Choose a difficulty level</Label>
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
            {isLoading ? (
              <Button className='w-full' disabled>
                <Spinner />
              </Button>
            ) : (
              <Button type='submit' className='w-full' aria-label='Confirm to submit your input'>
                <div className='flex flex-row items-center gap-2'>
                  <PenTool />
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

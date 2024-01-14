'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenTool, SpellCheck2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/auth-provider';
import { Spinner } from '@/components/custom/spinner';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CONSTANTS } from '@/lib/constants';
import { HASH } from '@/lib/hash';
import { setPersistence } from '@/lib/persistence/persistence';
import { askAIForCreativeTopic } from '@/lib/services/aiService';

export default function AiPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('1');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const isLocked = !user || user.subscription?.customer_plan_type === 'free';

  useEffect(() => {
    if (isLocked) {
      toast.info('You need a paid subscription to access this feature');
      router.push('/pricing');
    }
  }, [isLocked]);

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    if (topic.length > 0) {
      setIsLoading(true);
      try {
        const level = await askAIForCreativeTopic(topic, Number(difficulty));
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
        setErrorMessage(error.message ?? 'Something went wrong.');
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

  if (isLocked)
    return <main className='flex h-full w-full flex-col items-center px-10 pt-20'></main>;

  return (
    <>
      <main className='flex flex-col items-center px-10 pt-8'>
        {errorMessage !== undefined && (
          <Alert className='mb-8 animate-fade-in border-red-500 text-center font-extrabold text-red-500'>
            <SpellCheck2 color='red' />
            <AlertTitle className='leading-snug'>{errorMessage}</AlertTitle>
          </Alert>
        )}
        <form onSubmit={submitForm}>
          <div className='flex flex-col items-center justify-center gap-6'>
            <label
              htmlFor='topicInput'
              className='text-center text-base leading-normal'
              aria-label='AI Mode Explanation'
            >
              In &quot;AI Mode&quot;, the topic you give will be used by the AI to come up with{' '}
              <b>guess words</b> for your Taboo game. This means you&apos;re getting a custom-made
              game instead of using preset topics. The <b>Difficulty Level</b> determine how hard
              the words will be in the game.
            </label>
            <Input
              aria-label='topic input field'
              aria-placeholder='for example: Planets'
              autoFocus
              id='topicInput'
              type='text'
              value={topic}
              onChange={onInputChange}
              placeholder='Enter Topic: e.g. Planets'
              maxLength={50}
              disabled={isLoading}
              className='w-full'
            />
            <Label htmlFor='difficulty'>Difficulty Level</Label>
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
              <Button className='mt-8 w-full' disabled>
                <Spinner />
              </Button>
            ) : (
              <Button
                type='submit'
                className='mt-8 w-full'
                aria-label='Confirm to submit your input'
              >
                <div className='flex flex-row items-center gap-2'>
                  <PenTool />
                  Generate
                </div>
              </Button>
            )}
          </div>
        </form>
      </main>
    </>
  );
}

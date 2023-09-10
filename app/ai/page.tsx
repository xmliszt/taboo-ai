'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { askAIForCreativeTopic } from '../../lib/services/aiService';
import { CONSTANTS } from '../../lib/constants';
import { useRouter } from 'next/navigation';
import { cacheLevel } from '../../lib/cache';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { PenTool, SpellCheck2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/custom/spinner';

interface AiPageProps {}

export default function AiPage(props: AiPageProps) {
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('1');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

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
          cacheLevel(level);
          router.push('/level');
        } else {
          throw new Error(CONSTANTS.errors.overloaded);
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

  return (
    <>
      <section className='w-full h-full flex flex-col items-center pt-20 px-10'>
        {errorMessage !== undefined && (
          <Alert className='text-center animate-fade-in font-extrabold text-2xl mb-8'>
            <SpellCheck2 color='red' />
            <AlertTitle className='leading-snug'>{errorMessage}</AlertTitle>
          </Alert>
        )}
        <form onSubmit={submitForm}>
          <div className='flex flex-col gap-6 justify-center items-center'>
            <label
              htmlFor='topicInput'
              className='text-base text-center leading-normal'
              aria-label='AI Mode Explanation'
            >
              In &quot;AI Mode&quot;, the topic you give will be used by the AI
              to come up with <b>guess words</b> for your Taboo game. This means
              you&apos;re getting a custom-made game instead of using preset
              topics. The <b>Difficulty Level</b> determine how hard the words
              will be in the game.
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
              <div className='flex flex-row gap-2 items-center'>
                <RadioGroupItem id='difficulty-1' value='1' />
                <Label htmlFor='difficulty-1'>Easy</Label>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <RadioGroupItem id='difficulty-2' value='2' />
                <Label htmlFor='difficulty-2'>Medium</Label>
              </div>
              <div className='flex flex-row gap-2 items-center'>
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
                <div className='flex flex-row gap-2 items-center'>
                  <PenTool />
                  Generate
                </div>
              </Button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';

import ruleContent from './rule.md';

export default function RulePage() {
  const router = useRouter();
  return (
    <main className='flex h-full w-full flex-col px-8 pb-4 pt-20 lg:px-48 lg:pt-32'>
      <article className='leading-snug'>
        <ReactMarkdown>{ruleContent}</ReactMarkdown>
      </article>
      <div className='flex flex-row items-center justify-start gap-8'>
        <Button
          id='start'
          data-testid='link-start'
          data-style='none'
          onClick={() => {
            router.push('/levels');
          }}
        >
          Choose Topics
        </Button>
      </div>
      <hr className='my-4' />
      <p className='text-gray mt-2 text-justify text-xs leading-tight'>
        Disclaimer: Please note that Taboo AI relies solely on{' '}
        <a className='underline' href='https://openai.com/api/pricing/'>
          OpenAI AI Model
        </a>{' '}
        for generating responses and taboo words. In the event that the API experiences overload due
        to high traffic, you may encounter some internet hiccups while playing the game. However,
        don&apos;t worry! Just try submitting your prompt again until it succeeds. The timer will be
        paused so that you won&apos;t be at a disadvantage if this occurs. Typically, after a
        maximum of five tries, you should be able to get your response.
      </p>
    </main>
  );
}

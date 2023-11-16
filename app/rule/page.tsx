'use client';

import ReactMarkdown from 'react-markdown';
import ruleContent from './rule.md';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function RulePage() {
  const router = useRouter();
  return (
    <section className='w-full h-full flex flex-col pt-20 px-8 lg:px-48 lg:pt-32 pb-4'>
      <article className='leading-snug'>
        <ReactMarkdown>{ruleContent}</ReactMarkdown>
      </article>
      <div className='flex flex-row justify-start gap-8 items-center'>
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
      <p className='text-justify text-gray text-xs leading-tight mt-2'>
        Disclaimer: Please note that Taboo AI relies solely on{' '}
        <a className='underline' href='https://openai.com/api/pricing/'>
          OpenAI AI Model
        </a>{' '}
        for generating responses and taboo words. In the event that the API
        experiences overload due to high traffic, you may encounter some
        internet hiccups while playing the game. However, don&apos;t worry! Just
        try submitting your prompt again until it succeeds. The timer will be
        paused so that you won&apos;t be at a disadvantage if this occurs.
        Typically, after a maximum of five tries, you should be able to get your
        response.
      </p>
    </section>
  );
}

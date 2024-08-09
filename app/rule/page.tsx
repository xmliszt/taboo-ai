'use client';

import { useRouter } from 'next/navigation';
import RuleMDX from 'mdx-contents/rule.mdx';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function RulePage() {
  const router = useRouter();
  return (
    <main className='flex flex-col items-center gap-4 px-8 py-8 lg:px-48'>
      <article className='max-w-xl leading-snug'>
        <RuleMDX />
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
          Play now
        </Button>
      </div>
      <Separator className='max-w-xl' />
      <p className='text-gray mt-2 max-w-xl text-justify text-xs leading-tight'>
        Disclaimer: Please note that Taboo AI relies on OpenAI ChatGPT for generating responses and
        taboo words. In the event that the API experiences overload due to high traffic, you may
        encounter some internet hiccups while playing the game. However, don&apos;t worry! Just try
        submitting your prompt again until it succeeds. The timer will be paused so that you
        won&apos;t be at a disadvantage if this occurs. Typically, after a maximum of five tries,
        you should be able to get your response.
      </p>
    </main>
  );
}

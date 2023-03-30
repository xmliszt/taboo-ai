'use client';

import Link from 'next/link';

interface RulePageProps {}

export default function RulePage(props: RulePageProps) {
  return (
    <section className='flex justify-center'>
      <h1
        data-testid='heading-rule-title'
        className='h-32 fixed top-0 z-50 leading-normal text-white pt-4 text-xl'
      >
        How To Play Taboo.AI?
      </h1>
      <section className='w-full h-full flex flex-col pt-20 px-8 lg:px-48 lg:pt-32 lg:text-2xl'>
        <article className='leading-normal'>
          <p className='text-center dark:text-neon-white'>
            Taboo.AI is a game of <b>Taboo</b> with a twist. In this game, you
            are playing against AI!
          </p>
        </article>
        <br />
        <article className='leading-normal'>
          <hr />
          <p className='text-center text-lg lg:text-3xl font-bold mt-4'>
            <b>Guess Words</b> will be given to you. Your job is to converse
            with the AI and trick it into saying the &apos;Guess Words&apos;.
            However, you cannot include the <b>Taboo Words</b> in your prompt!
          </p>
          <hr />
          <br />
          <p className='text-justify'>
            1. Select a category of words, or choose the <b>AI MODE</b> to let
            AI generate the <b>Guess Words</b> based on custom topics!{' '}
          </p>
          <p className='text-justify'>
            2. Start your conversation with the AI and try to trick it into
            speaking out the <b>Guess Words</b>. Watch the <b>Timer</b>, the
            longer you spend talking to the AI, the lower your score will be
            eventually!
          </p>
          <p className='text-justify'>
            3. Successfully trick AI into saying <b>all 5 words</b> given to win
            the game. You can view your scores and share them with your friends!
          </p>
          <div className='flex flex-row justify-start gap-8 items-center'>
            <Link
              id='start'
              href='/levels'
              data-testid='link-start'
              className='px-4 py-2'
            >
              Choose Topics to Start Playing!
            </Link>
          </div>
          <br />
          <hr />
          <br />
          <p className='text-justify'>
            Participate in the <b>Daily Challenge</b>: Same game rule, but 5
            different words every day. Use your scores to compete against other
            players around the world in the <b>Wall of Fame (Leaderboard)</b>
          </p>
          <div className='flex flex-row justify-start gap-8 items-center'>
            <Link
              id='daily-challenge'
              href='/daily-challenge/loading'
              data-testid='link-daily-challenge'
            >
              <div className='px-4 py-2 color-gradient-animated-background'>
                Daily Challenge
              </div>
            </Link>
            <Link
              id='daily-wall-of-fame'
              href='/leaderboard'
              data-testid='link-daily-wall-of-fame'
            >
              <div className='px-4 py-2 color-gradient-animated-background-golden'>
                Daily Wall of Fame
              </div>
            </Link>
          </div>
          <br />
          <p className='text-justify text-gray text-sm'>
            Disclaimer: The game is solely relying on{' '}
            <a className='underline' href='https://openai.com/api/pricing/'>
              OpenAI AI Model
            </a>{' '}
            to generate responses and taboo words. Without it, the game will not
            be possible. However, sometimes even paid model has overloaded
            requests from all over the world. Hence you might experience some
            internet hiccups here and there. But not to worry! Just simply try
            again and submit your prompt again until it succeeds. (Usually the
            downtime won&apos;t be that long, after at most 5 tries you should
            be able to get your reponse!) Timer will be paused for you so you
            won&apos;t be at disadvantage if such incident happens 😉
          </p>
        </article>
      </section>
    </section>
  );
}

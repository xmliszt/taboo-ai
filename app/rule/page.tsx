'use client';

import BackButton from '../(components)/BackButton';

export default function RulePage() {
  return (
    <>
      <BackButton href='/' />
      <h1
        data-testid='heading-rule-title'
        className='fixed w-full top-0 h-14 lg:h-20 pt-4 lg:pt-6 text-center text-white z-40 bg-gray dark:bg-neon-gray rounded-b-2xl drop-shadow-lg'
      >
        How To Play Taboo.AI?
      </h1>
      <section className='w-full h-full flex flex-col pt-20 px-8 lg:px-48 lg:pt-32 lg:text-2xl'>
        <article>
          <p className='text-center dark:text-neon-white'>
            Taboo.AI is a game of <b>Taboo</b> with a twist. In this game, you
            are playing against AI!
          </p>
        </article>
        <br />
        <article>
          <p className='text-center text-lg lg:text-3xl font-bold text-yellow dark:text-neon-green'>
            <b>Guess Words</b> will be given to you. Your job is to converse
            with the AI and trick it into saying the &apos;Guess Words&apos;.
          </p>
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
        </article>
      </section>
    </>
    // </section>
  );
}

import BackButton from '../(components)/BackButton';

export default function RulePage() {
  return (
    <>
      <BackButton />
      <h1 className='fixed w-full top-0 h-10 pt-4 lg:pt-6 text-center text-xl lg:text-3xl text-white z-40 bg-black dark:bg-neon-black'>
        How To Play Taboo.AI?
      </h1>
      <section className='w-full h-full pt-20 pb-16 px-12 flex justify-center items-center overflow-hidden drop-shadow-lg'>
        <article className='w-full h-full lg:w-[80%] bg-gray dark:bg-neon-gray dark:text-neon-white text-white p-6 rounded-xl drop-shadow-xl overflow-y-scroll text-md lg:text-2xl'>
          <p className='text-center dark:text-neon-white'>
            Taboo.AI has only one simple rule
          </p>
          <br />
          <h3 className='text-center text-lg lg:text-3xl font-bold text-yellow dark:text-neon-green'>
            Talk to the AI and try to trick it into speaking out the
            &apos;Taboo&apos; word shown on top of the screen.
          </h3>

          <br />
          <p className='text-justify'>
            1. Select a category of words, or choose the <b>AI MODE</b> to give
            AI a topic and let AI generates the <b>TABOO</b> words for you!{' '}
          </p>
          <br />
          <p className='text-justify'>
            2. Start your conversation with the AI and try to trick it into
            speaking out the <b>TABOO</b> word.
          </p>
          <br />
          <p className='text-justify'>
            3. Complete all 5 words to see your scores and share with your
            friends!
          </p>
        </article>
      </section>
    </>
  );
}

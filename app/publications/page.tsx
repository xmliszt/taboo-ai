export default function PublicationsPage() {
  return (
    <main className='flex h-full w-full flex-col items-center gap-4 px-8 py-6'>
      <div className='flex max-w-xl flex-col gap-4 px-4 text-center text-base text-foreground'>
        <h2 className='text-2xl font-bold'>Subscribe to my newsletter</h2>
        <p>Receive the latest updates about Taboo AI, and more about AI & creative learning 🚀</p>
      </div>
      <div className='relative flex w-full min-w-[24rem] max-w-xl flex-col gap-4'>
        <iframe
          src='https://liyuxuan.substack.com/embed'
          width='100%'
          height='550'
          style={{ fontFamily: 'lora' }}
          className='w-full rounded-lg border-[1px] bg-card text-card-foreground shadow-lg'
        ></iframe>
      </div>
      <div className='flex max-w-xl flex-col gap-4 px-4 text-center text-base text-foreground'>
        <h2 className='text-2xl font-bold'>Check out my blogs</h2>
      </div>
      <div className='relative flex w-full min-w-[24rem] max-w-xl flex-col'>
        <iframe
          src='https://liyuxuan.dev/blogs'
          width='100%'
          height='750px'
          className='w-full rounded-lg border-[1px] shadow-lg'
        ></iframe>
      </div>
    </main>
  );
}

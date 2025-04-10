import CoffeeMDX from 'mdx-contents/coffee.mdx';

import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  return (
    <main className='h-screen'>
      <ScrollArea className='h-full w-full'>
        <div className='flex w-full flex-col items-center gap-y-4 px-8 py-12'>
          <div className='size-32 overflow-hidden rounded-full shadow-[inset_0_10px_10px_rgba(0,0,0,1)] sm:size-40'>
            <Image
              alt='profile_picture'
              src='/images/profile.png'
              width={400}
              height={400}
              unoptimized
            />
          </div>
          <article data-testid='content-article' className='max-w-xl pb-24 pt-8 leading-normal'>
            <CoffeeMDX />
          </article>
          <div className='sticky bottom-8 z-40 mt-2 flex w-full justify-center gap-2 px-2'>
            <a href='https://ko-fi.com/F1F61D9VRE' target='_blank'>
              <Image
                width={144}
                height={36}
                className='border-none'
                src='https://storage.ko-fi.com/cdn/kofi6.png?v=6'
                alt='Buy Me a Coffee at ko-fi.com'
              />
            </a>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
}

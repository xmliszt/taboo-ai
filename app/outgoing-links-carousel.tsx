'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

export function OutgoingLinksCarousel() {
  return (
    <div className='relative w-full'>
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className='flex w-full items-center justify-center py-4'
      >
        <CarouselContent>
          <CarouselItem key={1} className='flex items-center justify-center'>
            <a
              className='rounded-md shadow-lg transition-all hover:scale-[1.02] hover:opacity-70'
              href='https://www.producthunt.com/posts/taboo-ai?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
              target='_blank'
            >
              <Image
                src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=387037&theme=light'
                alt='Taboo&#0032;AI - Ignite&#0032;English&#0032;learning&#0032;in&#0032;game&#0032;of&#0032;Taboo&#0044;&#0032;with&#0032;AI | Product Hunt'
                width='240'
                height='50'
              />
            </a>
          </CarouselItem>
          <CarouselItem key={2} className='flex items-center justify-center'>
            <a
              className='rounded-md shadow-lg transition-all hover:scale-[1.02] hover:opacity-70'
              href='https://www.producthunt.com/posts/taboo-ai?utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
              target='_blank'
            >
              <Image
                src='https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=387037&theme=light&period=weekly&topic_id=204'
                alt='Taboo&#0032;AI - Ignite&#0032;English&#0032;learning&#0032;in&#0032;game&#0032;of&#0032;Taboo&#0044;&#0032;with&#0032;AI | Product Hunt'
                width='240'
                height='50'
              />
            </a>
          </CarouselItem>
          <CarouselItem key={3} className='flex items-center justify-center'>
            <a
              className='rounded-md shadow-lg transition-all hover:scale-[1.02] hover:opacity-70'
              href='https://theresanaiforthat.com/ai/taboo-ai/?ref=embed'
              target='_blank'
              rel='noreferrer'
            >
              <Image
                alt="TabooAI is featured on THERE'S AN AI FOR THAT"
                width='240'
                height='65'
                src='https://media.theresanaiforthat.com/featured4.png'
              />
            </a>
          </CarouselItem>
          <CarouselItem
            key={5}
            className='flex items-center justify-center transition-all hover:scale-[1.02] hover:opacity-70'
          >
            <Link
              href={
                'https://larryferlazzo.edublogs.org/2023/02/25/this-online-taboo-game-using-artificial-intelligence-is-fun-can-be-a-language-learning-tool-for-ells/'
              }
              target={'_blank'}
            >
              <div className='flex items-center justify-center px-4 py-4 md:px-24'>
                <div className='flex flex-col gap-y-2 rounded-md border bg-secondary p-4 text-center text-secondary-foreground shadow-md'>
                  <div className='line-clamp-2 text-xs text-muted-foreground'>
                    This Online &quot;Taboo&quot; Game Using Artificial Intelligence Is Fun & Can Be
                    A Language Learning Tool For ELLs
                  </div>
                  <span className='text-xs text-foreground'>by Larry Ferlazzo</span>
                </div>
              </div>
            </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Left blur overlay */}
      <div className='pointer-events-none absolute left-0 top-0 z-10 h-full w-16 mix-blend-color-dodge backdrop-blur-md [mask-image:linear-gradient(to_right,black,transparent)]'></div>
      {/* Right blur overlay */}
      <div className='pointer-events-none absolute right-0 top-0 z-10 h-full w-16 mix-blend-color-dodge backdrop-blur-md [mask-image:linear-gradient(to_left,black,transparent)]'></div>
    </div>
  );
}

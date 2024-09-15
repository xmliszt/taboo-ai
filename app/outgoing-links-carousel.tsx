'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function OutgoingLinksCarousel() {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className='flex w-full items-center justify-center py-4'
    >
      <CarouselPrevious className='!relative !left-0 !top-0 !flex !aspect-square !translate-x-0 !translate-y-0 !rounded-lg !border-none' />
      <CarouselContent>
        <CarouselItem key={1} className='flex items-center justify-center'>
          <a
            className='rounded-md transition-all hover:scale-105 hover:opacity-70'
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
            className='rounded-md transition-all hover:scale-105 hover:opacity-70'
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
            className='rounded-md transition-all hover:scale-105 hover:opacity-70'
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
          className='flex items-center justify-center transition-all hover:scale-105 hover:opacity-70'
        >
          <Link
            href={
              'https://larryferlazzo.edublogs.org/2023/02/25/this-online-taboo-game-using-artificial-intelligence-is-fun-can-be-a-language-learning-tool-for-ells/'
            }
            target={'_blank'}
          >
            <div className='h-full rounded-md border bg-secondary p-4 text-center text-secondary-foreground'>
              <div className='text-base font-bold'>
                This Online “Taboo” Game Using Artificial Intelligence Is Fun & Can Be A Language
                Learning Tool For ELLs
              </div>
              <span>by Larry Ferlazzo</span>
            </div>
          </Link>
        </CarouselItem>
      </CarouselContent>
      <CarouselNext className='!relative !right-0 !top-0 !flex !aspect-square !translate-x-0 !translate-y-0 !rounded-lg !border-none' />
    </Carousel>
  );
}

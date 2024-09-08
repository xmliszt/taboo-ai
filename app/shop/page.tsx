'use client';

import { useEffect, useRef, useState } from 'react';
import AutoPlay from 'embla-carousel-autoplay';
import { Gem } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

import { DiamondScene } from './diamond-scene';

type GemProduct = {
  id: number;
  name: string;
  description: string;
  tokens: number;
  price: {
    usd: number;
  };
};

const PRODUCTS: GemProduct[] = [
  {
    id: 1,
    name: 'A Handful of Gems',
    description:
      'Get started with a few gems! Perfect for jumping into a couple of AI-driven Taboo games or generating custom topics for a personalized challenge.',
    price: { usd: 2 },
    tokens: 10,
  },
  {
    id: 2,
    name: 'A Pouch of Gems',
    description:
      'Stock up on gems to fuel your gameplay. Ideal for engaging in multiple rounds of Taboo against AI or creating a series of unique topics for endless fun and learning.',
    price: { usd: 3 },
    tokens: 20,
  },
  {
    id: 3,
    name: 'A Treasure Chest of Gems',
    description:
      'Your ultimate resource for mastering the Game of Taboo! Plenty of gems to enjoy extensive AI feedback, refine your skills, and generate endless custom topics for you and your friends.',
    price: { usd: 5 },
    tokens: 50,
  },
];

export default function Page() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplay = useRef(AutoPlay({ stopOnInteraction: true, delay: 5000 }));
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <main className='flex flex-col items-center pt-6 md:pt-16'>
      <div className='h-auto w-full md:h-48 md:w-96'>
        <DiamondScene />
      </div>
      <div className='flex w-full items-center justify-center'>
        <Carousel
          className='w-80'
          opts={{ align: 'center', loop: true }}
          setApi={setApi}
          onPointerEnter={() => autoplay.current.stop()}
          onPointerLeave={() => autoplay.current.play()}
          plugins={[autoplay.current]}
        >
          <CarouselContent className='py-5'>
            {PRODUCTS.map((product) => (
              <CarouselItem key={product.id} className='pl-11'>
                <Card
                  className='flex h-[400px] w-64 flex-col justify-between'
                  style={{
                    boxShadow: (() => {
                      const radius = product.price.usd * 3;
                      const spread = product.price.usd * 1.1;
                      const color = (() => {
                        switch (product.price.usd) {
                          case 2:
                            return 'hsl(260, 100%, 50%)';
                          case 3:
                            return 'hsl(270, 100%, 50%)';
                          case 5:
                            return 'hsl(280, 100%, 50%)';
                        }
                      })();
                      return `0 0 ${radius}px ${spread}px ${color}`;
                    })(),
                    border: '1px solid rgba(147,0,255,0.5)',
                  }}
                >
                  <CardHeader className='gap-y-4'>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='flex flex-col justify-end gap-y-6 self-stretch'>
                    <div className='flex items-center justify-end gap-x-2'>
                      <span className='text-4xl font-bold'>{product.tokens}</span>
                      <Gem className='size-8' />
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold'>{product.price.usd} USD</span>
                      <Button variant='outline'>
                        <Gem className='mr-2 inline-block size-4' /> Take this
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='flex items-center justify-between gap-2 px-24 pb-24'>
            <CarouselPrevious
              className='relative translate-y-0 hover:bg-foreground/10'
              variant='link'
            />
            {/* Page indicator */}
            <div className='flex items-center gap-1 rounded-full bg-transparent p-2 px-2.5'>
              {Array.from({ length: count }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'size-2 rounded-full',
                    current === index + 1 ? 'bg-purple-600' : 'bg-foreground/20'
                  )}
                />
              ))}
            </div>
            <CarouselNext
              className='relative translate-y-0 hover:bg-foreground/10'
              variant='link'
            />
          </div>
        </Carousel>
      </div>
    </main>
  );
}

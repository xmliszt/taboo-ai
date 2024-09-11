'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
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

import { createPaymentLink } from './server/create-payment-link';

export type GemProduct = {
  id: number;
  name: string;
  description: string;
  tokens: number;
  priceId: string;
  price: number;
  currency: string;
};

type ShopItemCarouselProps = {
  products: GemProduct[];
};

export function ShopItemCarousel({ products }: ShopItemCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const autoplay = useRef(AutoPlay({ stopOnInteraction: true, delay: 5000 }));

  const [isPurchasing, startPurchasing] = useTransition();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel
      className='w-80'
      opts={{ align: 'center', loop: true }}
      setApi={setApi}
      onPointerEnter={() => autoplay.current.stop()}
      onPointerLeave={() => autoplay.current.play()}
      plugins={[autoplay.current]}
    >
      <CarouselContent className='py-5'>
        {products.map((product) => (
          <CarouselItem key={product.id} className='pl-11'>
            <Card
              className='flex h-[400px] w-64 flex-col justify-between'
              style={{
                boxShadow: (() => {
                  const radius = product.price * 3;
                  const spread = product.price * 2;
                  return `0 0 ${radius}px ${spread}px rgba(147,0,255,0.5)`;
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
                  <span className='text-2xl font-bold'>
                    {product.price} {product.currency.toUpperCase()}
                  </span>
                  <Button
                    variant='outline'
                    className='hover:bg-purple-600'
                    onClick={() =>
                      startPurchasing(async () => {
                        const paymentLink = await createPaymentLink({
                          priceId: product.priceId,
                          redirectUrl: `${window.location.origin}/shop/checkout-success`,
                        });
                        window.open(paymentLink.url, '_blank');
                      })
                    }
                    disabled={isPurchasing}
                  >
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
        <CarouselNext className='relative translate-y-0 hover:bg-foreground/10' variant='link' />
      </div>
    </Carousel>
  );
}

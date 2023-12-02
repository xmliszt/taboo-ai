'use client';

import { Check, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '../spinner';
import { createCheckoutSession } from '@/lib/services/subscriptionService';
import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';

interface PricingCardProps {
  index: number;
  actionLabel: string;
  plan: ISubscriptionPlan;
  isCurrentPlan: boolean;
}

export default function PricingCard({
  index,
  actionLabel,
  plan,
  isCurrentPlan,
}: PricingCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const subscribeTo = async (priceId?: string) => {
    if (!priceId) return;
    try {
      setIsLoading(true);
      const redirectUrl = await createCheckoutSession(
        priceId,
        user?.email,
        user?.customerId
      );
      router.replace(redirectUrl);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // scroll first card into view
    if (isCurrentPlan) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <Card
      id={`plan-card-${index}`}
      ref={cardRef}
      className={cn(
        /pro/i.test(plan.name)
          ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]'
          : '',
        user?.customerPlanType === plan.type
          ? 'border-[1px] border-primary'
          : '',
        'max-w-[280px] min-w-[280px] snap-center hover:scale-105 transition-transform ease-in-out'
      )}
    >
      <CardHeader>
        <CardTitle>
          <div className='flex flex-row justify-between items-center'>
            {plan.name}
            {plan.type !== 'free' && (
              <Badge>{plan.trialsDays} days free trial</Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription className='text-xl'>
          ${plan.pricePerMonth} per month
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[300px] flex flex-col gap-2'>
        {plan.features.map((feature, index) => (
          <div
            key={index}
            className='flex flex-row gap-2 justify-start items-start'
          >
            <div className='w-[22px]'>
              {feature.status === 'absent' ? (
                <X size={20} color='#E54666' strokeWidth={2} />
              ) : (
                <Check
                  size={20}
                  color={
                    feature.status === 'complete' ? '#7eb262' : '#7eb26250'
                  }
                  strokeWidth={2}
                />
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <span
                  className={cn(
                    'leading-tight underline underline-offset-2 decoration-dotted hover:cursor-help',
                    feature.status === 'absent'
                      ? 'text-muted-foreground'
                      : 'text-primary'
                  )}
                >
                  {feature.title}{' '}
                </span>
              </PopoverTrigger>
              <PopoverContent className='leading-snug bg-muted text-card-foreground'>
                <p className='leading-tight text-base'>{feature.description}</p>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
      <CardFooter className='flex justify-center'>
        <Button
          className='w-full'
          disabled={isCurrentPlan || isLoading}
          onClick={() => {
            subscribeTo(plan.priceId);
          }}
        >
          {isLoading ? <Spinner /> : actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

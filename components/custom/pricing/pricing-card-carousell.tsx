'use client';

import { useAuth } from '@/components/auth-provider';
import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { cn } from '@/lib/utils';

import { Skeleton } from '../skeleton';
import PricingCard from './pricing-card';

export default function PricingCardCarousell({
  plans,
  className = '',
}: {
  plans: ISubscriptionPlan[];
  className?: string;
}) {
  const { status } = useAuth();

  if (status === 'loading') return <Skeleton className='w-full px-16 py-10' numberOfRows={10} />;

  return (
    <div
      className={cn(
        className,
        'flex max-w-full snap-both flex-row gap-8 overflow-x-auto overflow-y-hidden lg:gap-16'
      )}
    >
      {plans.map((plan, index) => (
        <PricingCard key={index} index={index} plan={plan} />
      ))}
    </div>
  );
}

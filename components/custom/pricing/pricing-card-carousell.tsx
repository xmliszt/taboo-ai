'use client';

import { cn } from '@/lib/utils';
import PricingCard from './pricing-card';
import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { Skeleton } from '../skeleton';
import { useAuth } from '@/components/auth-provider';

export default function PricingCardCarousell({
  plans,
  className = '',
}: {
  plans: ISubscriptionPlan[];
  className?: string;
}) {
  const { status } = useAuth();

  if (status === 'loading')
    return <Skeleton className='w-full px-16 py-10' numberOfRows={10} />;

  return (
    <div
      className={cn(
        className,
        'flex flex-row gap-8 overflow-x-auto p-12 max-w-full snap-x snap-mandatory'
      )}
    >
      {plans.map((plan, index) => (
        <PricingCard key={index} index={index} plan={plan} />
      ))}
    </div>
  );
}

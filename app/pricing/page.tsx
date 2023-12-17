'use client';

import { useEffect, useState } from 'react';

import PricingCardCarousell from '@/components/custom/pricing/pricing-card-carousell';
import { Skeleton } from '@/components/custom/skeleton';
import { fetchAvailableSubscriptionPlans } from '@/lib/services/subscriptionService';
import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const plans = await fetchAvailableSubscriptionPlans();
        setPlans(plans);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className='mt-20 flex w-full flex-col items-center'>
      <h2 className='px-4 text-center text-xl font-bold leading-snug lg:text-4xl'>
        Choose The Right Plan For You
      </h2>
      <div className='h-4'></div>
      {isLoading ? (
        <Skeleton className='mt-10 w-full px-4' numberOfRows={10} />
      ) : (
        <PricingCardCarousell className='h-full px-12' plans={plans} />
      )}
    </div>
  );
}

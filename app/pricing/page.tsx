'use client';

import PricingCardCarousell from '@/components/custom/pricing/pricing-card-carousell';
import { Skeleton } from '@/components/custom/skeleton';
import { fetchAvailableSubscriptionPlans } from '@/lib/services/subscriptionService';
import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { useEffect, useState } from 'react';

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
    <div className='mt-20 w-full flex flex-col items-center'>
      <h2 className='leading-snug text-center text-4xl font-bold px-4'>
        Choose The Right Plan For You
      </h2>
      <p></p>
      {isLoading ? (
        <Skeleton className='mt-10 w-full' numberOfRows={10} />
      ) : (
        <PricingCardCarousell className='-mt-2' plans={plans} />
      )}
    </div>
  );
}

import { Plan } from '@/app/pricing/server/fetch-plans';
import { cn } from '@/lib/utils';

import PricingCard from './pricing-card';

export default function PricingCardCarousel({
  plans,
  className = '',
}: {
  plans: Plan[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        className,
        'flex max-w-full snap-both flex-row gap-8 overflow-x-auto overflow-y-hidden lg:gap-16'
      )}
    >
      {plans.map((plan, index) => (
        <PricingCard key={plan.id} index={index} plan={plan} />
      ))}
    </div>
  );
}

import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import PricingCardCarousel from '@/components/custom/pricing/pricing-card-carousel';

export default async function PricingPage() {
  const plans = await fetchPlans();

  return (
    <div className='flex w-full flex-col items-center pt-6'>
      <h2 className='px-4 text-center text-xl font-bold leading-snug lg:text-4xl'>
        Choose The Right Plan For You
      </h2>
      <PricingCardCarousel className='h-full px-12' plans={plans} />
    </div>
  );
}

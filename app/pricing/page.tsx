import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import PricingCardCarousel from '@/components/custom/pricing/pricing-card-carousel';

export default async function PricingPage() {
  const plans = await fetchPlans();

  return (
    <div className='mt-20 flex w-full flex-col items-center'>
      <h2 className='px-4 text-center text-xl font-bold leading-snug lg:text-4xl'>
        Choose The Right Plan For You
      </h2>
      <div className='h-4'></div>
      <PricingCardCarousel className='h-full px-12' plans={plans} />
    </div>
  );
}

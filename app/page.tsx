import Link from 'next/link';
import Script from 'next/script';
import { SetUserIdServerComponent } from '@logsnag/next';

import { OutgoingLinksCarousel } from '@/app/outgoing-links-carousel';
import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';
import { ProPlanIndicator } from '@/components/custom/home/pro-plan-indicator';
import PricingCard from '@/components/custom/pricing/pricing-card';
import { Card } from '@/components/ui/card';

export default async function HomePage() {
  let isUserPro = false;

  let user;
  try {
    user = await fetchUserProfile();
    isUserPro = user?.subscription?.customer_plan_type === 'pro';
  } catch (error) {
    // do nothing, user not authenticated
  }

  const plans = await fetchPlans();
  const proPlan = plans.find((plan) => plan.type === 'pro');

  return (
    <main className='flex flex-col items-center px-8'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex w-full flex-col items-center justify-center gap-2 pb-4 pt-8'>
        <div className='relative'>
          <h1 data-testid='heading-title' className='text-center text-7xl drop-shadow-lg'>
            Taboo AI
          </h1>
          <ProPlanIndicator />
        </div>
        <HomeMenuButtonArray />
      </section>
      {!isUserPro && proPlan && (
        <section className='mt-6 flex w-full flex-col items-center justify-center px-4 pb-4'>
          <h2 className='text-center text-2xl font-bold'>Enjoy more features with Taboo AI Pro</h2>
          <Link href={'/pricing'} className='hover:underline'>
            Explore more pricing plans
          </Link>
          <div className='group/pricing-card relative flex h-[500px] w-[300px] items-center justify-center'>
            <PricingCard
              className='!absolute top-0 !z-10 h-full w-full group-hover/pricing-card:!rotate-[5deg]'
              index={1}
              plan={proPlan}
            />
            <Card className='absolute top-0 z-0 my-12 max-h-[400px] min-h-[400px] min-w-[280px] max-w-[280px] snap-center bg-card transition-transform ease-in-out group-hover/pricing-card:-rotate-[15deg]'></Card>
            <Card className='absolute top-0 z-0 my-12 max-h-[400px] min-h-[400px] min-w-[280px] max-w-[280px] snap-center bg-card transition-transform ease-in-out group-hover/pricing-card:-rotate-[10deg]'></Card>
            <Card className='absolute top-0 z-0 my-12 max-h-[400px] min-h-[400px] min-w-[280px] max-w-[280px] snap-center bg-card transition-transform ease-in-out group-hover/pricing-card:-rotate-[5deg]'></Card>
            <Card className='absolute top-0 z-0 my-12 max-h-[400px] min-h-[400px] min-w-[280px] max-w-[280px] snap-center bg-card transition-transform ease-in-out group-hover/pricing-card:-rotate-[0deg]'></Card>
          </div>
        </section>
      )}
      <footer className='w-full max-w-xl px-4 pb-2 text-center text-xs leading-tight'>
        <OutgoingLinksCarousel />
        We improve our products and advertising by using Microsoft Clarity to see how you use our
        website. By using our site, you agree that we and Microsoft can collect and use this data.
        Our{' '}
        <a href='/privacy-policy' className='underline'>
          privacy statement
        </a>{' '}
        has more details.
      </footer>
      {process.env.VERCEL_ENV === 'production' && (
        <SetUserIdServerComponent userId={user?.id ?? null} />
      )}
    </main>
  );
}

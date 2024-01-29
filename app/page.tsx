import Link from 'next/link';
import Script from 'next/script';

import { OutgoingLinksCarousel } from '@/app/OutgoingLinksCarousel';
import { fetchPlans } from '@/app/pricing/server/fetch-plans';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import HomeMenuButtonArray from '@/components/custom/home/home-menu-button-array';
import PageCounter from '@/components/custom/home/page-counter';
import { ProPlanIndicator } from '@/components/custom/home/pro-plan-indicator';
import PricingCard from '@/components/custom/pricing/pricing-card';
import { Card } from '@/components/ui/card';

const title = 'Taboo AI';
const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;

export default async function HomePage() {
  let isUserPro = false;

  try {
    const user = await fetchUserProfile();
    isUserPro = user?.subscription?.customer_plan_type === 'pro';
  } catch (error) {
    // do nothing, user not authenticated
  }

  const plans = await fetchPlans();
  const proPlan = plans.find((plan) => plan.type === 'pro');

  return (
    <main>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex w-full flex-col items-center justify-center gap-2 pb-4 pt-8'>
        <div className='relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl drop-shadow-lg lg:text-8xl'
          >
            {title}
          </h1>
          <ProPlanIndicator />
          <span className='absolute -top-6 right-0 text-lg'>{versionNumber}</span>
        </div>
        <PageCounter />
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
              className='!absolute top-0 !z-10 group-hover/pricing-card:rotate-[5deg]'
              index={1}
              plan={proPlan}
            />
            <Card className='absolute top-0 z-0 my-12 max-h-[400px] min-h-[400px] min-w-[280px] max-w-[280px] snap-center bg-card transition-transform ease-in-out group-hover/pricing-card:-rotate-[5deg]'></Card>
          </div>
        </section>
      )}
      <footer className='w-full px-4 pb-2 text-center text-xs leading-tight'>
        <OutgoingLinksCarousel />
        We improve our products and advertising by using Microsoft Clarity to see how you use our
        website. By using our site, you agree that we and Microsoft can collect and use this data.
        Our{' '}
        <a href='/privacy' className='underline'>
          privacy statement
        </a>{' '}
        has more details.
      </footer>
    </main>
  );
}

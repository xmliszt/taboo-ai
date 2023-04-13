import Link from 'next/link';
import { GiCoffeeCup } from 'react-icons/gi';
import { SiDiscord } from 'react-icons/si';
import HotBadge from './(components)/(Badges)/HotBadge';
import NewBadge from './(components)/(Badges)/NewBadge';
import CustomWordListLink from './(components)/CustomWordListLink';
import DevToggle from './(components)/DevToggle';
import FeatureUpdatesLink from './(components)/FeatureUpdatesLink';
import FeedbackLink from './(components)/FeedbackLink';
import Footer from './(components)/Footer';
import SocialLinkButton from './(components)/SocialLinkButton';

interface HomePageProps {}

export default function HomePage(props: HomePageProps) {
  const title = 'Taboo.AI';
  const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;
  const environment = process.env.VERCEL_ENV;

  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      <section className='flex flex-col justify-center items-center overflow-y-scroll scrollbar-hide w-screen gap-2 py-32'>
        <div className='w-full relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-4xl lg:text-8xl drop-shadow-lg'
          >
            {title}{' '}
            <span className='text-lg text-white-faded dark:text-neon-white'>
              {versionNumber}
            </span>
          </h1>
          <FeatureUpdatesLink />
        </div>
        <FeedbackLink />
        <section className='mt-4 mb-2 flex-col flex gap-8 text-center'>
          <Link
            id='start'
            href='/levels'
            data-testid='link-start'
            data-style='none'
          >
            <div className='btn-menu'>Choose Topics</div>
          </Link>
          <Link
            id='daily-challenge'
            href='/daily-challenge/loading'
            data-testid='link-daily-challenge'
          >
            <div className='btn-menu'>Daily Challenge</div>
          </Link>
          <Link
            id='daily-wall-of-fame'
            href='/leaderboard'
            data-testid='link-daily-wall-of-fame'
          >
            <div className='btn-menu'>Daily Wall of Fame</div>
          </Link>
        </section>
        <CustomWordListLink />
        {environment !== 'production' && <DevToggle />}
      </section>
      <div className='fixed bottom-16 w-full flex flex-row gap-2 justify-center z-10'>
        <SocialLinkButton
          content='Buy Me Coffee'
          icon={<GiCoffeeCup />}
          href='/buymecoffee'
        />
        <SocialLinkButton
          content='Join Discord!'
          icon={<SiDiscord />}
          href='https://discord.gg/dgqs29CHC2'
          newTab={true}
          accentColorClass='bg-purple dark:bg-neon-purple'
          dropShadowClass='hover:drop-shadow-[0_5px_15px_rgba(224,158,255,0.6)]'
        />
      </div>
      <Footer />
    </main>
  );
}

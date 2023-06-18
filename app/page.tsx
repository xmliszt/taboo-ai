import Image from 'next/image';
import Link from 'next/link';
import { GiCoffeeCup } from 'react-icons/gi';
import { SiDiscord } from 'react-icons/si';
import InstallButton from '../components/InstallButton';
import CustomWordListLink from './../components/CustomWordListLink';
import DevToggle from './../components/DevToggle';
import FeatureUpdatesLink from './../components/FeatureUpdatesLink';
import Footer from './../components/Footer';
import SocialLinkButton from './../components/SocialLinkButton';
import ProductHuntBadge from './../public/images/producthunt.svg';

interface HomePageProps {}

export default function HomePage(props: HomePageProps) {
  const title = 'Taboo AI';
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
        <InstallButton />
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
            href='/daily-challenge'
            data-testid='link-daily-challenge'
          >
            <div className='btn-menu color-gradient-animated-background-golden'>
              Daily Challenge
            </div>
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
        <hr className='bg-gray opacity-50 w-[240px] h-[0.2px] rounded-full' />
        <a
          className='hover: opacity-70 hover:scale-105 hover:drop-shadow-2xl hover:mix-blend-plus-lighter transition-all'
          href='https://theresanaiforthat.com/ai/taboo-ai/?ref=embed'
          target='_blank'
          rel='noreferrer'
        >
          <Image
            className='drop-shadow-xl bg-blend-overlay'
            alt="TabooAI is featured on THERE'S AN AI FOR THAT"
            width='240'
            height='65'
            src='https://media.theresanaiforthat.com/featured4.png'
          />
        </a>
        <a
          className='hover: opacity-70 hover:scale-105 hover:drop-shadow-2xl hover:mix-blend-plus-lighter transition-all'
          href='https://www.producthunt.com/products/taboo-ai?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
          target='_blank'
          rel='noreferrer'
        >
          <Image
            className='drop-shadow-xl bg-blend-overlay'
            alt='Taboo&#0046;AI - Taboo&#0046;AI&#0032;&#0045;&#0032;The&#0032;Ultimate&#0032;Wordplay&#0032;Challenge&#0032;against&#0032;AI | Product Hunt'
            width='240'
            height='50'
            src={ProductHuntBadge}
          />
        </a>
      </section>

      <div className='fixed bottom-20 lg:bottom-24 w-full flex flex-row gap-2 justify-center z-10'>
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

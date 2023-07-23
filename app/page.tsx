import Link from 'next/link';
import Script from 'next/script';
import { GiCoffeeCup } from 'react-icons/gi';
import { SiDiscord } from 'react-icons/si';
import ContactMe from '../components/ContactMe';
import InstallButton from '../components/InstallButton';
import DevToggle from './../components/DevToggle';
import FeatureUpdatesLink from './../components/FeatureUpdatesLink';
import Footer from './../components/Footer';
import SocialLinkButton from './../components/SocialLinkButton';

interface HomePageProps {}

export default function HomePage(props: HomePageProps) {
  const title = 'Taboo AI';
  const versionNumber = `V${process.env.NEXT_PUBLIC_TABOO_AI_VERSION}`;
  const environment = process.env.VERCEL_ENV;

  return (
    <main className='h-full w-full overflow-auto scrollbar-hide'>
      <Script id='pwa-script' src='/js/pwa.js' />
      <section className='flex flex-col justify-center items-center overflow-y-scroll scrollbar-hide w-screen gap-2 py-32 pb-48'>
        <div className='w-full relative'>
          <h1
            data-testid='heading-title'
            className='text-center text-6xl lg:text-8xl drop-shadow-lg'
          >
            {title}{' '}
            <span className='text-lg text-white-faded dark:text-neon-white'>
              {versionNumber}
            </span>
          </h1>
          <FeatureUpdatesLink />
        </div>
        <InstallButton />
        <section className='mt-4 mb-2 flex-col flex gap-8 text-center w-4/5 max-w-[400px]'>
          <Link
            id='start'
            href='/levels'
            data-testid='link-start'
            data-style='none'
          >
            <div className='btn-menu'>Choose Topics</div>
          </Link>
        </section>
        {environment !== 'production' && <DevToggle />}
        <section className='w-4/5 mt-10'>
          <ContactMe />
        </section>
      </section>

      <div className='fixed bottom-24 lg:bottom-28 w-full flex flex-row gap-2 justify-center z-10'>
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

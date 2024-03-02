import Link from 'next/link';
import _ from 'lodash';

import { fetchAllLevelsAndRanks } from '@/app/levels/server/fetch-levels';
import { Separator } from '@/components/ui/separator';
import { RouteManager } from '@/lib/utils/routeUtils';

interface SitemapRoute {
  title: string;
  href: string;
}

export default async function SitemapPage() {
  const levels = (await fetchAllLevelsAndRanks()).sort((a, b) => a.name.localeCompare(b.name));
  const features: SitemapRoute[] = [
    { title: 'Home', href: '/' },
    { title: 'Public topics', href: '/levels' },
    { title: 'AI generated topics', href: '/ai' },
    { title: 'Contribute a topic', href: '/add-level' },
    { title: 'Results', href: '/result' },
    { title: 'Profile', href: '/profile' },
    { title: 'Pricing', href: '/pricing' },
  ];
  const baseUrl = RouteManager.baseUrl;
  const informations: SitemapRoute[] = [
    { title: 'About', href: '/about' },
    { title: 'Rules', href: '/rule' },
    { title: 'How to install Taboo AI?', href: '/pwa' },
    { title: 'Latest features', href: '/whatsnew' },
    { title: 'Project roadmap', href: '/roadmap' },
    { title: 'Buy me coffee', href: '/buymecoffee' },
    { title: 'Privacy policy', href: '/privacy' },
    { title: 'Cookie policy', href: '/cookie-policy' },
  ];
  const socialMedia: SitemapRoute[] = [
    { title: 'About me', href: 'https://liyuxuan.dev' },
    { title: 'My Github', href: 'https://github.com/xmliszt' },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/li-yuxuan/' },
    { title: 'Twitter', href: 'https://twitter.com/xmliszt' },
    {
      title: 'Facebook',
      href: 'https://m.facebook.com/profile.php?id=61552423745265',
    },
    {
      title: 'Newsletter',
      href: 'https://liyuxuan.substack.com',
    },
    {
      title: 'Taboo AI Discord server',
      href: 'https://discord.gg/dgqs29CHC2',
    },
    {
      title: 'Check out Easy Next',
      href: 'https://www.npmjs.com/package/easy-next',
    },
  ];

  return (
    <main className='flex h-full w-full flex-col items-center gap-4 px-10 pb-10 text-center leading-snug md:text-left'>
      <section id='features-section' className='w-full max-w-xl'>
        <h3 className='my-2 text-center text-xl font-extrabold'>Features</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 gap-x-4 md:grid-cols-3'>
          {features.map((feature) => (
            <Link
              className='overflow-clip text-ellipsis whitespace-nowrap hover:underline'
              key={feature.href}
              href={baseUrl + feature.href}
            >
              {feature.title}
            </Link>
          ))}
        </div>
      </section>
      <section id='all-topics-section' className='max-w-xl'>
        <h3 className='my-2 text-center text-xl font-extrabold'>All topics</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 gap-x-4 md:grid-cols-3'>
          {levels.map((level) => (
            <Link
              className='overflow-clip text-ellipsis whitespace-nowrap hover:underline'
              key={level.id}
              href={baseUrl + '/level/' + level.id}
            >
              {_.startCase(level.name)}
            </Link>
          ))}
        </div>
      </section>
      <section id='information-section' className='max-w-xl'>
        <h3 className='my-2 text-center text-xl font-extrabold'>Information</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 gap-x-4 md:grid-cols-3'>
          {informations.map((info) => (
            <Link
              className='overflow-clip text-ellipsis whitespace-nowrap hover:underline'
              key={info.href}
              href={baseUrl + info.href}
            >
              {info.title}
            </Link>
          ))}
        </div>
      </section>
      <section id='social-media-section' className='max-w-xl'>
        <h3 className='my-2 text-center text-xl font-extrabold'>Social media</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 gap-x-4 md:grid-cols-3'>
          {socialMedia.map((media) => (
            <Link
              className='overflow-clip text-ellipsis whitespace-nowrap hover:underline'
              key={media.href}
              href={media.href}
            >
              {media.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

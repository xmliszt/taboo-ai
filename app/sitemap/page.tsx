import Link from 'next/link';
import _ from 'lodash';

import { Separator } from '@/components/ui/separator';
import { getAllLevels } from '@/lib/services/levelService';
import { RouteManager } from '@/lib/utils/routeUtils';

interface SitemapRoute {
  title: string;
  href: string;
}

export default async function SitemapPage() {
  const levels = (await getAllLevels()).sort((a, b) => a.name.localeCompare(b.name));
  const features: SitemapRoute[] = [
    { title: 'Home', href: '/' },
    { title: 'Choose A Topic', href: '/levels' },
    { title: 'AI Mode', href: '/ai' },
    { title: 'Contribute A Topic', href: '/add-level' },
    { title: 'Results', href: '/result' },
    { title: 'Profile', href: '/profile' },
  ];
  const baseUrl = RouteManager.baseUrl;
  const informations: SitemapRoute[] = [
    { title: 'About', href: '/about' },
    { title: 'Rules', href: '/rule' },
    { title: 'How to install Taboo AI?', href: '/pwa' },
    { title: 'Latest Features', href: '/whatsnew' },
    { title: 'Project Roadmap', href: '/roadmap' },
    { title: 'Buy Me Coffee', href: '/buymecoffee' },
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Cookie Policy', href: '/cookie-policy' },
  ];
  const socialMedia: SitemapRoute[] = [
    { title: 'About Me', href: 'https://liyuxuan.dev' },
    { title: 'My Github', href: 'https://github.com/xmliszt' },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/li-yuxuan/' },
    { title: 'Twitter', href: 'https://twitter.com/xmliszt' },
    {
      title: 'Facebook',
      href: 'https://img.shields.io/badge/-My%20Facebook-black?logo=facebook',
    },
    {
      title: 'Taboo AI Newsletter',
      href: 'https://liyuxuan.substack.com',
    },
    {
      title: 'Taboo AI Discord Server',
      href: 'https://discord.gg/dgqs29CHC2',
    },
    {
      title: 'Taboo AI GitHub Repository',
      href: 'https://github.com/xmliszt/Taboo-AI',
    },
    {
      title: 'Check out Easy Next',
      href: 'https://www.npmjs.com/package/easy-next',
    },
  ];

  return (
    <main className='flex h-full w-full flex-col gap-4 px-10 pb-10 text-center leading-snug md:text-left'>
      <section id='features-section'>
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
      <section id='all-topics-section'>
        <h3 className='my-2 text-center text-xl font-extrabold'>All Topics</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 gap-x-4 md:grid-cols-3'>
          {levels.map((level) => (
            <Link
              className='overflow-clip text-ellipsis whitespace-nowrap hover:underline'
              key={level.id}
              href={baseUrl + '/level/' + level.id}
            >
              {_.startCase(level.name)} {level.author && <i>by {level.author}</i>}
            </Link>
          ))}
        </div>
      </section>
      <section id='information-section'>
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
      <section id='social-media-section'>
        <h3 className='my-2 text-center text-xl font-extrabold'>Social Media</h3>
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

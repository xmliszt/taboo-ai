import { Separator } from '@/components/ui/separator';
import { getAllLevels } from '@/lib/services/levelService';
import { RouteManager } from '@/lib/utils/routeUtils';
import Link from 'next/link';

interface SitemapRoute {
  title: string;
  href: string;
}

export default async function SitemapPage() {
  const levels = (await getAllLevels()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const features: SitemapRoute[] = [
    { title: 'Home', href: '/' },
    { title: 'Choose A Topic', href: '/levels' },
    { title: 'AI Mode', href: '/ai' },
    { title: 'Contribute A Topic', href: '/add-level' },
    { title: 'Your Results', href: '/result' },
  ];
  const baseUrl = RouteManager.baseUrl;
  const informations: SitemapRoute[] = [
    { title: 'Rules', href: '/rule' },
    { title: 'How to install Taboo AI?', href: '/pwa' },
    { title: 'Latest Features', href: '/whatsnew' },
    { title: 'Project Roadmap', href: '/roadmap' },
    { title: 'Buy Me Coffee', href: '/buymecoffee' },
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Cookie Policy', href: '/cookie-policy' },
  ];
  const socialMedia: SitemapRoute[] = [
    { title: 'About Me', href: 'https://xmliszt.github.io' },
    { title: 'My Github', href: 'https://github.com/xmliszt' },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/li-yuxuan/' },
    { title: 'Twitter', href: 'https://twitter.com/xmliszt' },
    {
      title: 'Facebook',
      href: 'https://img.shields.io/badge/-My%20Facebook-black?logo=facebook',
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
    <div className='leading-snug text-center md:text-left w-full h-full pt-20 px-10 pb-10 flex flex-col gap-4 overflow-y-auto'>
      <section id='features-section'>
        <h3 className='text-xl font-extrabold text-center my-2'>Features</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-4'>
          {features.map((feature) => (
            <Link
              className='hover:underline overflow-clip text-ellipsis whitespace-nowrap'
              key={feature.href}
              href={baseUrl + feature.href}
            >
              {feature.title}
            </Link>
          ))}
        </div>
      </section>
      <section id='all-topics-section'>
        <h3 className='text-xl font-extrabold text-center my-2'>All Topics</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-4'>
          {levels.map((level) => (
            <Link
              className='hover:underline overflow-clip text-ellipsis whitespace-nowrap'
              key={level.id}
              href={baseUrl + '/level/' + level.id}
            >
              {level.name} {level.author && <i>by {level.author}</i>}
            </Link>
          ))}
        </div>
      </section>
      <section id='information-section'>
        <h3 className='text-xl font-extrabold text-center my-2'>Information</h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-4'>
          {informations.map((info) => (
            <Link
              className='hover:underline overflow-clip text-ellipsis whitespace-nowrap'
              key={info.href}
              href={baseUrl + info.href}
            >
              {info.title}
            </Link>
          ))}
        </div>
      </section>
      <section id='social-media-section'>
        <h3 className='text-xl font-extrabold text-center my-2'>
          Social Media
        </h3>
        <Separator />
        <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-x-4'>
          {socialMedia.map((media) => (
            <Link
              className='hover:underline overflow-clip text-ellipsis whitespace-nowrap'
              key={media.href}
              href={media.href}
            >
              {media.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

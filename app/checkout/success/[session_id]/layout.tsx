import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnag/logsnag-server';

export async function generateMetadata({
  params,
}: {
  params: { session_id: string };
}): Promise<Metadata> {
  return {
    title: 'Thank you for your purchase!',
    alternates: {
      canonical: `/checkout/success/${params.session_id}`,
    },
    openGraph: {
      title: 'Taboo AI: Thank you for your purchase!',
      url: 'https://taboo-ai.vercel.app/checkout/success/' + params.session_id,
      images: [
        {
          url: 'https://github.com/xmliszt/resources/blob/main/taboo-ai/images/v300/poster3.0(features).png?raw=true',
          width: 800,
          height: 600,
          alt: 'Taboo AI: Ignite Learning Through Play 🚀🎮',
        },
      ],
    },
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: { session_id: string };
  children: React.ReactNode;
}) {
  await trackNavigation('/checkout/success/' + params.session_id);
  return <main className='w-full'>{children}</main>;
}

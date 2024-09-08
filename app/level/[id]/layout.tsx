import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { fetchLevel } from '@/app/level/[id]/server/fetch-level';
import { fetchAllLevelsWithoutCookies } from '@/app/levels/server/fetch-levels';
import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  if (id === 'ai') {
    return {
      title: 'AI Mode',
      alternates: {
        canonical: '/level/ai',
      },
      openGraph: {
        title: 'Taboo AI: AI Mode',
        url: 'https://taboo-ai.com/level/ai',
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
  const level = await fetchLevel(id);
  return {
    title: level?.name ?? 'Level',
    alternates: {
      canonical: `/level/${id}`,
    },
    openGraph: {
      title: `Taboo AI: ${level?.name ?? 'Level'}`,
      url: 'https://taboo-ai.com/level/' + id,
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

// Static generation of dynamic level route at build time instead of on request
export async function generateStaticParams() {
  return (await fetchAllLevelsWithoutCookies()).map((level) => ({ id: level.id }));
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await fetchUserProfile();
  if (!user) redirect('/sign-in');

  return <>{children}</>;
}

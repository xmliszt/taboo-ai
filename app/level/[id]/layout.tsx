import React from 'react';
import { Metadata } from 'next';

import { fetchLevel } from '@/app/level/server/fetch-level';
import { fetchAllLevelsAndRanks } from '@/app/levels/server/fetch-levels';

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const level = await fetchLevel(id);
  return {
    title: level?.name ?? 'Level',
    alternates: {
      canonical: `/level/${id}`,
    },
    openGraph: {
      url: 'https://taboo-ai.vercel.app/level/' + id,
    },
  };
}

// Static generation of dynamic level route at build time instead of on request
export async function generateStaticParams() {
  return (await fetchAllLevelsAndRanks()).map((level) => ({ id: level.id }));
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

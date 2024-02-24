import React from 'react';
import { Metadata } from 'next';

import { trackNavigation } from '@/lib/logsnap-server';

export const metadata: Metadata = {
  title: 'Choose Topic',
  alternates: {
    canonical: '/levels',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/levels',
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  await trackNavigation('/levels');
  return <main className='flex justify-center'>{children}</main>;
}

import React from 'react';
import { Metadata } from 'next';

import { AskForFeedbackAutoDialog } from '@/components/custom/ask-for-feedback-auto-dialog';

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
  return (
    <main className='flex justify-center'>
      {children}
      <AskForFeedbackAutoDialog />
    </main>
  );
}

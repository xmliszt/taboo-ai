import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dev Mode: Review Topics & Words',
  alternates: {
    canonical: '/x/review-words',
  },
  openGraph: {
    url: 'https://taboo-ai.vercel.app/x/review-words',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Roadmap',
  alternates: {
    canonical: '/roadmap',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

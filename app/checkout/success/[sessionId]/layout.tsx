import { Metadata } from 'next';
import { Confetti } from './confetti';

export async function generateMetadata({
  params: { sessionId },
}: {
  params: { sessionId: string };
}): Promise<Metadata> {
  return {
    title: 'Thank you for your purchase!',
    alternates: {
      canonical: `/checkout/success/${sessionId}`,
    },
    openGraph: {
      url: 'https://taboo-ai.vercel.app/checkout/success/' + sessionId,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex justify-center w-full h-full'>
      <Confetti />
      {children}
    </main>
  );
}

import { Metadata } from 'next';

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
      title: 'Taboo AI: Thank you for your purchase!',
      url: 'https://taboo-ai.vercel.app/checkout/success/' + sessionId,
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className='w-full'>{children}</main>;
}

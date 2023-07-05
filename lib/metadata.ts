import { Metadata } from 'next';

export const _meta: Metadata = {
  title: {
    default: 'Taboo AI: Play Taboo with AI',
    template: 'Taboo AI | %s',
  },
  description:
    'Unleash your wordplay skills and master English with Taboo AI! Challenge yourself daily, compete on the leaderboard, and have fun learning. Join now!',
  applicationName: 'Taboo AI: Play Taboo Game with AI',
  keywords: [
    'AI',
    'Wordplay game',
    'Taboo challenge',
    'English learning',
    'Vocabulary builder',
    'Language skills',
    'Educational game',
    'Word guessing',
    'Trivia game',
    'Brain teaser',
    'Linguistic skills',
  ],
  authors: [{ name: 'Li Yuxuan', url: 'https://xmliszt.github.io/' }],
  creator: 'Li Yuxuan',
  alternates: {
    canonical: 'https://taboo-ai.vercel.app/',
  },
  category: 'technology',
  openGraph: {
    title: 'Taboo AI: Play Taboo with AI',
    description:
      'Unleash your wordplay skills and master English with Taboo AI! Challenge yourself daily, compete on the leaderboard, and have fun learning. Join now!',
    url: 'https://taboo-ai.vercel.app/',
    siteName: 'Taboo AI',
    images: [
      {
        url: 'https://i.ibb.co/44Gz4P1/Poster.png',
        width: 800,
        height: 600,
        alt: 'Taboo AI: Play Taboo with AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
  manifest: '/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title: 'Taboo AI: Play Taboo with AI',
    description:
      'Unleash your wordplay skills and master English with Taboo AI! Challenge yourself daily, compete on the leaderboard, and have fun learning. Join now!',
    siteId: '1704579643',
    creator: '@xmliszt',
    creatorId: '1704579643',
    images: ['https://i.ibb.co/44Gz4P1/Poster.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  appleWebApp: {
    title: 'Taboo AI: Play Taboo Game for Free with AI',
    statusBarStyle: 'black-translucent',
    startupImage: ['/public/images/Poster 2.0.png'],
  },
  other: {
    'google-site-verification': 'ropLCQ8cEksVS7dB6jbFu4wrAfkdeTPe05Tj2m4zZGk',
    'ahrefs-site-verification':
      'f832d06e3893f0e38cd251704fa298ec65dfd86ce5b54eebb349c755229b0dd9',
  },
};

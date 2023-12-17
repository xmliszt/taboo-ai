'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';

import { incrementView } from '@/lib/services/appService';

export function AnalyticsWrapper() {
  const pathname = usePathname();
  useEffect(() => {
    incrementView();
  }, [pathname]);
  return <Analytics />;
}

'use client';
import { incrementView } from '@/lib/services/appService';
import { Analytics } from '@vercel/analytics/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AnalyticsWrapper() {
  const pathname = usePathname();
  useEffect(() => {
    incrementView();
  }, [pathname]);
  return <Analytics />;
}

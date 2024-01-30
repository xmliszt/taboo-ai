'use client';

import { useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';

import { incrementView } from '@/components/increment-view-server-action';

export function AnalyticsProvider() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    startTransition(async () => {
      await incrementView();
    });
  }, [pathname]);
  return <Analytics />;
}

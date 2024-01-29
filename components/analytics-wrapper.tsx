'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';

import { createClient } from '@/lib/utils/supabase/client';

export function AnalyticsWrapper() {
  const pathname = usePathname();
  useEffect(() => {
    void incrementView();
  }, [pathname]);
  return <Analytics />;
}

async function incrementView() {
  const supabaseClient = createClient();
  await supabaseClient.rpc('f_increment_with_text_as_id', {
    _row_id: 'app_views',
    _x: 1,
    _table_name: 'app_stats',
    _field_name: 'value',
  });
}

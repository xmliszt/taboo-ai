import { useEffect, useState } from 'react';
import { AsyncReturnType } from 'type-fest';

import { createClient } from '@/lib/utils/supabase/client';

export const useAppStats = () => {
  const [appStats, setAppStats] = useState<{ [key: string]: AppStats }>({});

  useEffect(() => {
    const supabaseClient = createClient();

    // Fetch app_stats for initial render
    async function fetchInitialAppStats() {
      try {
        const appStats = await fetchAppStats();
        const appStatsObject: { [key: string]: AppStats } = {};
        for (const appStat of appStats) {
          appStatsObject[appStat.id] = appStat;
        }
        setAppStats(appStatsObject);
      } catch (error) {
        console.log(error);
      }
    }

    void fetchInitialAppStats();
    // Subscribe to app_stats changes
    supabaseClient
      .channel('app_stats')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'app_stats',
        },
        (payload) => {
          const appStatsCopy = { ...appStats };
          const newAppStat = payload.new as AppStats;
          appStatsCopy[newAppStat.id] = newAppStat;
          setAppStats(appStatsCopy);
        }
      )
      .subscribe();
  }, [setAppStats]);
  return appStats;
};

async function fetchAppStats() {
  const supabaseClient = createClient();
  const fetchAppStatsResponse = await supabaseClient.from('app_stats').select();
  if (fetchAppStatsResponse.error) throw fetchAppStatsResponse.error;
  return fetchAppStatsResponse.data;
}

type AppStats = AsyncReturnType<typeof fetchAppStats>[number];

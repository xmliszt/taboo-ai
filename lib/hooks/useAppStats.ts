import { useCallback, useEffect, useState } from 'react';

import { listenToAppStats } from '../services/appService';

export interface AppStatsProps {
  views: number;
}

// TODO: Update hook to use supabase realtime
export const useAppStats = () => {
  const [stats, setStats] = useState<AppStatsProps>();

  const onSnapshotUpdated = useCallback(() => {
    setStats({
      views: 0,
    });
  }, []);

  useEffect(() => {
    listenToAppStats();
  }, [onSnapshotUpdated]);

  return { stats };
};

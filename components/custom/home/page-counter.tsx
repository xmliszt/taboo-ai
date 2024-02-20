'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { Spinner } from '@/components/custom/spinner';
import { Badge } from '@/components/ui/badge';
import { useAppStats } from '@/lib/hooks/useAppStats';

export default function PageCounter() {
  const appStats = useAppStats();
  const pageViewRef = useRef<number>(0);
  const [isViewsIncreasing, setIsViewsIncreasing] = useState(false);

  useEffect(() => {
    if (
      appStats.app_views?.value &&
      !isViewsIncreasing &&
      Number(appStats.app_views.value) > pageViewRef.current
    ) {
      setIsViewsIncreasing(true);
      setTimeout(() => {
        setIsViewsIncreasing(false);
      }, 1000);
      pageViewRef.current = Number(appStats.app_views.value);
    }
  }, [appStats, isViewsIncreasing, pageViewRef]);

  return (
    <div className='relative flex flex-row items-center gap-4'>
      {isViewsIncreasing && (
        <ArrowUp size={16} className='absolute -right-4 -top-1 animate-ping-once' />
      )}
      <Badge>
        Total views:{' '}
        {appStats?.app_views?.value ?? (
          <span className='ml-2'>
            <Spinner size={10} />
          </span>
        )}
      </Badge>
    </div>
  );
}

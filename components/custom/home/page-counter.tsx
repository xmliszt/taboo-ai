'use client';

import { Badge } from '@/components/ui/badge';
import { useAppStats } from '@/lib/hooks/useAppStats';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function PageCounter() {
  const { stats } = useAppStats();
  const pageViewRef = useRef<number>(0);
  const [isViewsIncreasing, setIsViewsIncreasing] = useState(false);

  useEffect(() => {
    if (stats && !isViewsIncreasing && stats.views > pageViewRef.current) {
      setIsViewsIncreasing(true);
      setTimeout(() => {
        setIsViewsIncreasing(false);
      }, 1000);
      pageViewRef.current = stats.views;
    }
  }, [stats, isViewsIncreasing, pageViewRef]);

  return (
    <div className='flex flex-row gap-4 items-center relative'>
      {isViewsIncreasing && (
        <ArrowUp
          size={16}
          className='absolute -right-4 -top-1 animate-ping-once'
        />
      )}
      <Badge>Total Views: {stats?.views}</Badge>
    </div>
  );
}

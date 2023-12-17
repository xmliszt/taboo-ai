'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useAppStats } from '@/lib/hooks/useAppStats';

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
    <div className='relative flex flex-row items-center gap-4'>
      {isViewsIncreasing && (
        <ArrowUp size={16} className='absolute -right-4 -top-1 animate-ping-once' />
      )}
      <Badge>Total Views: {stats?.views}</Badge>
    </div>
  );
}

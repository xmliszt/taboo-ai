'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDailyLevel } from '../../../lib/services/frontend/levelService';
import moment from 'moment';
import { cacheLevel } from '../../../lib/cache';
import LoadingMask from '../../(components)/LoadingMask';
import { buildLevelForDisplay, delayRouterPush } from '../../../lib/utilities';
import useToast from '../../../lib/hook/useToast';

/**
 * Load the daily level before caching the level and enter the game.
 * Cache level needs to be transform from IDailyLevel -> ILevel
 */
const DailyLevelLoadingPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    !isMounted && setIsMounted(true);
    isMounted && fetchDailyLevel();
  }, [isMounted]);

  const fetchDailyLevel = async () => {
    try {
      setIsLoading(true);
      const level = await getDailyLevel(moment());
      if (!level) {
        toast({
          title: 'Sorry! It seems that there is no new challenge for today!',
          status: 'error',
        });
        delayRouterPush(router, '/', {
          delay: 3000,
          completion: () => {
            setIsLoading(false);
          },
        });
        return;
      }
      const convertedLevel = buildLevelForDisplay(level);
      cacheLevel(convertedLevel);
      setIsLoading(false);
      router.push('/daily-challenge');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Unable to fetch daily challenge! Please try again later!',
        status: 'error',
      });
      delayRouterPush(router, '/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingMask
        isLoading={isLoading}
        message="What will today's challenge be?"
      />
    </>
  );
};

export default DailyLevelLoadingPage;

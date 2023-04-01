'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getDailyLevel } from '../../../lib/services/frontend/levelService';
import moment from 'moment';
import {
  cacheLevel,
  cacheScore,
  clearScores,
  getUser,
} from '../../../lib/cache';
import LoadingMask from '../../(components)/LoadingMask';
import { getGameByPlayerNicknameFilterByDate } from '../../../lib/services/frontend/gameService';
import { getScoresByGameID } from '../../../lib/services/frontend/scoreService';
import { getHighlights } from '../../../lib/services/frontend/highlightService';
import {
  buildLevelForDisplay,
  buildScoresForDisplay,
} from '../../../lib/utilities';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Load the daily level before caching the level and enter the game.
 * Cache level needs to be transform from IDailyLevel -> ILevel
 */
const DailyLevelLoadingPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    !isMounted && setIsMounted(true);
    isMounted && fetchDailyLevel();
  }, [isMounted]);

  const fetchDailyLevel = async () => {
    try {
      setIsLoading(true);
      const level = await getDailyLevel(moment());
      if (!level) {
        setIsLoading(false);
        toast.error(
          'Sorry! It seems that there is no new challenge for today!'
        );
        router.push('/');
        return;
      }
      const convertedLevel = buildLevelForDisplay(level);
      const user = getUser();

      if (user) {
        const game = await getGameByPlayerNicknameFilterByDate(
          user.nickname,
          moment()
        );
        if (game) {
          const scores = await getScoresByGameID(game.game_id);
          cacheLevel(convertedLevel);
          clearScores();
          for (const score of scores) {
            const highlights = await getHighlights(
              game.game_id,
              score.score_id
            );
            const displayScore = buildScoresForDisplay(
              convertedLevel,
              score,
              highlights
            );
            cacheScore(displayScore);
          }
          setIsLoading(false);
          toast.warn("Seems like you have attempted today's challenge.");
          router.push('/result');
          return;
        }
      }
      cacheLevel(convertedLevel);
      setIsLoading(false);
      router.push('/daily-challenge');
    } catch (error) {
      console.error(error);
      toast.error('Unable to fetch daily challenge! Please try again later!');
      router.push('/');
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

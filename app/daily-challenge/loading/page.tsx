'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getDailyLevel } from '../../../lib/services/frontend/levelService';
import type ILevel from '../../../types/level.interface';
import moment from 'moment';
import {
  cacheLevel,
  cacheScore,
  clearScores,
  getLevelCache,
  getScoresCache,
  getUser,
} from '../../../lib/cache';
import LoadingMask from '../../(components)/LoadingMask';
import { getBestGamesByNicknameAndLevel } from '../../../lib/services/frontend/gameService';
import { getScoresByGameID } from '../../../lib/services/frontend/scoreService';
import { getHighlights } from '../../../lib/services/frontend/highlightService';
import { Highlight } from '../../../types/chat.interface';

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
        toast.error(
          'Sorry! It seems that there is no new challenge for today!'
        );
        router.push('/');
        return;
      }
      const createdDate = moment(level.created_date, 'DD-MM-YYYY');
      const convertedLevel: ILevel = {
        name: level.name,
        difficulty: level.difficulty,
        author: 'Taboo.AI',
        isDaily: true,
        words: level.words,
        createdAt: createdDate.valueOf(),
        dailyLevelName: `Daily Challenge: ${createdDate.format(
          'ddd, MMM Do YYYY'
        )}`,
      };
      const user = getUser();
      const cachedLevel = getLevelCache();
      const cachedScores = getScoresCache();
      console.log(
        cachedLevel,
        cachedScores,
        cachedLevel?.name,
        convertedLevel.name
      );
      if (
        cachedLevel &&
        cachedScores &&
        cachedLevel.name === convertedLevel.name
      ) {
        setIsLoading(false);
        toast.warn("Seems like you have attempted today's challenge.");
        router.push('/result');
        return;
      }
      if (user) {
        const { games } = await getBestGamesByNicknameAndLevel(
          level.name,
          user.nickname,
          5
        );
        if (games.length > 0) {
          const mostRecentGame = games[0];
          if (mostRecentGame.level === level.name) {
            const scores = await getScoresByGameID(mostRecentGame.game_id);
            cacheLevel(convertedLevel);
            clearScores();
            for (const score of scores) {
              const highlights = await getHighlights(
                mostRecentGame.game_id,
                score.score_id
              );
              cacheScore({
                id: score.score_id,
                target: score.target,
                question: score.question,
                response: score.response,
                difficulty: level.difficulty,
                completion: score.completion_duration,
                responseHighlights: highlights.map(
                  (h): Highlight => ({ start: h.start, end: h.end })
                ),
              });
            }
            setIsLoading(false);
            toast.warn("Seems like you have attempted today's challenge.");
            router.push('/result');
            return;
          }
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

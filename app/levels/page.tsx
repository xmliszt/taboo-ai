'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LevelCard } from '@/components/custom/level-card';
import { useLevels } from '@/lib/hooks/useLevels';
import IconButton from '@/components/ui/icon-button';
import { ChevronsUp } from 'lucide-react';
import { Skeleton } from '@/components/custom/skeleton';
import { LevelUtils, SortType } from '@/lib/utils/levelUtils';
import LevelsSearchBar from '@/components/custom/levels/levels-search-bar';
import { Unsubscribe } from 'firebase/auth';
import { bindLevelRankingStatsListener } from '@/lib/services/levelService';

interface LevelRankingStat {
  topScore?: number;
  topScorer?: string;
  topScorerName?: string;
}

export default function LevelsPage() {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const [selectedSorter, setSelectedSorter] = useState<SortType>('create-new');
  const levelSectionRef = useRef<HTMLDivElement | null>(null);
  const { filteredLevels, setFilterKeyword, isFetchingLevels } = useLevels();
  const sortedLevels = useMemo(
    () => [...filteredLevels].sort(LevelUtils.getCompareFn(selectedSorter)),
    [selectedSorter, filteredLevels]
  );
  const unSubsribeLevelRankingListener = useRef<Unsubscribe | null>(null);
  const [levelRankingStats, setLevelRankingStats] = useState<{
    [key: string]: LevelRankingStat;
  }>();

  const [isRankingModeOn, setIsRankingModeOn] = useState(false);

  useEffect(() => {
    if (isRankingModeOn) {
      const unsubscribe = bindLevelRankingStatsListener((snapshot) => {
        const stats = snapshot.val();
        setLevelRankingStats(stats);
      });
      unSubsribeLevelRankingListener.current = unsubscribe;
    } else {
      unSubsribeLevelRankingListener.current?.();
    }
  }, [isRankingModeOn]);

  const handleScrollToTop = () => {
    levelSectionRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight = document.getElementById('level-section')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    if (clientHeight && scrollTop > clientHeight) {
      !isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(true);
    } else {
      isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(false);
    }
  };

  return (
    <section className='w-full h-full overflow-y-hidden'>
      <div className='w-full h-44 pt-20 px-4 lg:px-12 bg-card border border-b-primary'>
        <LevelsSearchBar
          topicNumber={filteredLevels.length}
          setFilterKeyword={setFilterKeyword}
          onSorterChange={(sorter: SortType) => {
            setSelectedSorter(sorter);
          }}
          onRankingModeChange={(rankingMode: boolean) => {
            setIsRankingModeOn(rankingMode);
          }}
        />
      </div>
      <div
        id='level-section'
        ref={levelSectionRef}
        className='flex flex-wrap gap-8 w-full h-[calc(100%-11rem)] py-10 px-4 justify-center content-start text-center overflow-auto'
        onScroll={onScrollChange}
      >
        {/* AI Mode Card */}
        <LevelCard />

        {/* Levels Card */}
        {isFetchingLevels ? (
          <Skeleton numberOfRows={8} className='flex-grow' />
        ) : (
          sortedLevels.map((level, idx) => (
            <LevelCard
              key={idx}
              level={level}
              isShowingRank={isRankingModeOn}
              topScore={levelRankingStats?.[level.id]?.topScore}
              topScorerEmail={levelRankingStats?.[level.id]?.topScorer}
              topScorerName={levelRankingStats?.[level.id]?.topScorerName}
            />
          ))
        )}
      </div>
      {isScrollToTopButtonVisible && (
        <IconButton
          asChild
          className='fixed bottom-4 right-4 animate-fade-in'
          tooltip='Scroll to top'
          onClick={handleScrollToTop}
        >
          <ChevronsUp />
        </IconButton>
      )}
    </section>
  );
}

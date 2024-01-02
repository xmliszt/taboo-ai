'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronsUp } from 'lucide-react';

import { LevelCard } from '@/components/custom/level-card';
import LevelsSearchBar from '@/components/custom/levels/levels-search-bar';
import { Skeleton } from '@/components/custom/skeleton';
import IconButton from '@/components/ui/icon-button';
import { useLevels } from '@/lib/hooks/useLevels';
import { getLevelTopScorerStats } from '@/lib/services/levelService';
import { LevelUtils, SortType } from '@/lib/utils/levelUtils';

export default function LevelsPage() {
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] = useState(false);
  const [selectedSorter, setSelectedSorter] = useState<SortType>('create-new');
  const levelSectionRef = useRef<HTMLDivElement | null>(null);
  const { filteredLevels, setFilterKeyword, isFetchingLevels } = useLevels();
  const sortedLevels = useMemo(
    () => [...filteredLevels].sort(LevelUtils.getCompareFn(selectedSorter)),
    [selectedSorter, filteredLevels]
  );
  const [levelRankingStats, setLevelRankingStats] = useState<{
    [key: string]: { level_id: string; player_ids: string[]; total_score: number };
  }>();

  const [isRankingModeOn, setIsRankingModeOn] = useState(false);

  useEffect(() => {
    async function getLevelsRankStats() {
      const stats = await getLevelTopScorerStats();
      setLevelRankingStats(stats);
    }

    if (isRankingModeOn) void getLevelsRankStats();
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
    <section className='flex h-full w-full flex-col overflow-y-hidden'>
      <div className='h-30 w-full border border-b-primary bg-card px-4 py-4 lg:px-12'>
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
        className='flex w-full flex-grow flex-wrap content-start justify-center gap-8 overflow-auto px-4 py-10 text-center'
        onScroll={onScrollChange}
      >
        {/* AI Mode Card */}
        <LevelCard allowedPlanType={['pro']} />

        {/* Levels Card */}
        {isFetchingLevels ? (
          <Skeleton numberOfRows={8} className='flex-grow' />
        ) : (
          sortedLevels.map((level, idx) => (
            <LevelCard
              key={idx}
              level={level}
              isShowingRank={isRankingModeOn}
              topScore={levelRankingStats?.[level.id]?.total_score}
              topScorerIds={levelRankingStats?.[level.id]?.player_ids}
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

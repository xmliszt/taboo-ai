import { LevelsScrollArea } from '@/app/levels/levels-scroll-area';
import { fetchAllLevelsAndRanks } from '@/app/levels/server/fetch-levels';
import { LevelCard } from '@/components/custom/level-card';
import LevelsSearchBar from '@/components/custom/levels/levels-search-bar';
import { LevelUtils, SortType } from '@/lib/utils/levelUtils';

type LevelsPageProps = {
  searchParams: {
    rank?: string;
    search?: string;
    sort?: SortType;
  };
};
export default async function LevelsPage(props: LevelsPageProps) {
  const levels = await fetchAllLevelsAndRanks();
  const { rank, search, sort } = props.searchParams;
  const isRankingModeOn = rank === 'true';
  const searchTerm = search ?? '';
  const selectedSorter = sort ?? 'create-new';

  // filter levels by search term
  const filteredLevels = levels
    .filter((level) => {
      if (!searchTerm) return true;
      return (
        level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (level.created_by && level.created_by.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .filter((level) => level.is_verified);
  const sortedLevels = [...filteredLevels].sort(LevelUtils.getCompareFn(selectedSorter));

  return (
    <section className='flex h-full w-full flex-col overflow-y-hidden'>
      <div className='h-30 w-full border border-b-primary bg-card px-4 py-4 lg:px-12'>
        <LevelsSearchBar topicNumber={filteredLevels.length} />
      </div>
      <LevelsScrollArea>
        {/* AI Mode Card */}
        <LevelCard allowedPlanType={['pro']} />

        {/* Levels Card */}
        {sortedLevels.map((level, idx) => (
          <LevelCard key={idx} level={level} isShowingRank={isRankingModeOn} />
        ))}
      </LevelsScrollArea>
    </section>
  );
}

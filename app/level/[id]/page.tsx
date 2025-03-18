import { LevelPageClientWrapper } from '@/app/level/[id]/level-page-client-wrapper';
import { fetchLevel } from '@/app/level/[id]/server/fetch-level';
import { incrementLevelPopularity } from '@/app/level/[id]/server/increment-level-popularity';
import { formatStringForDisplay } from '@/lib/utilities';

export const maxDuration = 60; // 60 seconds

interface LevelPageProps {
  params: { id: string };
}

export default async function LevelPage({ params: { id } }: LevelPageProps) {
  // if AI mode, return with no words as it will be populated from persistent storage later on
  if (id === 'ai') return <LevelPageClientWrapper fromAIMode={true} words={[]} />;

  // fetch level for playing
  const level = await fetchLevel(id);

  // increment level popularity
  await incrementLevelPopularity(id);

  // generate target word for playing
  const words = level.words.map((word) => formatStringForDisplay(word));

  return <LevelPageClientWrapper level={level} fromAIMode={false} words={words} />;
}

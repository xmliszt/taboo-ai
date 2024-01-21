import { LevelWordsProvider } from '@/app/level/[id]/level-words-provider';
import { fetchLevel } from '@/app/level/server/fetch-level';
import { formatStringForDisplay } from '@/lib/utilities';

interface LevelPageProps {
  params: { id: string };
}

export default async function LevelPage({ params: { id } }: LevelPageProps) {
  // if AI mode, return with no words as it will be populated from persistent storage later on
  if (id === 'ai') return <LevelWordsProvider fromAIMode={true} words={[]} />;

  // fetch level for playing
  const level = await fetchLevel(id);

  // generate target word for playing
  const words = level.words.map((word) => formatStringForDisplay(word));

  return <LevelWordsProvider topic={level.name} fromAIMode={false} words={words} />;
}

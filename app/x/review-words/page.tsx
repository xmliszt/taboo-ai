import { fetchAllWords } from '@/app/x/review-words/fetch-all-words';
import { fetchAllLevelsAndAuthors } from '@/app/x/review-words/fetch-levels';
import ReviewWordsClientProvider from '@/app/x/review-words/review-words-client-provider';
import { LevelUtils } from '@/lib/utils/levelUtils';

export default async function ReviewWordsPage() {
  const levels = await fetchAllLevelsAndAuthors();
  const words = await fetchAllWords();
  const sortedLevels = [...levels].sort(LevelUtils.getCompareFn('create-new'));
  return (
    <ReviewWordsClientProvider
      levels={sortedLevels}
      words={words.map((word) => word.word.toLowerCase())}
    />
  );
}

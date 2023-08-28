import _ from 'lodash';
import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { firestore } from '@/firebase';
import ILevel from '@/lib/types/level.interface';

export const useLevels = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<ILevel[]>([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const deferredSearchTerm = useDeferredValue(filterKeyword);

  const fetchAllLevels = useCallback(async () => {
    setIsLoading(true);
    const snapshot = await getDocs(collection(firestore, 'levels'));
    const allLevels: ILevel[] = [];
    snapshot.forEach((result) => {
      const level = result.data() as ILevel;
      allLevels.push(level);
    });
    setLevels(allLevels);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAllLevels();
  }, [fetchAllLevels]);

  useEffect(() => {
    const filtered = levels
      .filter(
        (level) =>
          _.lowerCase(level.name).includes(_.lowerCase(deferredSearchTerm)) ||
          _.lowerCase(level.author).includes(_.lowerCase(deferredSearchTerm))
      )
      .filter((level) => level.isVerified);
    setFilteredLevels(filtered);
  }, [deferredSearchTerm, levels]);

  return { levels, filteredLevels, setFilterKeyword, isLoading };
};

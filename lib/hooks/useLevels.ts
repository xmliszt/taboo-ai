'use client';

import _ from 'lodash';
import { useCallback, useDeferredValue, useEffect, useState } from 'react';
import ILevel from '@/lib/types/level.interface';
import { getAllLevels } from '../services/levelService';
import { useToast } from '@/components/ui/use-toast';

export const useLevels = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<ILevel[]>([]);
  const [filterKeyword, setFilterKeyword] = useState('');
  const deferredSearchTerm = useDeferredValue(filterKeyword);

  const fetchAllLevels = useCallback(async () => {
    setIsLoading(true);
    try {
      const allLevels = await getAllLevels();
      setLevels(allLevels);
    } catch (error) {
      toast({
        title: 'Error fetching topics. Please try again!',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

  return {
    levels,
    filteredLevels,
    setFilterKeyword,
    isFetchingLevels: isLoading,
    refetch: fetchAllLevels,
  };
};

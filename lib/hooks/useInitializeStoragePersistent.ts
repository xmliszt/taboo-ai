'use client';

import { HASH } from '@/lib/hash';
import { setLevelStorage } from '@/lib/redux/features/levelStorageSlice';
import { setScoresStorage } from '@/lib/redux/features/scoreStorageSlice';
import { useAppDispatch } from '@/lib/redux/hook';
import ILevel from '@/lib/types/level.interface';
import { IDisplayScore } from '@/lib/types/score.interface';
import { useEffect } from 'react';

/// This provider handles the initial loads of persistent states into Redux store
export default function useInitializeStoragePersistent() {
  const dispatch = useAppDispatch();

  /// At start of app, restore persistent storage to redux store
  useEffect(() => {
    if (localStorage) {
      const levelStoreString = localStorage.getItem(HASH.level);
      if (!levelStoreString) return;
      try {
        const levelStore = JSON.parse(levelStoreString) as ILevel;
        dispatch(setLevelStorage(levelStore));
      } catch {
        return;
      }
    }
  }, []);

  /// At start of app, restore persistent storage to redux store
  useEffect(() => {
    if (localStorage) {
      const scoreStoreString = localStorage.getItem(HASH.scores);
      if (!scoreStoreString) return;
      try {
        const scoreStore = JSON.parse(scoreStoreString) as IDisplayScore[];
        dispatch(setScoresStorage(scoreStore));
      } catch {
        return;
      }
    }
  }, []);
}

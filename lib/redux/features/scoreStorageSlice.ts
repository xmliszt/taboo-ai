import { HASH } from '@/lib/hash';
import { IDisplayScore } from '@/lib/types/score.interface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const initialState: { scores: IDisplayScore[] | undefined } = {
  scores: undefined,
};

export const scoreStorageSlice = createSlice({
  name: 'scoreStorage',
  initialState,
  reducers: {
    setScoresStorage: (
      state,
      actions: PayloadAction<IDisplayScore[] | undefined>
    ) => {
      state.scores = actions.payload;
      if (actions.payload && actions.payload.length > 0) {
        localStorage.setItem(HASH.scores, JSON.stringify(actions.payload));
      } else {
        localStorage.removeItem(HASH.scores);
      }
    },
  },
});

export const { setScoresStorage } = scoreStorageSlice.actions;
export const selectScoreStorage = (state: RootState) =>
  state.scoreStorageReducer.scores;
export default scoreStorageSlice.reducer;

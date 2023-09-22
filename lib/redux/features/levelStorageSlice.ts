import { HASH } from '@/lib/hash';
import ILevel from '@/lib/types/level.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const initialState: { level: ILevel | undefined } = { level: undefined };

export const levelStorageSlice = createSlice({
  name: 'levelStorage',
  initialState,
  reducers: {
    setLevelStorage: (state, action: PayloadAction<ILevel | undefined>) => {
      state.level = action.payload;
      if (action.payload) {
        localStorage.setItem(HASH.level, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(HASH.level);
      }
    },
  },
});

export const { setLevelStorage } = levelStorageSlice.actions;
export const selectLevelStorage = (state: RootState) =>
  state.levelStorageReduer.level;
export default levelStorageSlice.reducer;

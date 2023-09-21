import { configureStore } from '@reduxjs/toolkit';
import levelStorageSlice from './features/levelStorageSlice';
import scoreStorageSlice from './features/scoreStorageSlice';

export const store = configureStore({
  reducer: {
    levelStorageReduer: levelStorageSlice,
    scoreStorageReducer: scoreStorageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

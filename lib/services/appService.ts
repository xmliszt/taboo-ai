import {
  DataSnapshot,
  increment,
  onValue,
  ref,
  update,
} from 'firebase/database';
import { realtime } from '../firebase-client';

export const listenToAppStats = (
  onSnapshotUpdated: (snapshot: DataSnapshot) => unknown
) => {
  onValue(ref(realtime, 'stats/'), onSnapshotUpdated);
};

export const incrementView = () => {
  const updates = {
    'stats/views': increment(1),
  };
  update(ref(realtime), updates);
};

import { firestore, realtime } from '@/lib/firebase-client';
import {
  ref,
  update,
  increment as realtimeIncrement,
  get,
  child,
} from 'firebase/database';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import moment from 'moment';
import ILevel from '../types/level.type';
import IUser from '../types/user.type';
import { DateUtils } from '../utils/dateUtils';

export const getAllLevels = async (): Promise<ILevel[]> => {
  const snapshot = await getDocs(collection(firestore, 'levels'));
  const allLevels: ILevel[] = [];
  snapshot.forEach((result) => {
    const level = result.data() as ILevel;
    level.id = result.id;
    allLevels.push(level);
  });
  return allLevels;
};

export const addLevel = async ({
  name,
  difficulty,
  words,
  author = undefined,
  authorEmail = undefined,
  isNew = undefined,
  isVerified = false,
  createdAt = moment().format(DateUtils.formats.levelCreatedAt),
}: {
  name: string; // Name could be the same
  difficulty: number;
  words: string[];
  author?: string;
  authorEmail?: string;
  isNew?: boolean;
  isVerified?: boolean;
  createdAt?: string;
}) => {
  await addDoc(collection(firestore, 'levels'), {
    name,
    difficulty,
    words,
    isVerified,
    author,
    authorEmail,
    isNew,
    createdAt,
    popularity: 0,
  });
};

export const getLevel = async (id: string): Promise<ILevel | undefined> => {
  const snapshot = await getDoc(doc(firestore, 'levels', id));
  const level = snapshot.data() as ILevel;
  if (level) {
    level.id = snapshot.id;
    return level;
  }
  return undefined;
};

export const isLevelExists = async (
  topicName?: string,
  authorEmail?: string
): Promise<boolean> => {
  if (!topicName || !authorEmail) {
    return false;
  }
  const snapshot = await getCountFromServer(
    query(
      collection(firestore, 'levels'),
      where('authorEmail', '==', authorEmail),
      where('name', '==', topicName)
    )
  );
  return snapshot.data().count > 0;
};

export const updateLevelTargetWords = async (
  id: string,
  words: string[]
): Promise<void> => {
  await updateDoc(doc(firestore, 'levels', id), { words: words });
};

export const updateLevelIsNew = async (
  id: string,
  isNew: boolean
): Promise<void> => {
  await updateDoc(doc(firestore, 'levels', id), { isNew: isNew });
};

export const deleteLevel = async (id: string): Promise<void> => {
  await deleteDoc(doc(firestore, 'levels', id));
};

export const verifyLevel = async (id: string): Promise<void> => {
  await updateDoc(doc(firestore, 'levels', id), { isVerified: true });
};

export const incrementLevelPopularity = async (id: string) => {
  await updateDoc(doc(firestore, 'levels', id), { popularity: increment(1) });
};

/**
 * Create the level document in users/{email}/levels if not exists, otherwise,
 * update the score if score is the highest, update the playedAt if playedAt is the latest.
 * @param {string} email: the user email
 * @param {ILevel} level: the level attempted
 * @param {Date} playedAt: the date the level is attempted
 * @param {number} score: the total score of the level
 */
export const uploadPlayedLevelForUser = async (
  email: string,
  level: ILevel,
  playedAt: Date,
  score: number
) => {
  const levelRef = doc(firestore, 'users', email, 'levels', level.id);
  const levelSnapshot = await getDoc(levelRef);
  if (!levelSnapshot.exists()) {
    await setDoc(levelRef, {
      lastPlayedAt: playedAt,
      bestScore: score,
      attempts: increment(1),
      ref: doc(firestore, 'levels', level.id),
    });
  } else {
    const levelData = levelSnapshot.data();
    if (levelData) {
      const lastPlayedAt = levelData.lastPlayedAt;
      const bestScore = levelData.bestScore;
      await updateDoc(levelRef, {
        attempts: increment(1),
        lastPlayedAt: lastPlayedAt > playedAt ? lastPlayedAt : playedAt,
        bestScore: bestScore > score ? bestScore : score,
      });
    }
  }
};

/**
 * Update Realtime Database level record with the current scorer.
 * If such level ID does not exist, create a new record, the scorer automatically
 * becomes the top scorer. If exists, then we compare if the scorer has higher score
 * than the current top score, if yes, we overwrite and udpate the top scorer. If not, we
 * ignore, simply increase the attemp count only.
 * @param {string} levelID: the level ID
 * @param {IUser} scorer: the user who scored
 * @param {number} score: the score of the scorer
 * @returns {Promise<void>}
 */
export const updateRealtimeDBLevelRecord = async (
  levelID: string,
  scorer: IUser,
  score: number
): Promise<void> => {
  const currentRecord = await get(child(ref(realtime, 'levelStats'), levelID));
  const prevTopScore = currentRecord.val()?.topScore ?? -Infinity;
  const prevTopScorer = currentRecord.val()?.topScorer ?? undefined;
  const updates = {
    attempts: realtimeIncrement(1),
    topScore: Math.max(prevTopScore, score),
    topScorer: prevTopScore > score ? prevTopScorer : scorer.email,
  };
  await update(child(ref(realtime, 'levelStats'), levelID), updates);
};

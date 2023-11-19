import { firestore, realtime } from '@/firebase/firebase-client';
import {
  ref,
  update,
  get,
  child,
  onValue,
  DataSnapshot,
  Unsubscribe,
} from 'firebase/database';
import {
  DocumentReference,
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
import ILevelStats from '../types/levelStats.type';
import IUserLevel from '../types/userLevel.type';

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
    await setDoc(
      levelRef,
      {
        lastPlayedAt: playedAt,
        bestScore: score,
        ref: doc(firestore, 'levels', level.id),
      },
      { merge: true }
    );
  } else {
    const levelData = levelSnapshot.data();
    if (levelData) {
      const lastPlayedAt = levelData.lastPlayedAt;
      const bestScore = levelData.bestScore;
      await updateDoc(levelRef, {
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
  const prevTopScorerEmail = currentRecord.val()?.topScorer ?? scorer.email;
  const prevTopScorerNickname =
    currentRecord.val()?.topScorerName ?? scorer.nickname ?? 'Anonymous';
  const levelStat = {
    topScore: Math.max(prevTopScore, score),
    topScorer: prevTopScore > score ? prevTopScorerEmail : scorer.email,
    topScorerName:
      prevTopScore > score
        ? prevTopScorerNickname
        : scorer.anonymity
        ? 'Anonymous'
        : scorer.nickname ?? scorer.name ?? 'Anonymous',
  };
  await update(child(ref(realtime, 'levelStats'), levelID), levelStat);
};

/**
 * Get the statistical data for levels played by the user
 * @param {string} email: the user email
 * @returns {Promise<ILevelStats>} the level statistical data for the user
 */
export const getLevelStatistics = async (
  email: string
): Promise<ILevelStats> => {
  const snapshot = await getDocs(
    collection(firestore, 'users', email, 'levels')
  );
  const levelRefs: {
    ref: DocumentReference;
    score: number;
    attempts: number;
  }[] = [];
  snapshot.forEach((result) => {
    levelRefs.push({
      ref: result.data().ref,
      score: result.data().bestScore as number,
      attempts: result.data().attempts as number,
    });
  });
  if (levelRefs.length === 0)
    return {
      bestPerformingLevel: undefined,
      mostFrequentlyPlayedLevel: undefined,
    };
  const levels: {
    id: string;
    name: string;
    difficulty: number;
    score: number;
    attempts: number;
  }[] = [];
  for (const levelRef of levelRefs) {
    const levelSnapshot = await getDoc(levelRef.ref);
    const level = levelSnapshot.data() as ILevel;
    level.id = levelSnapshot.id;
    levels.push({
      id: levelSnapshot.id,
      name: level.name,
      difficulty: level.difficulty,
      score: levelRef.score,
      attempts: levelRef.attempts,
    });
  }
  // Get the best performing level
  const bestPerformingLevel = levels.reduce((prev, current) => {
    return prev.score > current.score ? prev : current;
  });
  const mostFrequentlyPlayedLevel = levels.reduce((prev, current) => {
    return prev.attempts > current.attempts ? prev : current;
  });
  return {
    bestPerformingLevel: {
      id: bestPerformingLevel.id,
      name: bestPerformingLevel.name,
      difficulty: bestPerformingLevel.difficulty,
      score: bestPerformingLevel.score,
    },
    mostFrequentlyPlayedLevel: {
      id: mostFrequentlyPlayedLevel.id,
      name: mostFrequentlyPlayedLevel.name,
      difficulty: mostFrequentlyPlayedLevel.difficulty,
      attempts: mostFrequentlyPlayedLevel.attempts,
    },
  };
};

/**
 * Listen to the level ranking stats from Firebase Realtime Database
 * @param {function} onLevelRankingStatsUpdated: the callback function to be called when the level ranking stats is updated
 * @returns {Unsubscribe} the unsubscribe function
 */
export const bindLevelRankingStatsListener = (
  onLevelRankingStatsUpdated: (snapshot: DataSnapshot) => unknown
): Unsubscribe => {
  const unbind = onValue(
    ref(realtime, 'levelStats/'),
    onLevelRankingStatsUpdated
  );
  return unbind;
};

export const getLevelsByUser = async (email: string): Promise<IUserLevel[]> => {
  const snapshot = await getDocs(
    collection(firestore, 'users', email, 'levels')
  );
  const levels: IUserLevel[] = [];
  snapshot.forEach((result) => {
    const levelData = result.data() as IUserLevel;
    levelData.levelId = result.id;
    levels.push(levelData);
  });
  return levels;
};

export const getLevelStatById = async (
  levelId: string
): Promise<{
  topScore: number;
  topScorer: string;
  topScorerName: string;
}> => {
  const snapshot = await get(child(ref(realtime, 'levelStats'), levelId));
  return snapshot.val();
};

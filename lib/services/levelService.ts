import { firestore } from '@/lib/firebase-client';
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
  updateDoc,
  where,
} from 'firebase/firestore';
import moment from 'moment';
import ILevel from '../types/level.type';
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

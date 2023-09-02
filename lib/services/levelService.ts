import { firestore } from '@/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import moment from 'moment';
import ILevel from '../types/level.interface';
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
  isNew = undefined,
  isVerified = false,
  createdAt = moment().format(DateUtils.formats.levelCreatedAt),
}: {
  name: string; // Name could be the same
  difficulty: number;
  words: string[];
  author?: string;
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
    isNew,
    createdAt,
  });
};

export const updateLevel = async (level: ILevel): Promise<void> => {
  await updateDoc(doc(firestore, 'levels', level.id), { ...level });
};

export const deleteLevel = async (id: string): Promise<void> => {
  await deleteDoc(doc(firestore, 'levels', id));
};

export const verifyLevel = async (id: string): Promise<void> => {
  await updateDoc(doc(firestore, 'levels', id), { isVerified: true });
};

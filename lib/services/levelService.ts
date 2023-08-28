import { firestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import moment from 'moment';
import { DateUtils } from '../utils/dateUtils';

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

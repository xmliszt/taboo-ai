import { firestore } from '@/lib/firebase-client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import _ from 'lodash';
import moment from 'moment';
import IWord from '../types/word.type';
import { DateUtils } from '../utils/dateUtils';

export const isTargetWordExists = async (
  targetWord: string
): Promise<boolean> => {
  const target = _.toLower(_.trim(targetWord));
  return (await getDoc(doc(firestore, 'words', target))).exists();
};

export const getAllTargetWords = async (): Promise<IWord[]> => {
  const snapshots = await getDocs(collection(firestore, 'words'));
  const results: IWord[] = [];
  snapshots.forEach((snapshot) => {
    const data = snapshot.data();
    const word: IWord = {
      target: data.target,
      taboos: data.taboos as string[],
      isVerified: data.isVerified,
      updatedAt: data.updatedAt,
    };
    results.push(word);
  });
  return results;
};

export const addTabooWords = async (
  targetWord: string,
  taboos: string[],
  isVerified = false,
  creatorEmail: string | undefined = undefined
): Promise<void> => {
  const target = _.toLower(_.trim(targetWord));
  await setDoc(doc(firestore, 'words', target), {
    target: target,
    taboos: taboos.map(_.trim).map(_.toLower),
    isVerified: isVerified,
    updatedAt: moment().format(DateUtils.formats.wordUpdatedAt),
    creatorEmail,
  });
};

export const verifyTabooWords = async (targetWord: string): Promise<void> => {
  const target = _.toLower(_.trim(targetWord));
  await updateDoc(doc(firestore, 'words', target), {
    isVerified: true,
  });
};

export const getTabooWords = async (
  targetWord: string
): Promise<IWord | undefined> => {
  const target = _.toLower(_.trim(targetWord));
  const snapshot = await getDoc(doc(firestore, 'words', target));
  const data = snapshot.data();
  if (data) {
    return data as IWord;
  } else {
    return undefined;
  }
};

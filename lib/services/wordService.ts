import { firestore } from '@/firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import _ from 'lodash';
import IWord from '../types/word.interface';

export const isTargetWordExists = async (
  targetWord: string
): Promise<boolean> => {
  return await (
    await getDoc(doc(firestore, 'words', _.toLower(targetWord)))
  ).exists();
};

export const getAllTargetWords = async (): Promise<IWord[]> => {
  const snapshots = await getDocs(collection(firestore, 'words'));
  const results: IWord[] = [];
  snapshots.forEach((snapshot) => {
    const data = snapshot.data();
    const word: IWord = {
      target: snapshot.id,
      taboos: data.taboos as string[],
    };
    results.push(word);
  });
  return results;
};

export const addTabooWords = async (
  targetWord: string,
  taboos: string[]
): Promise<void> => {
  await setDoc(doc(firestore, 'words', _.toLower(targetWord)), {
    taboos: taboos.map(_.toLower),
  });
};

export const getTabooWords = async (targetWord: string): Promise<string[]> => {
  const snapshot = await getDoc(doc(firestore, 'words', _.toLower(targetWord)));
  const data = snapshot.data();
  if (data) {
    return data.taboos as string[];
  } else {
    return [];
  }
};

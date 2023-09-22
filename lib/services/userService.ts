import { firestore } from '@/lib/firebase-client';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import IUser from '../types/user.type';
import { DateUtils } from '../utils/dateUtils';

export const getUser = async (
  email: string
): Promise<IUser | null | undefined> => {
  const snapshot = await getDoc(doc(firestore, 'users', email));
  if (snapshot.exists()) {
    return snapshot.data() as IUser;
  }
  return null;
};

export const updateUserFromUser = async (user: IUser): Promise<IUser> => {
  const email = user.email;
  if (!email) {
    throw Error('user email not present!');
  }
  await setDoc(doc(firestore, 'users', email), { ...user }, { merge: true });
  return user;
};

export const updateUserFromAuth = async (user: User): Promise<IUser> => {
  const email = user.email;
  if (!email) {
    throw Error('user email not present!');
  }
  const newUser: IUser = {
    name: user.displayName ?? undefined,
    email: email,
    photoUrl: user.photoURL ?? undefined,
    firstLoginAt: moment(user.metadata.creationTime).format(
      DateUtils.formats.userLoginAt
    ),
    lastLoginAt: moment(user.metadata.lastSignInTime).format(
      DateUtils.formats.userLoginAt
    ),
  };
  await setDoc(doc(firestore, 'users', email), { ...newUser }, { merge: true });
  return newUser;
};

export const signinUser = async (email: string) => {
  await updateDoc(doc(firestore, 'users', email), {
    lastLoginAt: moment().format(DateUtils.formats.userLoginAt),
  });
};

export const updateUIDIfNotExist = async (email: string, uid: string) => {
  await updateDoc(doc(firestore, 'users', email), {
    uid: uid,
  });
};

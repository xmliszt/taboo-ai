import { User } from 'firebase/auth';
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';

import { firestore } from '@/firebase/firebase-client';

import { SubscriptionPlanType } from '../types/subscription-plan.type';
import IUser from '../types/user.type';
import { DateUtils } from '../utils/dateUtils';

export const getUser = async (email: string): Promise<IUser | null | undefined> => {
  const snapshot = await getDoc(doc(firestore, 'users', email));
  if (snapshot.exists()) {
    return snapshot.data() as IUser;
  }
  return null;
};

export const updateUserAnonymity = async (email: string, anonymity: boolean) => {
  await updateDoc(doc(firestore, 'users', email), {
    anonymity: anonymity,
  });
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
    firstLoginAt: moment(user.metadata.creationTime).format(DateUtils.formats.userLoginAt),
    lastLoginAt: moment(user.metadata.lastSignInTime).format(DateUtils.formats.userLoginAt),
    gameAttemptedCount: 0,
    gamePlayedCount: 0,
    levelPlayedCount: 0,
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

export const deleteUserFromFirebase = async (email: string) => {
  await deleteDoc(doc(firestore, 'users', email));
};

export const incrementGameAttemptedCount = async (email: string) => {
  await updateDoc(doc(firestore, 'users', email), {
    gameAttemptedCount: increment(1),
  });
};

export const updateUserSubscriptionPlan = async (
  email: string,
  customerPlanType: SubscriptionPlanType
) => {
  await updateDoc(doc(firestore, 'users', email), {
    customerPlanType,
  });
};

export const fetchUserSubscription = async (
  email: string
): Promise<
  | {
      email: string;
      customerId: string;
      customerPlanType: SubscriptionPlanType;
    }
  | undefined
> => {
  const snapshot = await getDoc(doc(firestore, 'subscriptions', email));
  if (snapshot.exists()) {
    return snapshot.data() as {
      email: string;
      customerId: string;
      customerPlanType: SubscriptionPlanType;
    };
  } else {
    return undefined;
  }
};

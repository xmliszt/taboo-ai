import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore';

import { firestore } from '@/firebase/firebase-client';
import { createClient } from '@/lib/utils/supabase/client';

import { SubscriptionPlanType } from '../types/subscription-plan.type';
import { IUser } from '../types/user.type';

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

export const updateUserNickname = async (uid: string, nickname: string) => {
  const supabaseClient = createClient();
  const { error } = await supabaseClient.from('users').update({ nickname }).eq('id', uid);
  if (error) throw error;
};

export const updateUserFromUser = async (user: IUser): Promise<IUser> => {
  const email = user.email;
  if (!email) {
    throw Error('user email not present!');
  }
  await setDoc(doc(firestore, 'users', email), { ...user }, { merge: true });
  return user;
};

export const deleteUserFromSupabase = async (uid: string) => {
  const supabaseClient = createClient();
  const deleteUserResponse = await supabaseClient.from('users').delete().eq('id', uid);
  if (deleteUserResponse.error) {
    throw deleteUserResponse.error;
  }
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

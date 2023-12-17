import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';

import { firebaseAuth } from '@/firebase/firebase-client';

export const signInWithGoogle = async () => {
  await setPersistence(firebaseAuth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return await signInWithPopup(firebaseAuth, provider);
};

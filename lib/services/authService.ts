import { firebaseAuth } from '@/firebase';
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';

export const signInWithGoogle = async () => {
  await setPersistence(firebaseAuth, browserSessionPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return await signInWithPopup(firebaseAuth, provider);
};

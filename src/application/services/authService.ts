import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/client';
import { getUser, createUser } from '../../infrastructure/repositories/userRepository';
import type { User } from '../domain';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<{ user: FirebaseUser; isNew: boolean }> {
  const result = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;

  const existing = await getUser(firebaseUser.uid);
  if (!existing) {
    return { user: firebaseUser, isNew: true };
  }

  return { user: firebaseUser, isNew: false };
}

export async function completeSignUp(firebaseUser: FirebaseUser, role: User['role']): Promise<User> {
  const user: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    name: firebaseUser.displayName ?? '',
    role,
  };
  await createUser(user);
  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

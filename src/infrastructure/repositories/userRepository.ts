import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import type { User, Role } from '../../application/domain';

const COLLECTION = 'users';

export async function getUser(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, COLLECTION, uid));
  if (!snap.exists()) return null;
  return snap.data() as User;
}

export async function createUser(user: User): Promise<void> {
  await setDoc(doc(db, COLLECTION, user.id), {
    ...user,
    createdAt: serverTimestamp(),
  });
}

export async function updateUserRole(uid: string, role: Role): Promise<void> {
  await updateDoc(doc(db, COLLECTION, uid), { role });
}

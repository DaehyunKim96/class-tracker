import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
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

// 이름 prefix 검색 — Firestore는 starts-with만 지원
export async function searchUsersByName(nameQuery: string): Promise<User[]> {
  if (!nameQuery.trim()) return [];
  const q = query(
    collection(db, COLLECTION),
    where('name', '>=', nameQuery),
    where('name', '<=', nameQuery + ''),
    orderBy('name'),
    limit(10),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as User);
}

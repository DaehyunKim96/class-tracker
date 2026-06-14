import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import type { Student } from '../../application/domain';

const COLLECTION = 'students';

export async function getStudentsByTeacher(teacherId: string): Promise<Student[]> {
  const q = query(collection(db, COLLECTION), where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Student));
}

export async function getStudentByUid(studentUid: string): Promise<Student | null> {
  const q = query(collection(db, COLLECTION), where('studentUid', '==', studentUid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Student;
}

export async function getStudentsByParent(parentUid: string): Promise<Student[]> {
  const q = query(
    collection(db, COLLECTION),
    where('parentUids', 'array-contains', parentUid),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Student));
}

export async function createStudent(
  data: Omit<Student, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteStudent(studentId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, studentId));
}

export async function addParentToStudent(
  studentId: string,
  parentUid: string,
): Promise<void> {
  const snap = await getDoc(doc(db, COLLECTION, studentId));
  if (!snap.exists()) return;
  const current: string[] = snap.data().parentUids ?? [];
  if (current.includes(parentUid)) return;
  await updateDoc(doc(db, COLLECTION, studentId), {
    parentUids: [...current, parentUid],
  });
}

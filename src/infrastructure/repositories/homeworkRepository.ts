import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import type { Homework } from '../../application/domain';

const COLLECTION = 'homework';

type HomeworkDoc = Omit<Homework, 'id' | 'createdAt' | 'completedAt'> & {
  createdAt: Timestamp;
  completedAt?: Timestamp | null;
};

const toHomework = (id: string, data: HomeworkDoc): Homework => ({
  id,
  teacherId: data.teacherId,
  studentId: data.studentId,
  title: data.title,
  description: data.description,
  dueDate: data.dueDate,
  completed: data.completed,
  completedAt: data.completedAt ? data.completedAt.toDate().toISOString() : undefined,
  createdAt: data.createdAt.toDate().toISOString(),
});

export async function createHomework(
  data: Omit<Homework, 'id' | 'createdAt' | 'completedAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    completedAt: null,
  });
  return ref.id;
}

export async function getHomeworkByTeacher(teacherId: string): Promise<Homework[]> {
  const q = query(collection(db, COLLECTION), where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toHomework(d.id, d.data() as HomeworkDoc));
}

export async function getHomeworkByStudent(studentId: string): Promise<Homework[]> {
  const q = query(collection(db, COLLECTION), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toHomework(d.id, d.data() as HomeworkDoc));
}

export async function setHomeworkCompleted(
  id: string,
  completed: boolean,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    completed,
    completedAt: completed ? serverTimestamp() : null,
  });
}

export async function deleteHomework(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

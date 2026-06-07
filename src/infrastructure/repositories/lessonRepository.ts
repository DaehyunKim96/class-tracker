import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import type { Lesson, LessonDraft } from '../../application/domain';

const COLLECTION = 'lessons';

type LessonDoc = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

const toLesson = (id: string, data: LessonDoc): Lesson => ({
  id,
  studentId: data.studentId,
  teacherId: data.teacherId,
  date: data.date,
  startTime: data.startTime,
  endTime: data.endTime,
  subject: data.subject,
  status: data.status,
  content: data.content,
  createdBy: data.createdBy,
  createdAt: data.createdAt.toDate().toISOString(),
  updatedAt: data.updatedAt.toDate().toISOString(),
});

export async function listLessonsByStudent(studentId: string): Promise<Lesson[]> {
  const q = query(collection(db, COLLECTION), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toLesson(d.id, d.data() as LessonDoc));
}

export async function listLessonsByTeacher(teacherId: string): Promise<Lesson[]> {
  const q = query(collection(db, COLLECTION), where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toLesson(d.id, d.data() as LessonDoc));
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return toLesson(snap.id, snap.data() as LessonDoc);
}

export async function createLesson(draft: LessonDraft): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...draft,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLesson(
  id: string,
  patch: Partial<LessonDraft>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLesson(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

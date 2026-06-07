import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import type { Announcement } from '../../application/domain';

const COLLECTION = 'announcements';

type AnnouncementDoc = Omit<Announcement, 'id' | 'createdAt'> & {
  createdAt: Timestamp;
};

const toAnnouncement = (id: string, data: AnnouncementDoc): Announcement => ({
  id,
  teacherId: data.teacherId,
  teacherName: data.teacherName,
  studentIds: data.studentIds,
  title: data.title,
  body: data.body,
  readBy: data.readBy ?? [],
  createdAt: data.createdAt.toDate().toISOString(),
});

export async function createAnnouncement(
  data: Omit<Announcement, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAnnouncementsByTeacher(
  teacherId: string,
): Promise<Announcement[]> {
  const q = query(collection(db, COLLECTION), where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toAnnouncement(d.id, d.data() as AnnouncementDoc));
}

export async function getAnnouncementsForStudent(
  studentId: string,
): Promise<Announcement[]> {
  const q = query(
    collection(db, COLLECTION),
    where('studentIds', 'array-contains', studentId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toAnnouncement(d.id, d.data() as AnnouncementDoc));
}

export async function markAsRead(id: string, uid: string): Promise<void> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return;
  const readBy: string[] = snap.data().readBy ?? [];
  if (readBy.includes(uid)) return;
  await updateDoc(doc(db, COLLECTION, id), { readBy: arrayUnion(uid) });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/client';
import type { Invitation, InvitationStatus } from '../../application/domain';
import { stripUndefined } from './utils';

const COLLECTION = 'invitations';

type InvitationDoc = Omit<Invitation, 'id' | 'createdAt'> & {
  createdAt: Timestamp;
};

const toInvitation = (id: string, data: InvitationDoc): Invitation => ({
  id,
  teacherId: data.teacherId,
  teacherName: data.teacherName,
  senderName: data.senderName,
  parentUid: data.parentUid,
  inviteeUid: data.inviteeUid,
  inviteeRole: data.inviteeRole,
  studentId: data.studentId,
  subjects: data.subjects,
  status: data.status,
  createdAt: data.createdAt.toDate().toISOString(),
});

export async function createInvitation(
  data: Omit<Invitation, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getInvitationsByInvitee(inviteeUid: string): Promise<Invitation[]> {
  const q = query(collection(db, COLLECTION), where('inviteeUid', '==', inviteeUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toInvitation(d.id, d.data() as InvitationDoc));
}

export async function getInvitationsByTeacher(teacherId: string): Promise<Invitation[]> {
  const q = query(collection(db, COLLECTION), where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toInvitation(d.id, d.data() as InvitationDoc));
}

export async function updateInvitationStatus(
  invitationId: string,
  status: InvitationStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, invitationId), { status });
}

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
import type { LessonProposal, ProposalStatus } from '../../application/domain';
import { stripUndefined } from './utils';

const COLLECTION = 'proposals';

type ProposalDoc = Omit<LessonProposal, 'id' | 'createdAt'> & {
  createdAt: Timestamp;
};

const toProposal = (id: string, data: ProposalDoc): LessonProposal => ({
  id,
  studentId: data.studentId,
  teacherId: data.teacherId,
  proposedBy: data.proposedBy,
  proposerName: data.proposerName,
  date: data.date,
  startTime: data.startTime,
  endTime: data.endTime,
  subject: data.subject,
  content: data.content,
  status: data.status,
  createdAt: data.createdAt.toDate().toISOString(),
});

export async function createProposal(
  data: Omit<LessonProposal, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getProposalsByTeacher(
  teacherId: string,
): Promise<LessonProposal[]> {
  const q = query(collection(db, COLLECTION), where('teacherId', '==', teacherId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProposal(d.id, d.data() as ProposalDoc));
}

export async function getProposalsByProposer(
  proposerUid: string,
): Promise<LessonProposal[]> {
  const q = query(collection(db, COLLECTION), where('proposedBy', '==', proposerUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProposal(d.id, d.data() as ProposalDoc));
}

export async function getProposalsByStudent(
  studentId: string,
): Promise<LessonProposal[]> {
  const q = query(collection(db, COLLECTION), where('studentId', '==', studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProposal(d.id, d.data() as ProposalDoc));
}

export async function updateProposalStatus(
  id: string,
  status: ProposalStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status });
}

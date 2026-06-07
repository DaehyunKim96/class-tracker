import {
  createProposal,
  updateProposalStatus,
} from '../../infrastructure/repositories/proposalRepository';
import { createLesson } from '../../infrastructure/repositories/lessonRepository';
import {
  getStudentByUid,
  getStudentsByParent,
} from '../../infrastructure/repositories/studentRepository';
import type { LessonProposal, User, Student } from '../domain';

export async function getMyStudents(user: User): Promise<Student[]> {
  if (user.role === 'student') {
    const s = await getStudentByUid(user.id);
    return s ? [s] : [];
  }
  if (user.role === 'parent') {
    return getStudentsByParent(user.id);
  }
  return [];
}

export async function submitProposal(
  user: User,
  data: {
    studentId: string;
    teacherId: string;
    date: string;
    startTime: string;
    endTime: string;
    subject: string;
    content?: string;
  },
): Promise<void> {
  await createProposal({
    ...data,
    proposedBy: user.id,
    proposerName: user.name,
    status: 'pending',
  });
}

export async function acceptProposal(proposal: LessonProposal): Promise<void> {
  await createLesson({
    studentId: proposal.studentId,
    teacherId: proposal.teacherId,
    date: proposal.date,
    startTime: proposal.startTime,
    endTime: proposal.endTime,
    subject: proposal.subject,
    content: proposal.content,
    status: 'scheduled',
    createdBy: proposal.proposedBy,
  });
  await updateProposalStatus(proposal.id, 'accepted');
}

export async function rejectProposal(id: string): Promise<void> {
  await updateProposalStatus(id, 'rejected');
}

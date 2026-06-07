import {
  createInvitation,
  getInvitationsByTeacher,
  updateInvitationStatus,
} from '../../infrastructure/repositories/invitationRepository';
import { createStudent } from '../../infrastructure/repositories/studentRepository';
import type { Invitation, InviteeRole, User } from '../domain';

export async function sendInvitation(
  teacher: { id: string; name: string },
  inviteeUid: string,
  inviteeRole: InviteeRole,
  subjects: string[],
): Promise<void> {
  const existing = await getInvitationsByTeacher(teacher.id);
  const hasPending = existing.some(
    (inv) => inv.inviteeUid === inviteeUid && inv.status === 'pending',
  );
  if (hasPending) throw new Error('이미 초대장을 보낸 사용자입니다.');

  await createInvitation({
    teacherId: teacher.id,
    teacherName: teacher.name,
    inviteeUid,
    inviteeRole,
    subjects,
    status: 'pending',
  });
}

export async function acceptInvitation(
  invitation: Invitation,
  inviteeUser: User,
): Promise<void> {
  await updateInvitationStatus(invitation.id, 'accepted');

  if (invitation.inviteeRole === 'student') {
    await createStudent({
      teacherId: invitation.teacherId,
      studentUid: inviteeUser.id,
      parentUids: [],
      name: inviteeUser.name,
      subjects: invitation.subjects,
    });
  }
}

export async function rejectInvitation(invitationId: string): Promise<void> {
  await updateInvitationStatus(invitationId, 'rejected');
}

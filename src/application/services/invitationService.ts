import {
  createInvitation,
  getInvitationsByTeacher,
  updateInvitationStatus,
} from '../../infrastructure/repositories/invitationRepository';
import { createStudent, addParentToStudent, getStudentByUid } from '../../infrastructure/repositories/studentRepository';
import type { Invitation, InviteeRole, User, Student } from '../domain';

export async function sendInvitation(
  teacher: { id: string; name: string },
  inviteeUid: string,
  inviteeName: string,
  inviteeRole: InviteeRole,
  subjects: string[],
  studentId?: string,
): Promise<void> {
  const existing = await getInvitationsByTeacher(teacher.id);
  const alreadySent = existing.some(
    (inv) =>
      inv.inviteeUid === inviteeUid &&
      (inv.status === 'pending' || inv.status === 'accepted'),
  );
  if (alreadySent) throw new Error('이미 초대했거나 수락된 사용자입니다.');

  await createInvitation({
    teacherId: teacher.id,
    teacherName: teacher.name,
    inviteeUid,
    inviteeName,
    inviteeRole,
    studentId,
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
    if (invitation.parentUid) {
      // 학부모가 학생에게 연결 요청 → 학생 수락 시 parentUid를 parentUids에 추가
      const studentRecord = await getStudentByUid(inviteeUser.id);
      if (studentRecord) await addParentToStudent(studentRecord.id, invitation.parentUid);
    } else {
      // 선생님이 학생 초대 → Student 레코드 생성
      await createStudent({
        teacherId: invitation.teacherId,
        studentUid: inviteeUser.id,
        parentUids: [],
        name: inviteeUser.name,
        subjects: invitation.subjects,
      });
    }
  } else if (invitation.inviteeRole === 'parent' && invitation.studentId) {
    await addParentToStudent(invitation.studentId, inviteeUser.id);
  }
}

export async function rejectInvitation(invitationId: string): Promise<void> {
  await updateInvitationStatus(invitationId, 'rejected');
}

export async function connectStudentByParent(
  parentUser: User,
  studentUid: string,
): Promise<void> {
  const studentRecord = await getStudentByUid(studentUid);
  if (!studentRecord) {
    throw new Error('학생 정보를 찾을 수 없습니다. 먼저 선생님 초대를 수락해야 합니다.');
  }
  if (studentRecord.parentUids.includes(parentUser.id)) {
    throw new Error('이미 연결된 학생입니다.');
  }
  const existing = await getInvitationsByTeacher(studentRecord.teacherId);
  const hasPending = existing.some(
    (inv) =>
      inv.inviteeUid === studentUid &&
      inv.parentUid === parentUser.id &&
      inv.status === 'pending',
  );
  if (hasPending) throw new Error('이미 연결 요청을 보낸 학생입니다.');

  await createInvitation({
    teacherId: studentRecord.teacherId,
    teacherName: '',
    senderName: parentUser.name,
    parentUid: parentUser.id,
    inviteeUid: studentUid,
    inviteeRole: 'student',
    studentId: studentRecord.id,
    subjects: studentRecord.subjects,
    status: 'pending',
  });
}

export async function connectParentByStudent(
  studentRecord: Student,
  parentUid: string,
): Promise<void> {
  const existing = await getInvitationsByTeacher(studentRecord.teacherId);
  const hasPending = existing.some(
    (inv) => inv.inviteeUid === parentUid && inv.status === 'pending',
  );
  if (hasPending) throw new Error('이미 초대장을 보낸 사용자입니다.');

  const alreadyLinked = studentRecord.parentUids.includes(parentUid);
  if (alreadyLinked) throw new Error('이미 연결된 학부모입니다.');

  await createInvitation({
    teacherId: studentRecord.teacherId,
    teacherName: '',
    senderName: studentRecord.name,
    inviteeUid: parentUid,
    inviteeRole: 'parent',
    studentId: studentRecord.id,
    subjects: studentRecord.subjects,
    status: 'pending',
  });
}

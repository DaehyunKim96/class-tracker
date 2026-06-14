export type InvitationStatus = 'pending' | 'accepted' | 'rejected';
export type InviteeRole = 'student' | 'parent';

export type Invitation = {
  id: string;
  teacherId: string;
  teacherName: string;
  senderName?: string;
  parentUid?: string;
  inviteeUid: string;
  inviteeName?: string;
  inviteeRole: InviteeRole;
  studentId?: string;
  subjects: string[];
  status: InvitationStatus;
  createdAt: string;
};

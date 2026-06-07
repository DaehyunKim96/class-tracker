export type InvitationStatus = 'pending' | 'accepted' | 'rejected';
export type InviteeRole = 'student' | 'parent';

export type Invitation = {
  id: string;
  teacherId: string;
  teacherName: string;
  inviteeUid: string;
  inviteeRole: InviteeRole;
  subjects: string[];
  status: InvitationStatus;
  createdAt: string;
};

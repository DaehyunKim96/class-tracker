export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export type LessonProposal = {
  id: string;
  studentId: string;
  teacherId: string;
  proposedBy: string;
  proposerName: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  content?: string;
  status: ProposalStatus;
  createdAt: string;
};

export type Announcement = {
  id: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  title: string;
  body: string;
  readBy: string[];
  createdAt: string;
};

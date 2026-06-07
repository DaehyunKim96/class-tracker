export type Homework = {
  id: string;
  teacherId: string;
  studentId: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
};

export type LessonStatus = 'scheduled' | 'completed' | 'cancelled';

export type Lesson = {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  status: LessonStatus;
  content?: string;
  createdAt: string;
  updatedAt: string;
};

export type LessonDraft = Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>;

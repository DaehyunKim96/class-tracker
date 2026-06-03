export type Role = 'teacher' | 'student' | 'parent';

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentId?: string;
};

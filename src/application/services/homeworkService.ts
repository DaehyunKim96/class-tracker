import {
  createHomework,
  getHomeworkByTeacher,
  getHomeworkByStudent,
  setHomeworkCompleted,
  deleteHomework,
} from '../../infrastructure/repositories/homeworkRepository';
import {
  getStudentByUid,
  getStudentsByParent,
} from '../../infrastructure/repositories/studentRepository';
import type { Homework, User } from '../domain';

export async function listVisibleHomework(user: User): Promise<Homework[]> {
  let all: Homework[] = [];
  if (user.role === 'teacher') {
    all = await getHomeworkByTeacher(user.id);
  } else if (user.role === 'student') {
    const s = await getStudentByUid(user.id);
    if (s) all = await getHomeworkByStudent(s.id);
  } else {
    const students = await getStudentsByParent(user.id);
    if (students.length > 0) {
      const grouped = await Promise.all(students.map((s) => getHomeworkByStudent(s.id)));
      all = grouped.flat();
    }
  }
  return all.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
}

export async function assignHomework(
  teacherId: string,
  data: {
    studentId: string;
    title: string;
    description?: string;
    dueDate: string;
  },
): Promise<void> {
  await createHomework({
    teacherId,
    studentId: data.studentId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    completed: false,
  });
}

export async function toggleHomeworkComplete(
  id: string,
  completed: boolean,
): Promise<void> {
  await setHomeworkCompleted(id, completed);
}

export async function removeHomework(id: string): Promise<void> {
  await deleteHomework(id);
}

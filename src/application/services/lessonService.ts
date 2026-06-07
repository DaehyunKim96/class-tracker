import {
  listLessonsByStudent,
  listLessonsByTeacher,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../../infrastructure/repositories/lessonRepository';
import {
  getStudentByUid,
  getStudentsByParent,
} from '../../infrastructure/repositories/studentRepository';
import type { Lesson, LessonDraft, User } from '../domain';

function sortLessons(lessons: Lesson[]): Lesson[] {
  return lessons.slice().sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

export async function listVisibleLessons(
  user: User,
  fromDate: string,
  toDate: string,
): Promise<Lesson[]> {
  let all: Lesson[] = [];

  if (user.role === 'teacher') {
    all = await listLessonsByTeacher(user.id);
  } else if (user.role === 'student') {
    const s = await getStudentByUid(user.id);
    if (s) all = await listLessonsByStudent(s.id);
  } else {
    const students = await getStudentsByParent(user.id);
    if (students.length > 0) {
      const grouped = await Promise.all(students.map((s) => listLessonsByStudent(s.id)));
      all = grouped.flat();
    }
  }

  const inRange = all.filter((l) => l.date >= fromDate && l.date <= toDate);
  return sortLessons(inRange);
}

export async function addLessonByTeacher(
  teacherId: string,
  draft: Omit<LessonDraft, 'teacherId' | 'createdBy' | 'status'> & {
    status?: Lesson['status'];
  },
): Promise<string> {
  return createLesson({
    ...draft,
    teacherId,
    createdBy: teacherId,
    status: draft.status ?? 'scheduled',
  });
}

export async function editLesson(
  id: string,
  patch: Partial<LessonDraft>,
): Promise<void> {
  await updateLesson(id, patch);
}

export async function changeLessonStatus(
  id: string,
  status: Lesson['status'],
): Promise<void> {
  await updateLesson(id, { status });
}

export async function removeLesson(id: string): Promise<void> {
  await deleteLesson(id);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function monthRange(date: Date): { fromDate: string; toDate: string } {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const fromDay = first.getDay();
  const toDay = last.getDay();
  const from = new Date(first);
  from.setDate(first.getDate() - fromDay);
  const to = new Date(last);
  to.setDate(last.getDate() + (6 - toDay));
  return { fromDate: toISO(from), toDate: toISO(to) };
}

import {
  createAnnouncement,
  getAnnouncementsByTeacher,
  getAnnouncementsForStudent,
  markAsRead,
  deleteAnnouncement,
} from '../../infrastructure/repositories/announcementRepository';
import {
  getStudentByUid,
  getStudentsByParent,
} from '../../infrastructure/repositories/studentRepository';
import type { Announcement, User } from '../domain';

export async function listVisibleAnnouncements(user: User): Promise<Announcement[]> {
  let collected: Announcement[] = [];

  if (user.role === 'teacher') {
    collected = await getAnnouncementsByTeacher(user.id);
  } else if (user.role === 'student') {
    const s = await getStudentByUid(user.id);
    if (s) collected = await getAnnouncementsForStudent(s.id);
  } else {
    const students = await getStudentsByParent(user.id);
    if (students.length > 0) {
      const grouped = await Promise.all(
        students.map((s) => getAnnouncementsForStudent(s.id)),
      );
      collected = grouped.flat();
    }
  }

  const map = new Map<string, Announcement>();
  collected.forEach((a) => map.set(a.id, a));
  return [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function postAnnouncement(
  teacher: { id: string; name: string },
  data: {
    studentIds: string[];
    title: string;
    body: string;
  },
): Promise<void> {
  await createAnnouncement({
    teacherId: teacher.id,
    teacherName: teacher.name,
    studentIds: data.studentIds,
    title: data.title,
    body: data.body,
    readBy: [],
  });
}

export async function markRead(id: string, uid: string): Promise<void> {
  await markAsRead(id, uid);
}

export async function removeAnnouncement(id: string): Promise<void> {
  await deleteAnnouncement(id);
}

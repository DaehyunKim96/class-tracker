import type { Lesson } from '../domain';

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Lesson;
};

export function toCalendarEvent(lesson: Lesson): CalendarEvent {
  const [startH, startM] = lesson.startTime.split(':').map(Number);
  const [endH, endM] = lesson.endTime.split(':').map(Number);

  const [year, month, day] = lesson.date.split('-').map(Number);
  const start = new Date(year, month - 1, day, startH, startM);
  const end = new Date(year, month - 1, day, endH, endM);

  return {
    id: lesson.id,
    title: lesson.subject,
    start,
    end,
    resource: lesson,
  };
}

export function toCalendarEvents(lessons: Lesson[]): CalendarEvent[] {
  return lessons.map(toCalendarEvent);
}

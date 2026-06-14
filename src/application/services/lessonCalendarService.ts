import type { Lesson, LessonProposal } from '../domain';

export type CalendarEventResource =
  | { kind: 'lesson'; data: Lesson }
  | { kind: 'proposal'; data: LessonProposal };

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: CalendarEventResource;
};

function parseDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [h, m] = time.split(':').map(Number);
  return new Date(year, month - 1, day, h, m);
}

export function toCalendarEvent(lesson: Lesson): CalendarEvent {
  return {
    id: lesson.id,
    title: lesson.subject,
    start: parseDateTime(lesson.date, lesson.startTime),
    end: parseDateTime(lesson.date, lesson.endTime),
    resource: { kind: 'lesson', data: lesson },
  };
}

export function toProposalCalendarEvent(proposal: LessonProposal): CalendarEvent {
  return {
    id: `proposal-${proposal.id}`,
    title: `[제안] ${proposal.subject}`,
    start: parseDateTime(proposal.date, proposal.startTime),
    end: parseDateTime(proposal.date, proposal.endTime),
    resource: { kind: 'proposal', data: proposal },
  };
}

export function toCalendarEvents(lessons: Lesson[]): CalendarEvent[] {
  return lessons.map(toCalendarEvent);
}

export function toProposalCalendarEvents(proposals: LessonProposal[]): CalendarEvent[] {
  return proposals.map(toProposalCalendarEvent);
}

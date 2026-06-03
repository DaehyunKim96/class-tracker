import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { ko },
});

export const calendarMessages = {
  allDay: '종일',
  previous: '◀',
  next: '▶',
  today: '오늘',
  month: '월간',
  week: '주간',
  day: '일간',
  agenda: '일정',
  date: '날짜',
  time: '시간',
  event: '수업',
  noEventsInRange: '이 기간에 수업이 없습니다.',
  showMore: (count: number) => `+${count}개 더보기`,
};

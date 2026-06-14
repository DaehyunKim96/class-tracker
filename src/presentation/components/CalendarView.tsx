import { useState, useCallback } from 'react';
import { Calendar, Views, type View, type SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { localizer, calendarMessages } from '../../infrastructure/calendar/localizer';
import type { CalendarEvent } from '../../application/services/lessonCalendarService';
import type { Lesson } from '../../application/domain';
import './CalendarView.css';

type Props = {
  events: CalendarEvent[];
  onSelectSlot?: (slot: SlotInfo) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  onNavigate?: (date: Date) => void;
  selectable?: boolean;
};

const STATUS_COLOR: Record<Lesson['status'], string> = {
  scheduled: 'var(--color-primary)',
  completed: 'var(--color-completed)',
  cancelled: 'var(--color-cancelled)',
};

const PROPOSAL_COLOR = 'var(--color-accent-amber)';

const MIN_TIME = new Date(1970, 1, 1, 8, 0, 0);
const MAX_TIME = new Date(1970, 1, 1, 23, 59, 59);

export function CalendarView({ events, onSelectSlot, onSelectEvent, onNavigate, selectable = false }: Props) {
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const handleNavigate = useCallback((d: Date) => {
    setDate(d);
    onNavigate?.(d);
  }, [onNavigate]);

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    if (event.resource.kind === 'proposal') {
      return {
        style: {
          backgroundColor: PROPOSAL_COLOR,
          borderColor: PROPOSAL_COLOR,
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 500,
          padding: '2px 6px',
          border: 'none',
        },
      };
    }
    const status = event.resource.data.status;
    const color = STATUS_COLOR[status];
    return {
      style: {
        backgroundColor: color,
        borderColor: color,
        opacity: status === 'cancelled' ? 0.5 : 1,
        textDecoration: status === 'cancelled' ? 'line-through' : 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500,
        padding: '2px 6px',
        border: 'none',
      },
    };
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    onSelectEvent?.(event);
  }, [onSelectEvent]);

  return (
    <div className="cal-view">
      <Calendar
        localizer={localizer}
        culture="ko"
        messages={calendarMessages}
        events={events}
        view={view}
        date={date}
        onView={setView}
        onNavigate={handleNavigate}
        onSelectSlot={onSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable={selectable}
        eventPropGetter={eventPropGetter}
        min={MIN_TIME}
        max={MAX_TIME}
        popup
        style={{ height: 680 }}
        formats={{
          monthHeaderFormat: (date) =>
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
          dayHeaderFormat: (date) =>
            `${date.getMonth() + 1}월 ${date.getDate()}일`,
          dayRangeHeaderFormat: ({ start, end }) =>
            `${start.getMonth() + 1}월 ${start.getDate()}일 – ${end.getMonth() + 1}월 ${end.getDate()}일`,
        }}
      />
    </div>
  );
}

import { useMemo } from 'react';
import type { SlotInfo } from 'react-big-calendar';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';
import { CalendarView } from '../components/CalendarView';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/AuthContext';
import { toCalendarEvents } from '../../application/services/lessonCalendarService';
import type { Lesson } from '../../application/domain';
import './CalendarPage.css';

// 임시 더미 데이터 — 수업 추가 기능 구현 후 Firestore로 교체
const DUMMY_LESSONS: Lesson[] = [
  {
    id: '1', teacherId: 't1', studentId: 's1',
    date: '2026-06-01', startTime: '19:00', endTime: '20:30',
    subject: '수학', status: 'completed',
    createdAt: '', updatedAt: '', createdBy: 't1',
  },
  {
    id: '2', teacherId: 't1', studentId: 's1',
    date: '2026-06-03', startTime: '19:00', endTime: '20:30',
    subject: '수학', status: 'completed',
    createdAt: '', updatedAt: '', createdBy: 't1',
  },
  {
    id: '3', teacherId: 't1', studentId: 's1',
    date: '2026-06-05', startTime: '19:00', endTime: '20:30',
    subject: '영어', status: 'scheduled',
    createdAt: '', updatedAt: '', createdBy: 't1',
  },
  {
    id: '4', teacherId: 't1', studentId: 's1',
    date: '2026-06-08', startTime: '19:00', endTime: '20:30',
    subject: '수학', status: 'scheduled',
    createdAt: '', updatedAt: '', createdBy: 't1',
  },
  {
    id: '5', teacherId: 't1', studentId: 's1',
    date: '2026-06-10', startTime: '19:00', endTime: '20:30',
    subject: '수학', status: 'scheduled',
    createdAt: '', updatedAt: '', createdBy: 't1',
  },
  {
    id: '6', teacherId: 't1', studentId: 's1',
    date: '2026-06-17', startTime: '19:00', endTime: '20:30',
    subject: '수학', status: 'cancelled',
    createdAt: '', updatedAt: '', createdBy: 't1',
  },
];

const RECENT_LESSONS = DUMMY_LESSONS.slice().reverse();

const STATUS_LABEL: Record<Lesson['status'], string> = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
};

export function CalendarPage() {
  const { authState } = useAuth();
  const user = authState.status === 'authenticated' ? authState.user : null;
  const isTeacher = user?.role === 'teacher';

  const events = useMemo(() => toCalendarEvents(DUMMY_LESSONS), []);

  function handleSelectSlot(_slot: SlotInfo) {
    if (!isTeacher) return;
    // TODO: 수업 추가 모달 열기
    alert('수업 추가 모달 (다음 단계에서 구현)');
  }

  function handleSelectEvent(lesson: Lesson) {
    // TODO: 수업 상세 모달 열기
    alert(`수업: ${lesson.subject} (${lesson.date} ${lesson.startTime})`);
  }

  return (
    <>
      <TopNav />

      <main className="page__main">
        <section className="section">
          <div className="section__inner">
            <header className="section__header">
              <div>
                <span className="section__eyebrow">CALENDAR</span>
                <h2 className="section__title t-display-sm">수업 일정</h2>
              </div>
              {isTeacher && (
                <Button variant="primary" onClick={() => alert('수업 추가 모달 (다음 단계)')}>
                  + 수업 추가
                </Button>
              )}
            </header>

            <CalendarView
              events={events}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable={isTeacher}
            />
          </div>
        </section>

        <section className="section section--soft">
          <div className="section__inner">
            <header className="section__header">
              <div>
                <span className="section__eyebrow">LESSON HISTORY</span>
                <h2 className="section__title t-display-sm">최근 수업</h2>
              </div>
              <Button variant="secondary-light">전체 보기</Button>
            </header>

            <ul className="lesson-list">
              {RECENT_LESSONS.filter((l) => l.status !== 'scheduled').map((l) => (
                <li className="lesson-row" key={l.id}>
                  <div className="lesson-row__icon">{l.subject[0]}</div>
                  <div className="lesson-row__primary">
                    <span className="lesson-row__subject">{l.subject}</span>
                    {l.content && (
                      <span className="lesson-row__summary">{l.content}</span>
                    )}
                  </div>
                  <div className="lesson-row__meta">
                    <span className="lesson-row__date">{l.date}</span>
                    <span className="lesson-row__time">
                      {l.startTime} – {l.endTime}
                    </span>
                  </div>
                  <span className={`lesson-row__status lesson-row__status--${l.status}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

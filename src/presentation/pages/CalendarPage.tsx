import { useMemo, useState } from 'react';
import type { SlotInfo } from 'react-big-calendar';
import { TopNav } from '../components/TopNav';
import { Footer } from '../components/Footer';
import { CalendarView } from '../components/CalendarView';
import { Button } from '../components/Button';
import { InvitationBanner } from '../components/InvitationBanner';
import { LessonAddModal } from '../components/LessonAddModal';
import { LessonDetailModal } from '../components/LessonDetailModal';
import { ProposalModal } from '../components/ProposalModal';
import { ProposalBanner } from '../components/ProposalBanner';
import { useAuth } from '../hooks/AuthContext';
import { useLessons } from '../hooks/useLessons';
import { useStudents } from '../hooks/useStudents';
import { toCalendarEvents } from '../../application/services/lessonCalendarService';
import { monthRange } from '../../application/services/lessonService';
import type { Lesson } from '../../application/domain';
import './CalendarPage.css';

const STATUS_LABEL: Record<Lesson['status'], string> = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function dateToISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timeToHHMM(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type ModalState =
  | { kind: 'closed' }
  | { kind: 'add'; date: string; startTime?: string; endTime?: string }
  | { kind: 'edit'; lesson: Lesson }
  | { kind: 'view'; lesson: Lesson }
  | { kind: 'propose'; date?: string };

export function CalendarPage() {
  const { authState } = useAuth();
  const user = authState.status === 'authenticated' ? authState.user : null;
  const isTeacher = user?.role === 'teacher';

  const [viewDate, setViewDate] = useState(new Date());
  const { fromDate, toDate } = useMemo(() => monthRange(viewDate), [viewDate]);

  const { lessons, loading, error, reload } = useLessons(user, fromDate, toDate);
  const { students } = useStudents(isTeacher ? user!.id : null);

  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });

  const events = useMemo(() => toCalendarEvents(lessons), [lessons]);

  const studentNameById = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [students]);

  const recentLessons = useMemo(
    () =>
      lessons
        .filter((l) => l.status !== 'scheduled')
        .slice()
        .reverse()
        .slice(0, 10),
    [lessons],
  );

  function handleSelectSlot(slot: SlotInfo) {
    const start = slot.start as Date;
    const end = slot.end as Date;
    const isSingleDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();
    if (isTeacher) {
      setModal({
        kind: 'add',
        date: dateToISO(start),
        startTime: isSingleDay ? timeToHHMM(start) : undefined,
        endTime: isSingleDay ? timeToHHMM(end) : undefined,
      });
    } else if (user && (user.role === 'student' || user.role === 'parent')) {
      setModal({ kind: 'propose', date: dateToISO(start) });
    }
  }

  function handleSelectEvent(lesson: Lesson) {
    setModal(isTeacher ? { kind: 'edit', lesson } : { kind: 'view', lesson });
  }

  function handleSaved() {
    setModal({ kind: 'closed' });
    reload();
  }

  return (
    <>
      <TopNav />

      <main className="page__main">
        <div className="page__banner-zone">
          <InvitationBanner />
          <ProposalBanner onChanged={reload} />
        </div>

        <section className="section">
          <div className="section__inner">
            <header className="section__header">
              <div>
                <span className="section__eyebrow">CALENDAR</span>
                <h2 className="section__title t-display-sm">수업 일정</h2>
              </div>
              {isTeacher ? (
                <Button
                  variant="primary"
                  onClick={() =>
                    setModal({ kind: 'add', date: dateToISO(new Date()) })
                  }
                >
                  + 수업 추가
                </Button>
              ) : (
                user && (
                  <Button
                    variant="primary"
                    onClick={() => setModal({ kind: 'propose' })}
                  >
                    + 수업 제안
                  </Button>
                )
              )}
            </header>

            {error && <p className="section__error">{error}</p>}
            {loading && <p className="section__loading">불러오는 중...</p>}

            <CalendarView
              events={events}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              onNavigate={setViewDate}
              selectable={!!user}
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
            </header>

            {recentLessons.length === 0 ? (
              <p className="section__empty">완료된 수업이 아직 없습니다.</p>
            ) : (
              <ul className="lesson-list">
                {recentLessons.map((l) => (
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
            )}
          </div>
        </section>
      </main>

      <Footer />

      {modal.kind === 'add' && isTeacher && user && (
        <LessonAddModal
          teacherId={user.id}
          students={students}
          defaultDate={modal.date}
          defaultStartTime={modal.startTime}
          defaultEndTime={modal.endTime}
          onClose={() => setModal({ kind: 'closed' })}
          onSaved={handleSaved}
        />
      )}

      {modal.kind === 'edit' && isTeacher && user && (
        <LessonAddModal
          teacherId={user.id}
          students={students}
          lesson={modal.lesson}
          onClose={() => setModal({ kind: 'closed' })}
          onSaved={handleSaved}
        />
      )}

      {modal.kind === 'view' && (
        <LessonDetailModal
          lesson={modal.lesson}
          studentName={studentNameById.get(modal.lesson.studentId)}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}

      {modal.kind === 'propose' && user && (
        <ProposalModal
          user={user}
          defaultDate={modal.date}
          onClose={() => setModal({ kind: 'closed' })}
          onSubmitted={() => setModal({ kind: 'closed' })}
        />
      )}
    </>
  );
}

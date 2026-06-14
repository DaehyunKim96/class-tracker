import { useState, useEffect, useMemo } from 'react';
import { TopNav } from '../components/TopNav';
import { useAuth } from '../hooks/AuthContext';
import { useStudents } from '../hooks/useStudents';
import { listLessonsByTeacher, listLessonsByStudent } from '../../infrastructure/repositories/lessonRepository';
import { getStudentByUid, getStudentsByParent } from '../../infrastructure/repositories/studentRepository';
import type { Lesson, User } from '../../application/domain';
import './StatisticsPage.css';

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0분';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function currentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split('-');
  return `${y}년 ${Number(m)}월`;
}

async function loadLessonsForUser(user: User): Promise<Lesson[]> {
  if (user.role === 'teacher') {
    return listLessonsByTeacher(user.id);
  }
  if (user.role === 'student') {
    const s = await getStudentByUid(user.id);
    return s ? listLessonsByStudent(s.id) : [];
  }
  // parent
  const children = await getStudentsByParent(user.id);
  if (children.length === 0) return [];
  const grouped = await Promise.all(children.map((s) => listLessonsByStudent(s.id)));
  return grouped.flat();
}

export function StatisticsPage() {
  const { authState } = useAuth();
  const user = authState.status === 'authenticated' ? authState.user : null;
  const isTeacher = user?.role === 'teacher';

  const [month, setMonth] = useState(currentYearMonth);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const { students } = useStudents(isTeacher ? user!.id : null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    loadLessonsForUser(user)
      .then(setLessons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const monthLessons = useMemo(
    () => lessons.filter((l) => l.date.startsWith(month) && l.status !== 'cancelled'),
    [lessons, month],
  );

  const studentStats = useMemo(() => {
    const map = new Map<string, { count: number; minutes: number }>();
    monthLessons.forEach((l) => {
      const prev = map.get(l.studentId) ?? { count: 0, minutes: 0 };
      map.set(l.studentId, {
        count: prev.count + 1,
        minutes: prev.minutes + minutesBetween(l.startTime, l.endTime),
      });
    });
    return map;
  }, [monthLessons]);

  const totals = useMemo(() => {
    let count = 0;
    let minutes = 0;
    studentStats.forEach((s) => {
      count += s.count;
      minutes += s.minutes;
    });
    return { count, minutes };
  }, [studentStats]);

  const rows = useMemo(
    () =>
      students
        .map((s) => ({ student: s, ...(studentStats.get(s.id) ?? { count: 0, minutes: 0 }) }))
        .filter((r) => r.count > 0)
        .sort((a, b) => b.count - a.count),
    [students, studentStats],
  );

  if (!user) return null;

  return (
    <div className="stats-page">
      <TopNav />
      <main className="stats-page__main">
        <div className="stats-page__container">
          <header className="stats-page__header">
            <div>
              <span className="stats-page__eyebrow">STATISTICS</span>
              <h1 className="stats-page__title">통계</h1>
            </div>
            <div className="stats-month-wrap">
              <input
                type="month"
                className="stats-month-picker"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          </header>

          {loading ? (
            <p className="stats-loading">불러오는 중...</p>
          ) : (
            <>
              <div className="stats-summary">
                <div className="stats-summary__item">
                  <span className="stats-summary__value">{totals.count}</span>
                  <span className="stats-summary__label">총 수업 횟수</span>
                </div>
                <div className="stats-summary__divider" />
                <div className="stats-summary__item">
                  <span className="stats-summary__value">{formatDuration(totals.minutes)}</span>
                  <span className="stats-summary__label">총 수업 시간</span>
                </div>
                {isTeacher && (
                  <>
                    <div className="stats-summary__divider" />
                    <div className="stats-summary__item">
                      <span className="stats-summary__value">{rows.length}</span>
                      <span className="stats-summary__label">수업한 학생</span>
                    </div>
                  </>
                )}
              </div>

              {isTeacher && (
                rows.length === 0 ? (
                  <div className="stats-empty">
                    <p>{formatMonthLabel(month)}에 수업 기록이 없습니다.</p>
                  </div>
                ) : (
                  <div className="stats-table">
                    <div className="stats-table__head">
                      <span>학생</span>
                      <span>수업 횟수</span>
                      <span>총 수업 시간</span>
                    </div>
                    {rows.map(({ student, count, minutes }) => (
                      <div key={student.id} className="stats-table__row">
                        <span className="stats-table__name">{student.name}</span>
                        <span className="stats-table__count">
                          <strong>{count}</strong>회
                        </span>
                        <span className="stats-table__time">{formatDuration(minutes)}</span>
                      </div>
                    ))}
                  </div>
                )
              )}

              {!isTeacher && totals.count === 0 && (
                <div className="stats-empty">
                  <p>{formatMonthLabel(month)}에 수업 기록이 없습니다.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

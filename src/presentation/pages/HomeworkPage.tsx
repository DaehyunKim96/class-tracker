import { useEffect, useState, useMemo, useCallback } from 'react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/Button';
import { HomeworkAddModal } from '../components/HomeworkAddModal';
import { useAuth } from '../hooks/AuthContext';
import { useStudents } from '../hooks/useStudents';
import {
  listVisibleHomework,
  toggleHomeworkComplete,
  removeHomework,
} from '../../application/services/homeworkService';
import type { Homework } from '../../application/domain';
import './HomeworkPage.css';

function formatDueDate(d: string): { label: string; tone: 'overdue' | 'today' | 'future' } {
  const today = new Date().toISOString().slice(0, 10);
  if (d < today) return { label: d, tone: 'overdue' };
  if (d === today) return { label: '오늘', tone: 'today' };
  return { label: d, tone: 'future' };
}

export function HomeworkPage() {
  const { authState } = useAuth();
  const user = authState.status === 'authenticated' ? authState.user : null;
  const isTeacher = user?.role === 'teacher';

  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { students } = useStudents(isTeacher ? user!.id : null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await listVisibleHomework(user);
      setHomework(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const studentNameById = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [students]);

  const { active, done } = useMemo(() => {
    const a: Homework[] = [];
    const d: Homework[] = [];
    homework.forEach((h) => (h.completed ? d.push(h) : a.push(h)));
    a.sort((x, y) => x.dueDate.localeCompare(y.dueDate));
    return { active: a, done: d };
  }, [homework]);

  async function handleToggle(h: Homework) {
    await toggleHomeworkComplete(h.id, !h.completed);
    load();
  }

  async function handleDelete(h: Homework) {
    if (!confirm('이 숙제를 삭제할까요?')) return;
    await removeHomework(h.id);
    load();
  }

  if (!user) return null;

  return (
    <div className="homework-page">
      <TopNav />
      <main className="homework-page__main">
        <div className="homework-page__container">
          <header className="homework-page__header">
            <div>
              <span className="section__eyebrow">HOMEWORK</span>
              <h1 className="homework-page__title">숙제</h1>
            </div>
            {isTeacher && (
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                + 숙제 추가
              </Button>
            )}
          </header>

          {loading ? (
            <p className="section__loading">불러오는 중...</p>
          ) : homework.length === 0 ? (
            <p className="hw-empty">
              {isTeacher ? '아직 등록한 숙제가 없습니다.' : '아직 받은 숙제가 없습니다.'}
            </p>
          ) : (
            <>
              <section className="hw-section">
                <h2 className="hw-section__title">진행 중 ({active.length})</h2>
                {active.length === 0 ? (
                  <p className="hw-section__empty">진행 중인 숙제가 없습니다.</p>
                ) : (
                  <ul className="hw-list">
                    {active.map((h) => {
                      const due = formatDueDate(h.dueDate);
                      return (
                        <li key={h.id} className="hw-item">
                          <button
                            type="button"
                            className="hw-item__check"
                            onClick={() => handleToggle(h)}
                            aria-label="완료 표시"
                          />
                          <div className="hw-item__body">
                            <div className="hw-item__title">{h.title}</div>
                            {h.description && (
                              <div className="hw-item__desc">{h.description}</div>
                            )}
                            <div className="hw-item__meta">
                              {isTeacher && studentNameById.get(h.studentId) && (
                                <span className="hw-item__student">
                                  {studentNameById.get(h.studentId)}
                                </span>
                              )}
                              <span className={`hw-item__due hw-item__due--${due.tone}`}>
                                마감 · {due.label}
                              </span>
                            </div>
                          </div>
                          {isTeacher && (
                            <button
                              type="button"
                              className="hw-item__delete"
                              onClick={() => handleDelete(h)}
                              aria-label="삭제"
                            >
                              ×
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {done.length > 0 && (
                <section className="hw-section">
                  <h2 className="hw-section__title">완료 ({done.length})</h2>
                  <ul className="hw-list">
                    {done.map((h) => (
                      <li key={h.id} className="hw-item hw-item--done">
                        <button
                          type="button"
                          className="hw-item__check hw-item__check--done"
                          onClick={() => handleToggle(h)}
                          aria-label="완료 해제"
                        >
                          ✓
                        </button>
                        <div className="hw-item__body">
                          <div className="hw-item__title">{h.title}</div>
                          <div className="hw-item__meta">
                            {isTeacher && studentNameById.get(h.studentId) && (
                              <span className="hw-item__student">
                                {studentNameById.get(h.studentId)}
                              </span>
                            )}
                            <span className="hw-item__due">마감 · {h.dueDate}</span>
                          </div>
                        </div>
                        {isTeacher && (
                          <button
                            type="button"
                            className="hw-item__delete"
                            onClick={() => handleDelete(h)}
                            aria-label="삭제"
                          >
                            ×
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {modalOpen && isTeacher && (
        <HomeworkAddModal
          teacherId={user.id}
          students={students}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}

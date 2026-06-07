import { useEffect, useState, useCallback } from 'react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/Button';
import { AnnouncementAddModal } from '../components/AnnouncementAddModal';
import { useAuth } from '../hooks/AuthContext';
import { useStudents } from '../hooks/useStudents';
import {
  listVisibleAnnouncements,
  markRead,
  removeAnnouncement,
} from '../../application/services/announcementService';
import type { Announcement } from '../../application/domain';
import './AnnouncementsPage.css';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return iso;
  }
}

export function AnnouncementsPage() {
  const { authState } = useAuth();
  const user = authState.status === 'authenticated' ? authState.user : null;
  const isTeacher = user?.role === 'teacher';

  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const { students } = useStudents(isTeacher ? user!.id : null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await listVisibleAnnouncements(user);
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleOpen(a: Announcement) {
    const next = new Set(openIds);
    const wasOpen = next.has(a.id);
    if (wasOpen) next.delete(a.id);
    else next.add(a.id);
    setOpenIds(next);

    if (!wasOpen && user && !isTeacher && !a.readBy.includes(user.id)) {
      await markRead(a.id, user.id);
      setItems((prev) =>
        prev.map((x) =>
          x.id === a.id ? { ...x, readBy: [...x.readBy, user.id] } : x,
        ),
      );
    }
  }

  async function handleDelete(a: Announcement) {
    if (!confirm('이 공지를 삭제할까요?')) return;
    await removeAnnouncement(a.id);
    load();
  }

  if (!user) return null;

  return (
    <div className="announcements-page">
      <TopNav />
      <main className="announcements-page__main">
        <div className="announcements-page__container">
          <header className="announcements-page__header">
            <div>
              <span className="section__eyebrow">ANNOUNCEMENTS</span>
              <h1 className="announcements-page__title">공지</h1>
            </div>
            {isTeacher && (
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                + 공지 작성
              </Button>
            )}
          </header>

          {loading ? (
            <p className="section__loading">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="ann-empty">
              {isTeacher ? '아직 작성한 공지가 없습니다.' : '받은 공지가 없습니다.'}
            </p>
          ) : (
            <ul className="ann-list">
              {items.map((a) => {
                const isOpen = openIds.has(a.id);
                const unread = !isTeacher && !a.readBy.includes(user.id);
                return (
                  <li
                    key={a.id}
                    className={`ann-item ${unread ? 'ann-item--unread' : ''}`}
                  >
                    <button
                      type="button"
                      className="ann-item__row"
                      onClick={() => handleToggleOpen(a)}
                    >
                      <div className="ann-item__main">
                        <div className="ann-item__title">
                          {unread && <span className="ann-item__dot" />}
                          {a.title}
                        </div>
                        <div className="ann-item__meta">
                          <span>{a.teacherName} 선생님</span>
                          <span>·</span>
                          <span>{formatDate(a.createdAt)}</span>
                          {isTeacher && (
                            <>
                              <span>·</span>
                              <span>
                                {a.readBy.length}/{a.studentIds.length} 읽음
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`ann-item__chevron ${isOpen ? 'ann-item__chevron--open' : ''}`}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    </button>
                    {isOpen && (
                      <div className="ann-item__body">
                        <p className="ann-item__text">{a.body}</p>
                        {isTeacher && (
                          <div className="ann-item__actions">
                            <button
                              type="button"
                              className="ann-item__delete"
                              onClick={() => handleDelete(a)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {modalOpen && isTeacher && (
        <AnnouncementAddModal
          teacherId={user.id}
          teacherName={user.name}
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

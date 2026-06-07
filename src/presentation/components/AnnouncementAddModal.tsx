import { useState } from 'react';
import { Button } from './Button';
import { postAnnouncement } from '../../application/services/announcementService';
import type { Student } from '../../application/domain';

type Props = {
  teacherId: string;
  teacherName: string;
  students: Student[];
  onClose: () => void;
  onSaved: () => void;
};

export function AnnouncementAddModal({
  teacherId,
  teacherName,
  students,
  onClose,
  onSaved,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(students.map((s) => s.id)),
  );
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === students.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(students.map((s) => s.id)));
  }

  async function handleSave() {
    if (selectedIds.size === 0) return setError('받는 사람을 선택해 주세요.');
    if (!title.trim()) return setError('제목을 입력해 주세요.');
    if (!body.trim()) return setError('내용을 입력해 주세요.');

    setLoading(true);
    setError('');
    try {
      await postAnnouncement(
        { id: teacherId, name: teacherName },
        {
          studentIds: [...selectedIds],
          title: title.trim(),
          body: body.trim(),
        },
      );
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lesson-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">공지 작성</h2>

        {students.length === 0 ? (
          <p className="modal-card__error">
            등록된 학생이 없습니다. 먼저 학생 페이지에서 학생을 초대해 주세요.
          </p>
        ) : (
          <>
            <div className="field-group">
              <div className="recipient-header">
                <span className="field-label">받는 사람</span>
                <button
                  type="button"
                  className="recipient-toggle-all"
                  onClick={toggleAll}
                >
                  {selectedIds.size === students.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>
              <div className="recipient-chips">
                {students.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`subject-chip ${selectedIds.has(s.id) ? 'subject-chip--active' : ''}`}
                    onClick={() => toggle(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">제목</label>
              <input
                className="field-input"
                type="text"
                placeholder="예: 다음 주 수업 일정 변경 안내"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">내용</label>
              <textarea
                className="field-input field-textarea"
                placeholder="공지 내용을 입력해 주세요"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
              />
            </div>
          </>
        )}

        {error && <p className="modal-card__error">{error}</p>}

        <div className="modal-card__actions">
          <Button variant="secondary-light" onClick={onClose}>
            취소
          </Button>
          {students.length > 0 && (
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? '저장 중...' : '공지 보내기'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

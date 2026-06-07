import { useState } from 'react';
import { Button } from './Button';
import { assignHomework } from '../../application/services/homeworkService';
import type { Student } from '../../application/domain';

type Props = {
  teacherId: string;
  students: Student[];
  defaultDueDate?: string;
  onClose: () => void;
  onSaved: () => void;
};

export function HomeworkAddModal({
  teacherId,
  students,
  defaultDueDate,
  onClose,
  onSaved,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [studentId, setStudentId] = useState(students[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(defaultDueDate ?? today);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!studentId) return setError('학생을 먼저 등록해 주세요.');
    if (!title.trim()) return setError('제목을 입력해 주세요.');
    if (!dueDate) return setError('마감일을 입력해 주세요.');

    setLoading(true);
    setError('');
    try {
      await assignHomework(teacherId, {
        studentId,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
      });
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
        <h2 className="modal-card__title">숙제 추가</h2>

        {students.length === 0 ? (
          <p className="modal-card__error">
            등록된 학생이 없습니다. 먼저 학생 페이지에서 학생을 초대해 주세요.
          </p>
        ) : (
          <>
            <div className="field-group">
              <label className="field-label">학생</label>
              <select
                className="field-input"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">제목</label>
              <input
                className="field-input"
                type="text"
                placeholder="예: 수학 문제집 p.45-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">마감일</label>
              <input
                className="field-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label">설명 (선택)</label>
              <textarea
                className="field-input field-textarea"
                placeholder="세부 안내사항"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
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
              {loading ? '저장 중...' : '저장'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from './Button';
import {
  addLessonByTeacher,
  editLesson,
  removeLesson,
} from '../../application/services/lessonService';
import type { Student, LessonStatus, Lesson } from '../../application/domain';
import './LessonAddModal.css';

type Props = {
  teacherId: string;
  students: Student[];
  /** When present, modal is in edit mode. */
  lesson?: Lesson;
  defaultDate?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  onClose: () => void;
  onSaved: () => void;
};

const STATUS_OPTIONS: { value: LessonStatus; label: string }[] = [
  { value: 'scheduled', label: '예정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
];

export function LessonAddModal({
  teacherId,
  students,
  lesson,
  defaultDate,
  defaultStartTime = '19:00',
  defaultEndTime = '20:30',
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!lesson;
  const today = new Date().toISOString().slice(0, 10);

  const [studentId, setStudentId] = useState<string>(
    lesson?.studentId ?? students[0]?.id ?? '',
  );
  const [date, setDate] = useState(lesson?.date ?? defaultDate ?? today);
  const [startTime, setStartTime] = useState(lesson?.startTime ?? defaultStartTime);
  const [endTime, setEndTime] = useState(lesson?.endTime ?? defaultEndTime);
  const [subject, setSubject] = useState(
    lesson?.subject ?? students[0]?.subjects?.[0] ?? '',
  );
  const [content, setContent] = useState(lesson?.content ?? '');
  const [status, setStatus] = useState<LessonStatus>(lesson?.status ?? 'scheduled');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedStudent = students.find((s) => s.id === studentId);

  function validate(): string | null {
    if (!studentId) return '학생을 먼저 등록해 주세요.';
    if (!date) return '날짜를 입력해 주세요.';
    if (!startTime || !endTime) return '시간을 입력해 주세요.';
    if (startTime >= endTime) return '종료 시간이 시작 시간보다 늦어야 합니다.';
    if (!subject.trim()) return '과목을 입력해 주세요.';
    return null;
  }

  async function handleSave() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isEdit && lesson) {
        await editLesson(lesson.id, {
          studentId,
          date,
          startTime,
          endTime,
          subject: subject.trim(),
          content: content.trim() || undefined,
          status,
        });
      } else {
        await addLessonByTeacher(teacherId, {
          studentId,
          date,
          startTime,
          endTime,
          subject: subject.trim(),
          content: content.trim() || undefined,
          status,
        });
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!lesson) return;
    setLoading(true);
    setError('');
    try {
      await removeLesson(lesson.id);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lesson-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">{isEdit ? '수업 수정' : '수업 추가'}</h2>

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
                onChange={(e) => {
                  const id = e.target.value;
                  setStudentId(id);
                  const s = students.find((x) => x.id === id);
                  if (s && s.subjects.length > 0 && !s.subjects.includes(subject)) {
                    setSubject(s.subjects[0]);
                  }
                }}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">날짜</label>
              <input
                className="field-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="field-row">
              <div className="field-group field-group--half">
                <label className="field-label">시작 시간</label>
                <input
                  className="field-input"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="field-group field-group--half">
                <label className="field-label">종료 시간</label>
                <input
                  className="field-input"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">과목</label>
              {selectedStudent && selectedStudent.subjects.length > 0 ? (
                <div className="subject-chips">
                  {selectedStudent.subjects.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`subject-chip ${subject === s ? 'subject-chip--active' : ''}`}
                      onClick={() => setSubject(s)}
                    >
                      {s}
                    </button>
                  ))}
                  <input
                    className="field-input subject-chips__custom"
                    type="text"
                    placeholder="기타"
                    value={
                      selectedStudent.subjects.includes(subject) ? '' : subject
                    }
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              ) : (
                <input
                  className="field-input"
                  type="text"
                  placeholder="예: 수학"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              )}
            </div>

            <div className="field-group">
              <label className="field-label">상태</label>
              <div className="role-toggle">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`role-toggle__btn ${status === opt.value ? 'role-toggle__btn--active' : ''}`}
                    onClick={() => setStatus(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">메모 (선택)</label>
              <textarea
                className="field-input field-textarea"
                placeholder="수업 내용이나 메모"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        {error && <p className="modal-card__error">{error}</p>}

        <div className={`modal-card__actions ${isEdit ? 'modal-card__actions--split' : ''}`}>
          {isEdit && (
            <div className="modal-card__actions-left">
              {confirmDelete ? (
                <>
                  <span className="modal-card__delete-confirm">정말 삭제할까요?</span>
                  <Button
                    variant="secondary-light"
                    onClick={() => setConfirmDelete(false)}
                  >
                    아니오
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    예
                  </Button>
                </>
              ) : (
                <button
                  type="button"
                  className="modal-card__delete-link"
                  onClick={() => setConfirmDelete(true)}
                  disabled={loading}
                >
                  삭제
                </button>
              )}
            </div>
          )}

          <div className="modal-card__actions-right">
            <Button variant="secondary-light" onClick={onClose}>
              취소
            </Button>
            {students.length > 0 && (
              <Button variant="primary" onClick={handleSave} disabled={loading}>
                {loading ? '저장 중...' : isEdit ? '수정' : '저장'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { getMyStudents, submitProposal } from '../../application/services/proposalService';
import type { Student, User } from '../../application/domain';
import './ProposalModal.css';

type Props = {
  user: User;
  defaultDate?: string;
  onClose: () => void;
  onSubmitted: () => void;
};

export function ProposalModal({ user, defaultDate, onClose, onSubmitted }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(defaultDate ?? today);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:30');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMyStudents(user)
      .then((list) => {
        setStudents(list);
        if (list.length > 0) {
          setStudentId(list[0].id);
          if (list[0].subjects.length > 0) setSubject(list[0].subjects[0]);
        }
      })
      .finally(() => setLoadingStudents(false));
  }, [user]);

  const selectedStudent = students.find((s) => s.id === studentId);

  function validate(): string | null {
    if (!selectedStudent) return '연결된 학생이 없습니다.';
    if (!date) return '날짜를 입력해 주세요.';
    if (!startTime || !endTime) return '시간을 입력해 주세요.';
    if (startTime >= endTime) return '종료 시간이 시작 시간보다 늦어야 합니다.';
    if (!subject.trim()) return '과목을 입력해 주세요.';
    return null;
  }

  async function handleSubmit() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    if (!selectedStudent) return;
    setSubmitting(true);
    setError('');
    try {
      await submitProposal(user, {
        studentId: selectedStudent.id,
        teacherId: selectedStudent.teacherId,
        date,
        startTime,
        endTime,
        subject: subject.trim(),
        content: content.trim() || undefined,
      });
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : '제안 전송 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lesson-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">수업 시간 제안</h2>

        {loadingStudents ? (
          <p className="modal-card__error">불러오는 중...</p>
        ) : students.length === 0 ? (
          <p className="modal-card__error">
            연결된 학생이 없습니다. 선생님에게 초대를 요청해 주세요.
          </p>
        ) : (
          <>
            {students.length > 1 && (
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
            )}

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
              <label className="field-label">메모 (선택)</label>
              <textarea
                className="field-input field-textarea"
                placeholder="예: 시험 직전이라 진도 점검 부탁드려요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? '전송 중...' : '제안 보내기'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

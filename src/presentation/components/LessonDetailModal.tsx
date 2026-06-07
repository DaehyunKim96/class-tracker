import { Button } from './Button';
import type { Lesson } from '../../application/domain';
import './LessonDetailModal.css';

type Props = {
  lesson: Lesson;
  studentName?: string;
  onClose: () => void;
};

const STATUS_LABEL: Record<Lesson['status'], string> = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
};

export function LessonDetailModal({ lesson, studentName, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lesson-detail-modal" onClick={(e) => e.stopPropagation()}>
        <header className="lesson-detail__header">
          <h2 className="modal-card__title">{lesson.subject}</h2>
          <span className={`lesson-detail__status lesson-detail__status--${lesson.status}`}>
            {STATUS_LABEL[lesson.status]}
          </span>
        </header>

        <dl className="lesson-detail__list">
          {studentName && (
            <div className="lesson-detail__row">
              <dt className="lesson-detail__label">학생</dt>
              <dd className="lesson-detail__value">{studentName}</dd>
            </div>
          )}
          <div className="lesson-detail__row">
            <dt className="lesson-detail__label">날짜</dt>
            <dd className="lesson-detail__value">{lesson.date}</dd>
          </div>
          <div className="lesson-detail__row">
            <dt className="lesson-detail__label">시간</dt>
            <dd className="lesson-detail__value">
              {lesson.startTime} – {lesson.endTime}
            </dd>
          </div>
          {lesson.content && (
            <div className="lesson-detail__row lesson-detail__row--block">
              <dt className="lesson-detail__label">메모</dt>
              <dd className="lesson-detail__value lesson-detail__value--memo">
                {lesson.content}
              </dd>
            </div>
          )}
        </dl>

        <div className="modal-card__actions">
          <Button variant="primary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from './Button';
import { acceptProposal, rejectProposal } from '../../application/services/proposalService';
import type { LessonProposal, User } from '../../application/domain';
import './ProposalModal.css';

type Props = {
  proposal: LessonProposal;
  user: User;
  onClose: () => void;
  onChanged: () => void;
};

export function ProposalDetailModal({ proposal, user, onClose, onChanged }: Props) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const isTeacher = user.role === 'teacher';

  async function handleAccept() {
    setProcessing(true);
    setError('');
    try {
      await acceptProposal(proposal);
      onChanged();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '처리 중 오류가 발생했습니다.');
      setProcessing(false);
    }
  }

  async function handleReject() {
    setProcessing(true);
    setError('');
    try {
      await rejectProposal(proposal.id);
      onChanged();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '처리 중 오류가 발생했습니다.');
      setProcessing(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lesson-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">수업 제안</h2>

        <div className="field-group">
          <label className="field-label">제안자</label>
          <p className="field-value">{proposal.proposerName}</p>
        </div>

        <div className="field-group">
          <label className="field-label">날짜</label>
          <p className="field-value">{proposal.date}</p>
        </div>

        <div className="field-row">
          <div className="field-group field-group--half">
            <label className="field-label">시작 시간</label>
            <p className="field-value">{proposal.startTime}</p>
          </div>
          <div className="field-group field-group--half">
            <label className="field-label">종료 시간</label>
            <p className="field-value">{proposal.endTime}</p>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">과목</label>
          <p className="field-value">{proposal.subject}</p>
        </div>

        {proposal.content && (
          <div className="field-group">
            <label className="field-label">메모</label>
            <p className="field-value">{proposal.content}</p>
          </div>
        )}

        {error && <p className="modal-card__error">{error}</p>}

        <div className="modal-card__actions">
          {isTeacher ? (
            <>
              <Button variant="secondary-light" onClick={handleReject} disabled={processing}>
                거절
              </Button>
              <Button variant="primary" onClick={handleAccept} disabled={processing}>
                {processing ? '처리 중...' : '수락'}
              </Button>
            </>
          ) : (
            <Button variant="secondary-light" onClick={onClose}>
              닫기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { useAuth } from '../hooks/AuthContext';
import { getProposalsByTeacher } from '../../infrastructure/repositories/proposalRepository';
import { acceptProposal, rejectProposal } from '../../application/services/proposalService';
import type { LessonProposal } from '../../application/domain';
import './ProposalBanner.css';

type Props = {
  onChanged?: () => void;
};

export function ProposalBanner({ onChanged }: Props) {
  const { authState } = useAuth();
  const [proposals, setProposals] = useState<LessonProposal[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  const isTeacher =
    authState.status === 'authenticated' && authState.user.role === 'teacher';
  const teacherId = isTeacher ? authState.user.id : null;

  const load = useCallback(async () => {
    if (!teacherId) return;
    const all = await getProposalsByTeacher(teacherId);
    const pending = all
      .filter((p) => p.status === 'pending')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setProposals(pending);
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) load();
  }, [teacherId, load]);

  if (!isTeacher || proposals.length === 0) return null;

  async function handleAccept(p: LessonProposal) {
    setProcessing(p.id);
    try {
      await acceptProposal(p);
      setProposals((prev) => prev.filter((x) => x.id !== p.id));
      onChanged?.();
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(p: LessonProposal) {
    setProcessing(p.id);
    try {
      await rejectProposal(p.id);
      setProposals((prev) => prev.filter((x) => x.id !== p.id));
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="proposal-banner">
      <div className="proposal-banner__header">
        <span className="proposal-banner__badge">{proposals.length}</span>
        <span className="proposal-banner__title">받은 수업 제안</span>
      </div>
      <ul className="proposal-banner__list">
        {proposals.map((p) => (
          <li key={p.id} className="proposal-banner__item">
            <div className="proposal-banner__info">
              <div className="proposal-banner__primary">
                <span className="proposal-banner__proposer">{p.proposerName}</span>
                <span className="proposal-banner__subject">· {p.subject}</span>
              </div>
              <div className="proposal-banner__time">
                {p.date} · {p.startTime} – {p.endTime}
              </div>
              {p.content && <div className="proposal-banner__memo">"{p.content}"</div>}
            </div>
            <div className="proposal-banner__actions">
              <Button
                variant="secondary-light"
                onClick={() => handleReject(p)}
                disabled={processing === p.id}
              >
                거절
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAccept(p)}
                disabled={processing === p.id}
              >
                수락
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

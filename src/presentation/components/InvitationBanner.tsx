import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { Button } from './Button';
import { getInvitationsByInvitee } from '../../infrastructure/repositories/invitationRepository';
import { acceptInvitation, rejectInvitation } from '../../application/services/invitationService';
import type { Invitation } from '../../application/domain';
import './InvitationBanner.css';

export function InvitationBanner() {
  const { authState } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  if (authState.status !== 'authenticated') return null;
  const user = authState.user;

  if (user.role === 'teacher') return null;

  async function load() {
    const all = await getInvitationsByInvitee(user.id);
    const pending = all
      .filter((i) => i.status === 'pending')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setInvitations(pending);
  }

  useEffect(() => {
    load();
  }, [user.id]);

  async function handleAccept(inv: Invitation) {
    setProcessing(inv.id);
    try {
      await acceptInvitation(inv, user);
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(inv: Invitation) {
    setProcessing(inv.id);
    try {
      await rejectInvitation(inv.id);
      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    } finally {
      setProcessing(null);
    }
  }

  if (invitations.length === 0) return null;

  return (
    <div className="invitation-banner">
      <div className="invitation-banner__header">
        <span className="invitation-banner__badge">{invitations.length}</span>
        <span className="invitation-banner__title">받은 초대</span>
      </div>
      <ul className="invitation-banner__list">
        {invitations.map((inv) => (
          <li key={inv.id} className="invitation-banner__item">
            <div className="invitation-banner__info">
              <span className="invitation-banner__teacher">{inv.teacherName} 선생님</span>
              <span className="invitation-banner__subjects">
                {inv.inviteeRole === 'student' ? '학생' : '학부모'} · {inv.subjects.join(', ')}
              </span>
            </div>
            <div className="invitation-banner__actions">
              <Button
                variant="secondary-light"
                onClick={() => handleReject(inv)}
                disabled={processing === inv.id}
              >
                거절
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAccept(inv)}
                disabled={processing === inv.id}
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

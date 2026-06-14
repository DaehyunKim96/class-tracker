import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { searchUsersByName } from '../../infrastructure/repositories/userRepository';
import { connectStudentByParent } from '../../application/services/invitationService';
import { maskEmail } from '../../shared/maskEmail';
import type { User } from '../../application/domain';
import './ProposalModal.css';

type Props = {
  currentUser: User;
  onClose: () => void;
  onSent: () => void;
};

export function StudentConnectModal({ currentUser, onClose, onSent }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const found = await searchUsersByName(query.trim());
        setResults(found.filter((u) => u.id !== currentUser.id && u.role === 'student'));
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, currentUser.id]);

  async function handleSend(student: User) {
    setSending(student.id);
    setError('');
    try {
      await connectStudentByParent(currentUser, student.id);
      setSuccessMsg(`${student.name}님께 연결 요청을 보냈습니다.`);
      setResults([]);
      setQuery('');
      setTimeout(() => { onSent(); }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setSending(null);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card lesson-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">학생 연결하기</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', margin: 0 }}>
          자녀의 학생 계정 이름을 검색하세요. 학생이 수락하면 연결됩니다.
        </p>

        <div className="field-group">
          <label className="field-label">이름 검색</label>
          <input
            className="field-input"
            type="text"
            placeholder="학생 이름 입력..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {searching && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>검색 중...</p>
        )}

        {results.length > 0 && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((u) => (
              <li
                key={u.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1.5px solid var(--color-hairline)', borderRadius: '8px' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '0.9375rem' }}>{u.name}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>{maskEmail(u.email)}</span>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleSend(u)}
                  disabled={sending === u.id}
                >
                  {sending === u.id ? '전송 중...' : '요청'}
                </Button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && !searching && results.length === 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            학생 계정을 찾을 수 없습니다.
          </p>
        )}

        {error && <p className="modal-card__error">{error}</p>}
        {successMsg && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-completed)', margin: 0 }}>{successMsg}</p>
        )}

        <div className="modal-card__actions">
          <Button variant="secondary-light" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { TopNav } from '../components/TopNav';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/AuthContext';
import { searchUsersByName } from '../../infrastructure/repositories/userRepository';
import {
  getInvitationsByTeacher,
} from '../../infrastructure/repositories/invitationRepository';
import { getStudentsByTeacher } from '../../infrastructure/repositories/studentRepository';
import { sendInvitation } from '../../application/services/invitationService';
import { maskEmail } from '../../shared/maskEmail';
import type { User, Invitation, Student } from '../../application/domain';
import './StudentManagePage.css';

type SubjectInputProps = {
  value: string[];
  onChange: (v: string[]) => void;
};

function SubjectInput({ value, onChange }: SubjectInputProps) {
  const [input, setInput] = useState('');

  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  }

  function remove(subject: string) {
    onChange(value.filter((s) => s !== subject));
  }

  return (
    <div className="subject-input">
      <div className="subject-input__tags">
        {value.map((s) => (
          <span key={s} className="subject-tag">
            {s}
            <button
              type="button"
              className="subject-tag__remove"
              onClick={() => remove(s)}
              aria-label={`${s} 삭제`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="subject-input__row">
        <input
          className="field-input subject-input__field"
          type="text"
          placeholder="과목 입력 후 추가"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button variant="secondary-light" onClick={add} type="button">
          추가
        </Button>
      </div>
    </div>
  );
}

type InviteModalProps = {
  user: User;
  students: Student[];
  onClose: () => void;
  onSent: () => void;
  teacherId: string;
  teacherName: string;
};

function InviteModal({ user, students, onClose, onSent, teacherId, teacherName }: InviteModalProps) {
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [linkedStudentId, setLinkedStudentId] = useState(students[0]?.id ?? '');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (role === 'parent' && !linkedStudentId) {
      setError('연결할 학생을 선택해 주세요.');
      return;
    }
    if (subjects.length === 0) {
      setError('과목을 하나 이상 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendInvitation(
        { id: teacherId, name: teacherName },
        user.id,
        role,
        subjects,
        role === 'parent' ? linkedStudentId : undefined,
      );
      onSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : '초대 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">초대장 보내기</h2>
        <div className="modal-card__user">
          <span className="modal-card__user-name">{user.name}</span>
          <span className="modal-card__user-email">{maskEmail(user.email)}</span>
        </div>

        <div className="field-group">
          <label className="field-label">역할</label>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle__btn ${role === 'student' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => setRole('student')}
            >
              학생
            </button>
            <button
              type="button"
              className={`role-toggle__btn ${role === 'parent' ? 'role-toggle__btn--active' : ''}`}
              onClick={() => setRole('parent')}
            >
              학부모
            </button>
          </div>
        </div>

        {role === 'parent' && (
          <div className="field-group">
            <label className="field-label">연결할 학생</label>
            {students.length === 0 ? (
              <p className="modal-card__error">먼저 학생을 등록해 주세요.</p>
            ) : (
              <select
                className="field-input"
                value={linkedStudentId}
                onChange={(e) => setLinkedStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="field-group">
          <label className="field-label">과목</label>
          <SubjectInput value={subjects} onChange={setSubjects} />
        </div>

        {error && <p className="modal-card__error">{error}</p>}

        <div className="modal-card__actions">
          <Button variant="secondary-light" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={loading}>
            {loading ? '전송 중...' : '초대 보내기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기 중',
  accepted: '수락됨',
  rejected: '거절됨',
};

export function StudentManagePage() {
  const { authState } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (authState.status !== 'authenticated') return null;
  const teacher = authState.user;

  async function loadData() {
    const [invs, studs] = await Promise.all([
      getInvitationsByTeacher(teacher.id),
      getStudentsByTeacher(teacher.id),
    ]);
    invs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setInvitations(invs);
    setStudents(studs);
  }

  useEffect(() => {
    loadData();
  }, [teacher.id]);

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
        setResults(found.filter((u) => u.id !== teacher.id));
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, teacher.id]);

  function handleInviteSent() {
    setSelectedUser(null);
    setSuccessMsg('초대장을 보냈습니다.');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadData();
  }

  const pendingInvitations = invitations.filter((i) => i.status === 'pending');
  const pastInvitations = invitations.filter((i) => i.status !== 'pending');

  return (
    <div className="student-manage-page">
      <TopNav />

      <main className="student-manage-page__main">
        <div className="student-manage-page__container">
          <h1 className="student-manage-page__title">학생 관리</h1>

          {/* Search */}
          <section className="smp-section">
            <h2 className="smp-section__title">학생 초대</h2>
            <p className="smp-section__hint">이름 앞부분을 입력하면 검색됩니다</p>
            <div className="search-bar">
              <input
                className="search-bar__input"
                type="text"
                placeholder="학생 또는 학부모 이름 검색..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {searching && <span className="search-bar__spinner" aria-hidden="true" />}
            </div>

            {successMsg && <p className="success-message">{successMsg}</p>}

            {results.length > 0 && (
              <ul className="search-results">
                {results.map((u) => (
                  <li key={u.id} className="search-result-item">
                    <div className="search-result-item__info">
                      <span className="search-result-item__name">{u.name}</span>
                      <span className="search-result-item__email">{maskEmail(u.email)}</span>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => setSelectedUser(u)}
                    >
                      초대
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {query.trim() && !searching && results.length === 0 && (
              <p className="search-empty">검색 결과가 없습니다.</p>
            )}
          </section>

          {/* My Students */}
          <section className="smp-section">
            <h2 className="smp-section__title">내 학생 ({students.length})</h2>
            {students.length === 0 ? (
              <p className="smp-section__empty">등록된 학생이 없습니다.</p>
            ) : (
              <ul className="student-list">
                {students.map((s) => (
                  <li key={s.id} className="student-list__item">
                    <div className="student-list__avatar">{s.name[0]}</div>
                    <div className="student-list__info">
                      <span className="student-list__name">{s.name}</span>
                      <span className="student-list__subjects">{s.subjects.join(', ')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <section className="smp-section">
              <h2 className="smp-section__title">대기 중인 초대 ({pendingInvitations.length})</h2>
              <ul className="invitation-list">
                {pendingInvitations.map((inv) => (
                  <li key={inv.id} className="invitation-item invitation-item--pending">
                    <div className="invitation-item__info">
                      <span className="invitation-item__role">
                        {inv.inviteeRole === 'student' ? '학생' : '학부모'}
                      </span>
                      <span className="invitation-item__subjects">{inv.subjects.join(', ')}</span>
                    </div>
                    <span className="invitation-item__status invitation-item__status--pending">
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Past Invitations */}
          {pastInvitations.length > 0 && (
            <section className="smp-section">
              <h2 className="smp-section__title">지난 초대</h2>
              <ul className="invitation-list">
                {pastInvitations.map((inv) => (
                  <li key={inv.id} className={`invitation-item invitation-item--${inv.status}`}>
                    <div className="invitation-item__info">
                      <span className="invitation-item__role">
                        {inv.inviteeRole === 'student' ? '학생' : '학부모'}
                      </span>
                      <span className="invitation-item__subjects">{inv.subjects.join(', ')}</span>
                    </div>
                    <span className={`invitation-item__status invitation-item__status--${inv.status}`}>
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      {selectedUser && (
        <InviteModal
          user={selectedUser}
          students={students}
          teacherId={teacher.id}
          teacherName={teacher.name}
          onClose={() => setSelectedUser(null)}
          onSent={handleInviteSent}
        />
      )}
    </div>
  );
}

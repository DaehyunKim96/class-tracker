import { useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { completeSignUp } from '../../application/services/authService';
import { useAuth } from '../hooks/AuthContext';
import { Button } from '../components/Button';
import type { Role } from '../../application/domain';
import './RoleSelectPage.css';

type RoleOption = {
  role: Role;
  label: string;
  description: string;
  icon: string;
};

const ROLES: RoleOption[] = [
  {
    role: 'teacher',
    label: '선생님',
    description: '수업 일정을 만들고 수업 내용을 기록합니다.',
    icon: '📖',
  },
  {
    role: 'student',
    label: '학생',
    description: '수업 일정과 수업 기록을 확인합니다.',
    icon: '🧑‍🎓',
  },
  {
    role: 'parent',
    label: '학부모',
    description: '자녀의 수업 일정과 기록을 열람합니다.',
    icon: '👨‍👩‍👧',
  },
];

type Props = {
  firebaseUser: FirebaseUser;
};

export function RoleSelectPage({ firebaseUser }: Props) {
  const { setUser } = useAuth();
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    try {
      const user = await completeSignUp(firebaseUser, selected);
      setUser(user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="role-page">
      <div className="role-card">
        <div className="role-card__header">
          <p className="role-card__welcome">
            안녕하세요, {firebaseUser.displayName?.split(' ')[0]}님
          </p>
          <h1 className="role-card__title">어떤 역할로 사용하실 건가요?</h1>
        </div>

        <div className="role-card__options">
          {ROLES.map((r) => (
            <button
              key={r.role}
              type="button"
              className={`role-option${selected === r.role ? ' role-option--selected' : ''}`}
              onClick={() => setSelected(r.role)}
            >
              <span className="role-option__icon">{r.icon}</span>
              <div className="role-option__text">
                <span className="role-option__label">{r.label}</span>
                <span className="role-option__desc">{r.description}</span>
              </div>
              <span className="role-option__check" aria-hidden="true" />
            </button>
          ))}
        </div>

        <Button
          variant="primary-lg"
          disabled={!selected || loading}
          onClick={handleConfirm}
        >
          {loading ? '설정 중...' : '시작하기'}
        </Button>
      </div>
    </div>
  );
}

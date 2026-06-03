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
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const isValid = name.trim().length >= 2 && selected !== null;

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    if (nameError) setNameError('');
  }

  function handleNameBlur() {
    if (name.trim().length > 0 && name.trim().length < 2) {
      setNameError('이름은 2자 이상 입력해주세요.');
    }
  }

  async function handleConfirm() {
    if (!isValid) return;
    if (name.trim().length < 2) {
      setNameError('이름은 2자 이상 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const user = await completeSignUp(firebaseUser, selected!, name.trim());
      setUser(user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="role-page">
      <div className="role-card">
        <div className="role-card__header">
          <p className="role-card__welcome">환영합니다</p>
          <h1 className="role-card__title">프로필을 설정해주세요</h1>
        </div>

        <div className="role-card__name-section">
          <label className="role-card__label" htmlFor="name-input">
            이름 <span className="role-card__required">*</span>
          </label>
          <p className="role-card__label-hint">
            학생 검색과 수업 기록에 사용됩니다. 본명(한글)을 입력해주세요.
          </p>
          <input
            id="name-input"
            type="text"
            className={`role-card__input${nameError ? ' role-card__input--error' : ''}`}
            placeholder="예) 김민지"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            maxLength={20}
            autoComplete="off"
          />
          {nameError && (
            <p className="role-card__field-error">{nameError}</p>
          )}
        </div>

        <div className="role-card__role-section">
          <label className="role-card__label">
            역할 <span className="role-card__required">*</span>
          </label>
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
        </div>

        <Button
          variant="primary-lg"
          disabled={!isValid || loading}
          onClick={handleConfirm}
        >
          {loading ? '설정 중...' : '시작하기'}
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { signInWithGoogle } from '../../application/services/authService';
import { Button } from '../components/Button';
import './LoginPage.css';

type Props = {
  onNewUser: (firebaseUser: import('firebase/auth').User) => void;
};

export function LoginPage({ onNewUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    try {
      const { isNew, user } = await signInWithGoogle();
      if (isNew) onNewUser(user);
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__brand-mark" aria-hidden="true" />
          <span className="login-card__brand-name">Class Tracker</span>
        </div>

        <div className="login-card__copy">
          <h1 className="login-card__title">수업 일정을 함께.</h1>
          <p className="login-card__sub">
            선생님, 학생, 학부모가 같은 캘린더를 봅니다.
          </p>
        </div>

        <div className="login-card__cta">
          <Button
            variant="primary-lg"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? '로그인 중...' : 'Google로 시작하기'}
          </Button>
          {error && <p className="login-card__error">{error}</p>}
        </div>

        <p className="login-card__legal">
          로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}

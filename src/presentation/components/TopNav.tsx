import { Button } from './Button';
import { useAuth } from '../hooks/AuthContext';
import { signOut } from '../../application/services/authService';
import './TopNav.css';

type Props = {
  variant?: 'light' | 'on-dark';
};

const NAV_ITEMS = ['캘린더', '수업 기록', '학생', '도움말'];

const ROLE_LABEL = { teacher: '선생님', student: '학생', parent: '학부모' } as const;

export function TopNav({ variant = 'light' }: Props) {
  const { authState } = useAuth();
  const isAuthenticated = authState.status === 'authenticated';

  return (
    <nav className={`top-nav top-nav--${variant}`}>
      <div className="top-nav__inner">
        <a className="top-nav__brand" href="/">
          <span className="top-nav__brand-mark" aria-hidden="true" />
          <span className="top-nav__brand-name">Class Tracker</span>
        </a>

        <ul className="top-nav__menu">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a className="top-nav__link" href="#">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="top-nav__cta">
          {isAuthenticated ? (
            <>
              <div className="top-nav__user">
                <span className="top-nav__avatar">
                  {authState.user.name?.[0] ?? '?'}
                </span>
                <span className="top-nav__user-info">
                  <span className="top-nav__user-name">{authState.user.name}</span>
                  <span className="top-nav__user-role">
                    {ROLE_LABEL[authState.user.role]}
                  </span>
                </span>
              </div>
              <Button
                variant={variant === 'on-dark' ? 'outline-on-dark' : 'secondary-light'}
                onClick={signOut}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button variant="primary">Google로 시작하기</Button>
          )}
        </div>
      </div>
    </nav>
  );
}

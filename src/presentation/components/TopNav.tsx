import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { useAuth } from '../hooks/AuthContext';
import { signOut } from '../../application/services/authService';
import './TopNav.css';

type Props = {
  variant?: 'light' | 'on-dark';
};

const ROLE_LABEL = { teacher: '선생님', student: '학생', parent: '학부모' } as const;

export function TopNav({ variant = 'light' }: Props) {
  const { authState } = useAuth();
  const location = useLocation();
  const isAuthenticated = authState.status === 'authenticated';
  const role = isAuthenticated ? authState.user.role : null;

  const navItems: { label: string; to: string; teacherOnly?: boolean }[] = [
    { label: '캘린더', to: '/' },
    { label: '숙제', to: '/homework' },
    { label: '공지', to: '/announcements' },
    { label: '학생', to: '/students', teacherOnly: true },
    { label: '통계', to: '/stats' },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.teacherOnly || role === 'teacher',
  );

  return (
    <nav className={`top-nav top-nav--${variant}`}>
      <div className="top-nav__inner">
        <Link className="top-nav__brand" to="/">
          <span className="top-nav__brand-mark" aria-hidden="true" />
          <span className="top-nav__brand-name">Class Tracker</span>
        </Link>

        <ul className="top-nav__menu">
          {visibleItems.map((item) => (
            <li key={item.to}>
              <Link
                className={`top-nav__link ${location.pathname === item.to ? 'top-nav__link--active' : ''}`}
                to={item.to}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="top-nav__cta">
          {isAuthenticated ? (
            <>
              <div className="top-nav__user">
                <span className="top-nav__avatar">
                  {authState.user.name ?? '?'}
                </span>
                <span className="top-nav__user-info">
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

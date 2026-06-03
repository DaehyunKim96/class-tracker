import { Button } from './Button';
import './TopNav.css';

type Props = {
  variant?: 'light' | 'on-dark';
};

const NAV_ITEMS = ['캘린더', '수업 기록', '학생', '도움말'];

export function TopNav({ variant = 'light' }: Props) {
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
          <Button
            variant={variant === 'on-dark' ? 'outline-on-dark' : 'tertiary'}
          >
            로그인
          </Button>
          <Button variant="primary">시작하기</Button>
        </div>
      </div>
    </nav>
  );
}

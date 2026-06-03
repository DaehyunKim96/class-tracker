import './Footer.css';

const COLUMNS: { title: string; links: string[] }[] = [
  { title: '제품', links: ['캘린더', '수업 기록', '학생 관리', '리포트'] },
  { title: '사용자', links: ['선생님', '학생', '학부모'] },
  { title: '회사', links: ['소개', '블로그', '문의'] },
  { title: '지원', links: ['도움말', '개인정보', '이용약관'] },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a className="footer__wordmark" href="/">
            <span className="footer__brand-mark" aria-hidden="true" />
            Class Tracker
          </a>
          <p className="footer__tagline">
            과외 수업의 일정과 기록을 한 곳에서.
          </p>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((col) => (
            <div className="footer__column" key={col.title}>
              <div className="footer__column-title">{col.title}</div>
              <ul className="footer__list">
                {col.links.map((link) => (
                  <li key={link}>
                    <a className="footer__link" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__legal">
        <div className="footer__legal-inner">
          <span>© {new Date().getFullYear()} Class Tracker</span>
          <span>Made for tutors, students, and parents.</span>
        </div>
      </div>
    </footer>
  );
}

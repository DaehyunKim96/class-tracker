import { Button } from './Button';
import './HeroBand.css';

const PREVIEW_LESSONS = [
  { day: '월', time: '19:00 – 20:30', subject: '수학', status: 'completed' as const },
  { day: '수', time: '19:00 – 20:30', subject: '수학', status: 'completed' as const },
  { day: '금', time: '19:00 – 20:30', subject: '영어', status: 'scheduled' as const },
];

export function HeroBand() {
  return (
    <section className="hero hero--dark">
      <div className="hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">CLASS TRACKER</span>
          <h1 className="hero__title t-display-mega">
            수업 흐름이
            <br />한 눈에.
          </h1>
          <p className="hero__sub">
            선생님이 잡은 일정과 진행한 수업을 학생과 학부모가 같은 화면으로 확인합니다.
          </p>
          <div className="hero__cta">
            <Button variant="primary-lg">캘린더 열기</Button>
            <Button variant="outline-on-dark">데모 보기</Button>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card hero__card--back" aria-hidden="true">
            <div className="hero__back-label">이번 달</div>
            <div className="hero__back-number">12</div>
            <div className="hero__back-caption">수업 완료</div>
          </div>

          <div className="hero__card hero__card--front" aria-hidden="true">
            <div className="hero__card-header">
              <span className="hero__card-title">이번 주 수업</span>
              <span className="hero__badge">5월 27 – 6월 2</span>
            </div>
            <ul className="hero__lesson-list">
              {PREVIEW_LESSONS.map((l, i) => (
                <li className="hero__lesson-row" key={i}>
                  <span className="hero__day">{l.day}</span>
                  <span className="hero__time">{l.time}</span>
                  <span className="hero__subject">{l.subject}</span>
                  <span className={`hero__status hero__status--${l.status}`}>
                    {l.status === 'completed' ? '완료' : '예정'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import { TopNav } from '../components/TopNav';
import { HeroBand } from '../components/HeroBand';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import './CalendarPage.css';

type LessonStatus = 'scheduled' | 'completed' | 'cancelled';

type CalCell = {
  date: number;
  dim?: boolean;
  today?: boolean;
  lessons?: { time: string; subject: string; status: LessonStatus }[];
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const CALENDAR_CELLS: CalCell[] = [
  { date: 31, dim: true },
  { date: 1, lessons: [{ time: '19:00', subject: '수학', status: 'completed' }] },
  { date: 2 },
  { date: 3, today: true, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 4 },
  { date: 5, lessons: [{ time: '19:00', subject: '영어', status: 'scheduled' }] },
  { date: 6 },
  { date: 7 },
  { date: 8, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 9 },
  { date: 10, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 11 },
  { date: 12, lessons: [{ time: '19:00', subject: '영어', status: 'scheduled' }] },
  { date: 13 },
  { date: 14 },
  { date: 15, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 16 },
  { date: 17, lessons: [{ time: '19:00', subject: '수학', status: 'cancelled' }] },
  { date: 18 },
  { date: 19, lessons: [{ time: '19:00', subject: '영어', status: 'scheduled' }] },
  { date: 20 },
  { date: 21 },
  { date: 22, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 23 },
  { date: 24, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 25 },
  { date: 26, lessons: [{ time: '19:00', subject: '영어', status: 'scheduled' }] },
  { date: 27 },
  { date: 28 },
  { date: 29, lessons: [{ time: '19:00', subject: '수학', status: 'scheduled' }] },
  { date: 30 },
  { date: 1, dim: true },
  { date: 2, dim: true },
  { date: 3, dim: true },
  { date: 4, dim: true },
];

type Lesson = {
  subject: string;
  student: string;
  date: string;
  time: string;
  duration: string;
  status: LessonStatus;
  summary?: string;
};

const RECENT_LESSONS: Lesson[] = [
  {
    subject: '수학',
    student: '김민지',
    date: '6월 1일 (월)',
    time: '19:00',
    duration: '90분',
    status: 'completed',
    summary: '이차함수 그래프 평행이동, 교과서 p.78–82 풀이 검토',
  },
  {
    subject: '수학',
    student: '김민지',
    date: '5월 27일 (수)',
    time: '19:00',
    duration: '90분',
    status: 'completed',
    summary: '이차함수 정의, 그래프의 꼭짓점/대칭축',
  },
  {
    subject: '영어',
    student: '김민지',
    date: '5월 22일 (금)',
    time: '19:00',
    duration: '90분',
    status: 'completed',
    summary: 'Unit 4 reading + 단어 50개 점검',
  },
  {
    subject: '수학',
    student: '김민지',
    date: '5월 20일 (수)',
    time: '19:00',
    duration: '90분',
    status: 'completed',
    summary: '일차함수 복습 + 단원 평가',
  },
  {
    subject: '수학',
    student: '김민지',
    date: '5월 18일 (월)',
    time: '19:00',
    duration: '-',
    status: 'cancelled',
    summary: '학생 컨디션으로 휴강 — 다음 주 보강',
  },
];

const STATUS_LABEL: Record<LessonStatus, string> = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
};

export function CalendarPage() {
  return (
    <>
      <div className="page__hero-area">
        <TopNav variant="on-dark" />
        <HeroBand />
      </div>

      <main className="page__main">
        <section className="section">
          <div className="section__inner">
            <header className="section__header">
              <div>
                <span className="section__eyebrow">CALENDAR</span>
                <h2 className="section__title t-display-sm">2026년 6월</h2>
              </div>
              <div className="cal-nav">
                <Button variant="secondary-light" aria-label="이전 달">‹</Button>
                <Button variant="secondary-light">오늘</Button>
                <Button variant="secondary-light" aria-label="다음 달">›</Button>
              </div>
            </header>

            <div className="cal">
              <div className="cal__weekdays">
                {WEEKDAYS.map((d) => (
                  <div className="cal__weekday" key={d}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="cal__cells">
                {CALENDAR_CELLS.map((cell, i) => (
                  <div
                    key={i}
                    className={[
                      'cal__cell',
                      cell.dim ? 'cal__cell--dim' : '',
                      cell.today ? 'cal__cell--today' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="cal__date-row">
                      <span className="cal__date">{cell.date}</span>
                      {cell.today && <span className="cal__today-dot" aria-label="오늘" />}
                    </div>
                    {cell.lessons?.map((l, li) => (
                      <div key={li} className={`time-block time-block--${l.status}`}>
                        <span className="time-block__time">{l.time}</span>
                        <span className="time-block__subject">{l.subject}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="section__inner">
            <header className="section__header">
              <div>
                <span className="section__eyebrow">LESSON HISTORY</span>
                <h2 className="section__title t-display-sm">최근 수업</h2>
              </div>
              <Button variant="secondary-light">전체 보기</Button>
            </header>

            <ul className="lesson-list">
              {RECENT_LESSONS.map((l, i) => (
                <li className="lesson-row" key={i}>
                  <div className="lesson-row__icon">{l.subject[0]}</div>
                  <div className="lesson-row__primary">
                    <span className="lesson-row__subject">{l.subject}</span>
                    {l.summary && (
                      <span className="lesson-row__summary">{l.summary}</span>
                    )}
                  </div>
                  <div className="lesson-row__meta">
                    <span className="lesson-row__date">{l.date}</span>
                    <span className="lesson-row__time">
                      {l.time} · {l.duration}
                    </span>
                  </div>
                  <span className={`lesson-row__status lesson-row__status--${l.status}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cta-band">
          <div className="cta-band__inner">
            <h2 className="cta-band__title t-display-md">
              수업을 정리해보세요.
            </h2>
            <p className="cta-band__sub">
              일정 잡기부터 수업 기록까지, 학생과 학부모와 같은 화면으로.
            </p>
            <div className="cta-band__cta">
              <Button variant="primary-lg">시작하기</Button>
              <Button variant="outline-on-dark">도움말 보기</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

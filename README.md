# Class Tracker

과외 수업 일정과 수업 기록을 선생/학생/학부모가 함께 보는 캘린더 웹앱.

## 스택

- React 19 + TypeScript
- Vite
- Firebase (Auth + Firestore)

## 아키텍처

3-tier 구조로 의존성을 한 방향(`presentation → application → infrastructure`)으로 유지한다.

```
src/
├── presentation/           # React 영역 (pages, components, hooks)
├── application/
│   ├── domain/             # 도메인 타입/모델 (Lesson, User)
│   └── services/           # 비즈니스 로직
├── infrastructure/
│   ├── firebase/           # Firebase 클라이언트 초기화
│   └── repositories/       # Firestore CRUD
└── shared/                 # 공용 유틸/상수
```

## 개발

```bash
cp .env.example .env       # Firebase 설정값 입력
npm install
npm run dev
```

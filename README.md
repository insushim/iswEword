# 영단어 플래시카드 웹앱

초등학생을 위한 영단어 암기 플래시카드 웹앱입니다.

## 프로젝트 구조

```
isw영단어/
├── vocab-flashcard/     # 프론트엔드 (Next.js 14)
└── backend/             # 백엔드 (Express.js + TypeScript)
```

## 기능

### 학습 모드
- **단어 학습**: 3D 플립 플래시카드로 새 단어 학습
- **복습하기**: 라이트너 박스 시스템 기반 간격 반복 학습
- **4지선다 퀴즈**: 객관식 문제로 실력 테스트
- **받아쓰기**: 스펠링 연습
- **매칭 게임**: 영단어-한글 뜻 짝 맞추기

### 게이미피케이션
- XP 포인트 & 레벨 시스템
- 일일 목표
- 연속 학습 스트릭
- 업적 배지

### 라이트너 박스 시스템
- Box 1: 매일 복습
- Box 2: 2일 후 복습
- Box 3: 4일 후 복습
- Box 4: 7일 후 복습
- Box 5: 완전 암기 (14일 후)

### 기타 기능
- TTS 발음 지원 (미국/영국식)
- 다크모드
- 학습 데이터 내보내기/가져오기
- 1000개 영단어 (초등 3~6학년 + 심화)

---

## 로컬 개발 환경 설정

### 1. 프론트엔드 실행

```bash
cd vocab-flashcard
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 2. 백엔드 실행

```bash
cd backend
npm install
npm run dev
```

API 서버: http://localhost:5000

---

## 배포

### 프론트엔드 (Vercel)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 가져오기
3. 환경 변수 설정:
   - `NEXT_PUBLIC_API_URL`: 백엔드 API URL

### 백엔드 (Railway)

1. GitHub에 코드 푸시
2. [Railway](https://railway.app)에서 프로젝트 생성
3. backend 폴더를 루트로 설정
4. 환경 변수 설정:
   - `JWT_SECRET`: JWT 시크릿 키 (강력한 랜덤 문자열)
   - `FRONTEND_URL`: 프론트엔드 URL
   - `NODE_ENV`: production

---

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 학습 진행
- `GET /api/progress` - 진행 상황 조회
- `PUT /api/progress` - 진행 상황 업데이트
- `POST /api/progress/answer` - 정답/오답 기록
- `GET /api/progress/leitner` - 라이트너 데이터 조회
- `POST /api/progress/sync` - 데이터 동기화
- `GET /api/progress/stats` - 통계 조회
- `POST /api/progress/achievement` - 업적 추가
- `POST /api/progress/session` - 학습 세션 기록

### 헬스 체크
- `GET /api/health` - 서버 상태 확인

---

## 기술 스택

### 프론트엔드
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React Icons
- Canvas Confetti

### 백엔드
- Express.js
- TypeScript
- Better-SQLite3
- JWT (JSON Web Tokens)
- bcryptjs

---

## 라이선스

MIT License

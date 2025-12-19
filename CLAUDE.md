# CLAUDE.md - 완전 자동화 개발 최종판 v8.0

## 🤖 에이전트 모드
완전 자율 개발 에이전트. **오류 0까지 자동 수정**. 완료까지 멈추지 않음.

---

## 🚨 절대 규칙

### 금지
- ❌ "~할까요?" 질문
- ❌ TODO, FIXME, PLACEHOLDER, "..."
- ❌ 미완성 코드
- ❌ 에러 있는 상태로 완료 선언
- ❌ any 타입 남용
- ❌ 검증 없이 정보 제공

### 필수
- ✅ **오류 0개 될 때까지 자동 수정**
- ✅ **API 키만 넣으면 바로 작동하는 완전한 코드**
- ✅ 프론트 + 백엔드 + DB + 인증 한번에
- ✅ 완료까지 자동 진행
- ✅ 빌드 + 타입체크 + 린트 모두 통과
- ✅ TypeScript strict 모드
- ✅ 한국어 UI

---

# 🔧 자동 수정/검증 시스템

## @autofix - 완전 자동 수정 ⭐⭐⭐
```yaml
역할: 모든 에러를 0개가 될 때까지 자동으로 찾아서 수정
호출: "@autofix"

자동 실행 순서:
  1. TypeScript 타입 에러 검사 (npx tsc --noEmit)
  2. ESLint 에러 검사 (npm run lint)
  3. 빌드 테스트 (npm run build)
  4. 런타임 에러 검사
  5. 발견된 에러 자동 수정
  6. 1-5 반복 (에러 0개 될 때까지, 최대 10회)
  7. 최종 검증 보고서 출력

검사 항목:
  ✅ TypeScript 타입 에러
  ✅ ESLint 에러/경고
  ✅ 빌드 에러
  ✅ import/export 에러
  ✅ 환경변수 누락
  ✅ 의존성 문제
  ✅ 런타임 에러
```

## @validate - 전체 코드 검증 ⭐⭐⭐
```yaml
역할: 프로젝트 전체 코드 품질 검증
호출: "@validate"

검증 항목:
  ✅ 타입 안전성 (TypeScript strict)
  ✅ 코드 스타일 (ESLint + Prettier)
  ✅ 보안 취약점 (npm audit)
  ✅ 의존성 버전
  ✅ 빌드 성공 여부
  ✅ 환경변수 검증
  ✅ API 엔드포인트 테스트
  ✅ 데드 코드 탐지
  ✅ 순환 의존성 체크
  ✅ 번들 사이즈 분석
```

## @healthcheck - 프로젝트 건강 체크 ⭐⭐
```yaml
역할: 프로젝트 전반적인 상태 진단
호출: "@healthcheck"

진단: 코드 품질 점수, 테스트 커버리지, 보안 점수, 성능 점수
```

## @fix-all - 모든 문제 일괄 수정 ⭐⭐⭐
```yaml
역할: 발견된 모든 문제를 한번에 수정
호출: "@fix-all"
```

## @auto-test - 자동 테스트 생성 ⭐⭐
```yaml
역할: 코드 분석 후 테스트 자동 생성
호출: "@auto-test [대상]"

생성 항목:
  - 단위 테스트 (Vitest)
  - 통합 테스트
  - E2E 테스트 (Playwright)
  - API 테스트
  - 스냅샷 테스트
  - 커버리지 리포트
```

## @auto-doc - 자동 문서화 ⭐⭐
```yaml
역할: 코드 분석 후 문서 자동 생성
호출: "@auto-doc"

생성 항목:
  - README.md
  - API 문서 (Swagger/OpenAPI)
  - 컴포넌트 문서 (Storybook)
  - 타입 문서 (TypeDoc)
  - 변경 로그 (CHANGELOG)
  - 기여 가이드
```

## @auto-refactor - 자동 리팩토링 ⭐⭐
```yaml
역할: 코드 품질 자동 개선
호출: "@auto-refactor [대상]"

수행 작업:
  - 중복 코드 제거
  - 함수 분리
  - 추상화 적용
  - 네이밍 개선
  - 복잡도 감소
  - 패턴 적용
```

## @auto-optimize - 자동 최적화 ⭐⭐
```yaml
역할: 성능 자동 최적화
호출: "@auto-optimize"

최적화 항목:
  - 이미지 최적화 (WebP, lazy loading)
  - 코드 스플리팅
  - 트리 쉐이킹
  - 번들 최적화
  - 캐싱 전략
  - 메모이제이션
  - 가상화 (virtualization)
```

## @auto-secure - 자동 보안 스캔 ⭐⭐
```yaml
역할: 보안 취약점 자동 스캔 및 수정
호출: "@auto-secure"

스캔 항목:
  - npm audit
  - OWASP Top 10
  - XSS 취약점
  - SQL Injection
  - CSRF
  - 인증/인가 검사
  - 환경변수 노출
  - 하드코딩된 비밀
```

## @auto-a11y - 자동 접근성 검사 ⭐⭐
```yaml
역할: 접근성 자동 검사 및 수정
호출: "@auto-a11y"

검사 항목:
  - WCAG 2.1 준수
  - aria-label
  - 키보드 네비게이션
  - 색상 대비
  - 포커스 관리
  - 스크린 리더 호환
```

## @auto-seo - 자동 SEO 분석 ⭐⭐
```yaml
역할: SEO 자동 분석 및 최적화
호출: "@auto-seo"

분석 항목:
  - 메타태그
  - Open Graph
  - 구조화 데이터
  - sitemap.xml
  - robots.txt
  - Core Web Vitals
  - 페이지 속도
```

---

# 🚀 원샷 빌드

## @fullstack - 풀스택 원샷 빌더 ⭐⭐⭐
```yaml
호출: "@fullstack [앱 설명]"
예시: @fullstack 회원제 블로그 만들어줘

자동 포함:
  ✅ 프로젝트 구조 전체
  ✅ 인증 시스템
  ✅ DB 스키마 + 연결
  ✅ API 라우트 전체
  ✅ UI 페이지 전체
  ✅ 공통 컴포넌트
  ✅ 에러/로딩 처리
  ✅ .env.example
  ✅ 자동 검증 (@autofix 실행)
```

## @quickstart - 템플릿 빠른 시작
```yaml
호출: "@quickstart [템플릿]"

템플릿:
  auth, blog, dashboard, ecommerce, chat,
  quiz, game, landing, saas, portfolio,
  admin, social, booking, marketplace, lms
```

## @clone - 서비스 클론
```yaml
호출: "@clone [서비스명]"
예시: twitter, instagram, notion, trello, spotify, airbnb, netflix
```

## @feature - 기능 추가
```yaml
호출: "@feature [기능명]"
예시: 댓글, 좋아요, 검색, 알림, 결제, 팔로우, 북마크, 공유, 다크모드
```

## @page - 페이지 생성
```yaml
호출: "@page [페이지명]"
예시: 설정, 프로필, 대시보드, 검색결과, 상세, 마이페이지
```

## @component - 컴포넌트 생성
```yaml
호출: "@component [컴포넌트명]"
예시: 모달, 드롭다운, 테이블, 폼, 카드, 네비게이션
```

## @api - API 엔드포인트 생성
```yaml
호출: "@api [리소스명]"
예시: @api users, @api posts, @api comments
→ CRUD 전체 자동 생성
```

---

# 🎮 게임 개발 자동화

## @game-init - 게임 프로젝트 초기화 ⭐⭐
```yaml
호출: "@game-init [게임 유형]"

유형:
  platformer   # 플랫포머
  puzzle       # 퍼즐
  rpg          # RPG
  shooter      # 슈팅
  racing       # 레이싱
  card         # 카드 게임
  idle         # 방치형
  match3       # 매치3
  tower-defense # 타워 디펜스

자동 생성:
  - 게임 루프
  - 물리 엔진 설정
  - 입력 시스템
  - 씬 관리
  - 에셋 로더
  - 사운드 시스템
```

## @game-system - 게임 시스템 추가 ⭐⭐
```yaml
호출: "@game-system [시스템]"

시스템:
  physics      # 물리 엔진
  collision    # 충돌 감지
  particle     # 파티클 시스템
  sound        # 사운드 시스템
  save-load    # 저장/불러오기
  achievement  # 업적 시스템
  inventory    # 인벤토리
  dialogue     # 대화 시스템
  quest        # 퀘스트 시스템
  crafting     # 제작 시스템
  skill-tree   # 스킬 트리
  ai           # AI/NPC 시스템
```

## @game-ui - 게임 UI 생성 ⭐⭐
```yaml
호출: "@game-ui [UI 유형]"

UI:
  hud          # 헤드업 디스플레이
  menu         # 메인 메뉴
  pause        # 일시정지 화면
  settings     # 설정 화면
  inventory    # 인벤토리 UI
  shop         # 상점 UI
  dialog       # 대화창
  minimap      # 미니맵
  healthbar    # 체력바
  score        # 점수판
```

## @game-monetize - 수익화 시스템 ⭐
```yaml
호출: "@game-monetize [유형]"

유형:
  iap          # 인앱 구매
  ads          # 광고 (리워드/배너/전면)
  subscription # 구독
  battlepass   # 배틀패스
```

## @game-social - 소셜 시스템 ⭐
```yaml
호출: "@game-social [기능]"

기능:
  leaderboard  # 리더보드
  friend       # 친구 시스템
  guild        # 길드/클랜
  chat         # 채팅
  gift         # 선물 시스템
  pvp          # PvP 매칭
```

## @game-balance - 게임 밸런싱 ⭐
```yaml
호출: "@game-balance"

분석/조정:
  - 난이도 곡선
  - 경제 밸런스
  - 드롭률 조정
  - 경험치 공식
  - 데미지 계산
  - 스테이지 진행
```

---

# 📱 앱 개발 자동화

## @app-init - 앱 프로젝트 초기화 ⭐⭐
```yaml
호출: "@app-init [유형]"

유형:
  pwa          # 프로그레시브 웹앱
  expo         # React Native (Expo)
  tauri        # 데스크톱 앱
  electron     # Electron 앱
```

## @app-feature - 앱 기능 추가 ⭐⭐
```yaml
호출: "@app-feature [기능]"

기능:
  offline      # 오프라인 모드
  push         # 푸시 알림
  deeplink     # 딥링킹
  biometric    # 생체 인증
  camera       # 카메라
  location     # 위치 서비스
  storage      # 로컬 스토리지
  share        # 공유 기능
  qr           # QR 코드
  nfc          # NFC
```

## @app-analytics - 분석 통합 ⭐
```yaml
호출: "@app-analytics [서비스]"

서비스:
  ga4          # Google Analytics 4
  mixpanel     # Mixpanel
  amplitude    # Amplitude
  posthog      # PostHog
  vercel       # Vercel Analytics
```

## @app-crash - 크래시 리포팅 ⭐
```yaml
호출: "@app-crash [서비스]"

서비스:
  sentry       # Sentry
  bugsnag      # Bugsnag
  crashlytics  # Firebase Crashlytics
```

## @app-ab - A/B 테스트 ⭐
```yaml
호출: "@app-ab [도구]"

도구:
  posthog      # PostHog
  growthbook   # GrowthBook
  optimizely   # Optimizely
```

---

# 🔄 유지보수/관리 자동화

## @maintain - 정기 유지보수 ⭐⭐
```yaml
호출: "@maintain"

수행:
  - 의존성 업데이트
  - 보안 패치
  - 데드 코드 제거
  - 코드 포맷팅
  - 성능 최적화
```

## @upgrade - 버전 업그레이드 ⭐⭐
```yaml
호출: "@upgrade [대상]"
예시: @upgrade next, @upgrade all, @upgrade react
```

## @migrate - 마이그레이션 ⭐⭐
```yaml
호출: "@migrate [대상]"
예시: @migrate pages-to-app, @migrate prisma
```

## @cleanup - 코드 정리 ⭐
```yaml
호출: "@cleanup"

정리: 미사용 import, 미사용 변수, console.log, 캐시
```

## @dependency - 의존성 관리 ⭐
```yaml
호출: "@dependency [작업]"
작업: check, update, audit, fix, clean
```

## @backup - 백업
```yaml
호출: "@backup [대상]"
대상: code, database, env
```

## @rollback - 롤백
```yaml
호출: "@rollback [대상]"
```

## @hotfix - 긴급 수정 ⭐
```yaml
호출: "@hotfix [문제]"
```

## @monitor - 모니터링 설정 ⭐⭐
```yaml
호출: "@monitor [설정]"

설정:
  uptime       # 업타임 모니터링
  performance  # 성능 모니터링
  error        # 에러 추적
  log          # 로그 수집
  alert        # 알림 설정
```

## @log-analyze - 로그 분석 ⭐
```yaml
호출: "@log-analyze"

분석:
  - 에러 패턴
  - 사용자 행동
  - 성능 병목
  - 보안 이슈
```

## @cost-analyze - 비용 분석 ⭐
```yaml
호출: "@cost-analyze"

분석:
  - API 호출 비용
  - DB 비용
  - 호스팅 비용
  - 최적화 제안
```

## @scale - 스케일링 ⭐
```yaml
호출: "@scale [방향]"

방향:
  up           # 스케일 업
  down         # 스케일 다운
  auto         # 오토 스케일링 설정
```

---

# 🐛 오류 수정 자동화

## @debugger - 에러 분석/해결 ⭐⭐⭐
```yaml
호출: "@debugger [에러]"

프로세스:
  1. 에러 유형 분류
  2. 원인 분석
  3. 즉시 수정
  4. 예방 패턴 적용
```

## @error-hunt - 에러 헌팅 ⭐⭐
```yaml
호출: "@error-hunt"

전체 프로젝트에서 잠재적 에러 탐지:
  - null/undefined 가능성
  - 타입 불일치
  - 비동기 처리 문제
  - 메모리 누수
  - 무한 루프 가능성
  - 경쟁 조건
```

## @trace - 에러 추적 ⭐⭐
```yaml
호출: "@trace [에러]"

추적:
  - 에러 발생 경로
  - 콜 스택 분석
  - 관련 파일/함수
  - 재현 조건
```

## @fix-type - 타입 에러 수정 ⭐
```yaml
호출: "@fix-type"
모든 TypeScript 타입 에러 자동 수정
```

## @fix-lint - 린트 에러 수정 ⭐
```yaml
호출: "@fix-lint"
모든 ESLint 에러 자동 수정
```

## @fix-build - 빌드 에러 수정 ⭐
```yaml
호출: "@fix-build"
빌드 실패 원인 분석 및 수정
```

## @fix-runtime - 런타임 에러 수정 ⭐
```yaml
호출: "@fix-runtime [에러]"
런타임 에러 분석 및 수정
```

## @fix-hydration - Hydration 에러 수정 ⭐
```yaml
호출: "@fix-hydration"
Next.js Hydration 에러 자동 수정
```

## @fix-cors - CORS 에러 수정 ⭐
```yaml
호출: "@fix-cors"
CORS 에러 분석 및 수정
```

## @fix-memory - 메모리 누수 수정 ⭐
```yaml
호출: "@fix-memory"

분석:
  - 이벤트 리스너 정리
  - 구독 해제
  - 참조 정리
  - 캐시 관리
```

## @fix-performance - 성능 문제 수정 ⭐
```yaml
호출: "@fix-performance"

분석/수정:
  - 리렌더 문제
  - 번들 사이즈
  - 이미지 최적화
  - 지연 로딩
```

---

# 👥 서브에이전트 전체 (60개)

## 🔧 자동 수정/검증 (12개)
| 명령어 | 설명 |
|--------|------|
| `@autofix` | **에러 0개까지 자동 수정** |
| `@validate` | 전체 코드 검증 |
| `@healthcheck` | 프로젝트 건강 체크 |
| `@fix-all` | 모든 문제 일괄 수정 |
| `@auto-test` | 테스트 자동 생성 |
| `@auto-doc` | 문서 자동 생성 |
| `@auto-refactor` | 자동 리팩토링 |
| `@auto-optimize` | 자동 최적화 |
| `@auto-secure` | 자동 보안 스캔 |
| `@auto-a11y` | 자동 접근성 검사 |
| `@auto-seo` | 자동 SEO 분석 |
| `@format` | 코드 포맷팅 |

## 🐛 오류 수정 (10개)
| 명령어 | 설명 |
|--------|------|
| `@debugger [에러]` | 에러 분석/해결 |
| `@error-hunt` | 잠재적 에러 탐지 |
| `@trace [에러]` | 에러 추적 |
| `@fix-type` | 타입 에러 수정 |
| `@fix-lint` | 린트 에러 수정 |
| `@fix-build` | 빌드 에러 수정 |
| `@fix-runtime` | 런타임 에러 수정 |
| `@fix-hydration` | Hydration 에러 수정 |
| `@fix-cors` | CORS 에러 수정 |
| `@fix-memory` | 메모리 누수 수정 |

## 🚀 원샷 빌드 (7개)
| 명령어 | 설명 |
|--------|------|
| `@fullstack [앱]` | 풀스택 앱 생성 |
| `@quickstart [템플릿]` | 템플릿 시작 |
| `@clone [서비스]` | 서비스 클론 |
| `@feature [기능]` | 기능 추가 |
| `@page [페이지]` | 페이지 생성 |
| `@component [컴포넌트]` | 컴포넌트 생성 |
| `@api [리소스]` | API 생성 |

## 🎮 게임 개발 (6개)
| 명령어 | 설명 |
|--------|------|
| `@game-init [유형]` | 게임 프로젝트 초기화 |
| `@game-system [시스템]` | 게임 시스템 추가 |
| `@game-ui [UI]` | 게임 UI 생성 |
| `@game-monetize [유형]` | 수익화 시스템 |
| `@game-social [기능]` | 소셜 시스템 |
| `@game-balance` | 게임 밸런싱 |

## 📱 앱 개발 (5개)
| 명령어 | 설명 |
|--------|------|
| `@app-init [유형]` | 앱 프로젝트 초기화 |
| `@app-feature [기능]` | 앱 기능 추가 |
| `@app-analytics [서비스]` | 분석 통합 |
| `@app-crash [서비스]` | 크래시 리포팅 |
| `@app-ab` | A/B 테스트 |

## 🔄 유지보수 (12개)
| 명령어 | 설명 |
|--------|------|
| `@maintain` | 정기 유지보수 |
| `@upgrade [대상]` | 버전 업그레이드 |
| `@migrate [대상]` | 마이그레이션 |
| `@cleanup` | 코드 정리 |
| `@dependency [작업]` | 의존성 관리 |
| `@backup` | 백업 |
| `@rollback` | 롤백 |
| `@hotfix [문제]` | 긴급 수정 |
| `@monitor [설정]` | 모니터링 |
| `@log-analyze` | 로그 분석 |
| `@cost-analyze` | 비용 분석 |
| `@scale [방향]` | 스케일링 |

## 🛠️ 개발 (5개)
| 명령어 | 설명 |
|--------|------|
| `@frontend [작업]` | UI 개발 |
| `@backend [작업]` | API 개발 |
| `@database [작업]` | DB 작업 |
| `@api-designer [설계]` | API 설계 |
| `@architect [요청]` | 시스템 설계 |

## ✅ 품질 (6개)
| 명령어 | 설명 |
|--------|------|
| `@reviewer [코드]` | 코드 리뷰 |
| `@tester [대상]` | 테스트 작성 |
| `@security [검토]` | 보안 검토 |
| `@optimizer [대상]` | 성능 최적화 |
| `@refactorer [코드]` | 리팩토링 |
| `@accessibility [검토]` | 접근성 검토 |

## 🚀 배포 (2개)
| 명령어 | 설명 |
|--------|------|
| `@deploy [작업]` | 배포 |
| `@devops [작업]` | CI/CD |

## 🔍 리서치 (2개)
| 명령어 | 설명 |
|--------|------|
| `@researcher [주제]` | 정보 검색 |
| `@fact-checker [내용]` | 팩트체크 |

## 📝 콘텐츠 (3개)
| 명령어 | 설명 |
|--------|------|
| `@documentation` | 문서화 |
| `@translator [번역]` | 번역 |
| `@copywriter [요청]` | 문구 작성 |

---

# 📚 스킬 전체 (65개)

## 🔧 자동 수정/검증 (12개)
| 트리거 | 스킬 |
|--------|------|
| "자동 수정", "에러 고쳐" | auto-repair |
| "검증", "체크해줘" | code-validation |
| "건강 체크" | project-health |
| "테스트 생성", "테스트 만들어" | auto-test-gen |
| "문서 생성", "문서화해줘" | auto-documentation |
| "리팩토링해줘" | auto-refactoring |
| "최적화해줘" | auto-optimization |
| "보안 검사" | auto-security |
| "접근성 검사" | auto-accessibility |
| "SEO 검사" | auto-seo |
| "린트 수정" | lint-fix |
| "타입 수정" | type-fix |

## 🐛 오류 수정 (10개)
| 트리거 | 스킬 |
|--------|------|
| "에러", "오류" | error-debugger |
| "에러 찾아줘" | error-hunting |
| "에러 추적" | error-tracing |
| "타입 에러" | type-error-fix |
| "린트 에러" | lint-error-fix |
| "빌드 에러" | build-error-fix |
| "런타임 에러" | runtime-error-fix |
| "hydration" | hydration-fix |
| "CORS" | cors-fix |
| "메모리 누수" | memory-leak-fix |

## 🚀 핵심 (7개)
| 트리거 | 스킬 |
|--------|------|
| "풀스택", "전체" | fullstack-generator |
| "로그인", "인증" | auth-system |
| "CRUD", "게시판" | crud-generator |
| "웹앱" | nextjs-webapp |
| "API 연결" | api-integrator |
| "컴포넌트 생성" | component-generator |
| "API 생성" | api-generator |

## 🎮 게임 개발 (10개)
| 트리거 | 스킬 |
|--------|------|
| "게임 초기화" | game-init |
| "게임 시스템" | game-system |
| "게임 UI" | game-ui |
| "수익화" | game-monetize |
| "리더보드" | game-leaderboard |
| "게임 밸런싱" | game-balance |
| "웹 게임", "Phaser" | web-game |
| "유니티" | unity-game |
| "레벨 시스템" | game-mechanics |
| "멀티플레이어" | multiplayer |

## 📱 앱 개발 (8개)
| 트리거 | 스킬 |
|--------|------|
| "PWA" | pwa-app |
| "모바일 앱" | mobile-app |
| "오프라인" | offline-mode |
| "푸시 알림" | push-notification |
| "딥링크" | deep-linking |
| "분석 통합" | analytics-integration |
| "크래시 리포트" | crash-reporting |
| "A/B 테스트" | ab-testing |

## 🔄 유지보수 (12개)
| 트리거 | 스킬 |
|--------|------|
| "유지보수" | maintenance |
| "업그레이드" | version-upgrade |
| "마이그레이션" | migration |
| "정리", "클린업" | cleanup |
| "의존성" | dependency-management |
| "백업" | backup |
| "롤백" | rollback |
| "핫픽스" | hotfix |
| "모니터링" | monitoring |
| "로그 분석" | log-analysis |
| "비용 분석" | cost-analysis |
| "스케일링" | scaling |

## 💾 데이터베이스 (3개)
| 트리거 | 스킬 |
|--------|------|
| "DB 설계" | database-design |
| "DB 최적화" | database-optimizer |
| "실시간" | realtime |

## ⚙️ 기능 (5개)
| 트리거 | 스킬 |
|--------|------|
| "파일 업로드" | file-upload |
| "결제" | payment |
| "이메일" | email |
| "지도" | map |
| "다국어" | i18n |

---

# 🔍 정보 검증 규칙

```yaml
교차검증 필수:
  - 최소 2-3개 공신력 있는 출처
  - 불확실하면 "확인 필요" 명시

할루시네이션 방지:
  - 존재하지 않는 API 사용 금지
  - 실제 테스트된 코드만 제공
```

---

# 🎨 UI/UX 규칙

```yaml
디자인:
  - 글래스모피즘
  - Framer Motion
  - 다크모드

컴포넌트:
  - 스켈레톤 로딩
  - 토스트 알림
  - 로딩/에러/빈 상태
```

---

# 🛠️ 기술 스택

```yaml
Framework: Next.js 14+ (App Router)
Language: TypeScript (strict)
Styling: Tailwind CSS
Animation: Framer Motion
State: Zustand
Form: React Hook Form + Zod
Database: Supabase
AI: Gemini API
Testing: Vitest + Playwright
PWA: Serwist
```

---

# 🔄 자동 실행 프로세스

## 프로젝트 생성
```
@fullstack [앱] → 자동 @autofix → 에러 0개 확인 → 완료
```

## 코드 수정 후
```
@autofix → 에러 0개까지 반복 → 완료
```

## 정기 유지보수
```
@healthcheck → @maintain → @dependency update → @autofix
```

## 게임 개발
```
@game-init [유형] → @game-system [시스템] → @game-ui → @autofix
```

## 앱 개발
```
@app-init [유형] → @app-feature [기능] → @autofix
```

---

# ⚡ 퀵 레퍼런스

## 🔥 핵심 명령어
```
@fullstack [앱]     # 완전한 앱 생성
@autofix            # 에러 0개까지 자동 수정
@validate           # 전체 검증
@maintain           # 유지보수
```

## 자동 수정
```
@autofix      @fix-all      @fix-type
@fix-lint     @fix-build    @fix-runtime
@fix-hydration  @fix-cors   @fix-memory
```

## 자동 생성
```
@auto-test    @auto-doc     @auto-refactor
@auto-optimize  @auto-secure  @auto-a11y
```

## 원샷 빌드
```
@fullstack    @quickstart   @clone
@feature      @page         @component   @api
```

## 게임 개발
```
@game-init    @game-system  @game-ui
@game-monetize  @game-social  @game-balance
```

## 앱 개발
```
@app-init     @app-feature  @app-analytics
@app-crash    @app-ab
```

## 유지보수
```
@maintain     @upgrade      @migrate
@cleanup      @dependency   @monitor
@hotfix       @rollback     @backup
```

---

# 📊 완료 보고서

```
═══════════════════════════════════════
       🎉 작업 완료 보고서
═══════════════════════════════════════
✅ 빌드: 성공
✅ 타입 체크: 에러 0개
✅ 린트: 에러 0개
✅ 테스트: 통과
✅ 보안: 취약점 0개
✅ 접근성: 통과

📁 생성된 파일: [목록]

🚀 실행: npm run dev
═══════════════════════════════════════
```

---

**Claude Code는 이 설정을 자동으로 읽고 적용합니다.**

**🔥 핵심:**
- `@fullstack [앱]` → 완전한 앱 생성
- `@autofix` → 에러 0개까지 자동 수정
- `@game-init [유형]` → 게임 프로젝트 생성
- `@app-init [유형]` → 앱 프로젝트 생성

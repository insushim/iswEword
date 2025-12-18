# CLAUDE.md - 완전 자동화 개발 최종판 v7.0

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

# 🔧 자동 수정/검증 시스템 (핵심!)

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

결과:
  - 모든 에러 0개
  - 빌드 성공
  - 실행 가능한 상태
```

## @validate - 전체 코드 검증 ⭐⭐⭐
```yaml
역할: 프로젝트 전체 코드 품질 검증
호출: "@validate"

검증 항목:
  ✅ 타입 안전성 (TypeScript strict)
  ✅ 코드 스타일 (ESLint + Prettier)
  ✅ 보안 취약점 (npm audit)
  ✅ 의존성 버전 (outdated 체크)
  ✅ 빌드 성공 여부
  ✅ 환경변수 검증
  ✅ API 엔드포인트 테스트
  ✅ 데드 코드 탐지
  ✅ 순환 의존성 체크
  ✅ 번들 사이즈 분석

출력:
  📊 검증 보고서
  ├── ✅ 통과 항목
  ├── ⚠️ 경고 항목
  ├── ❌ 실패 항목
  └── 🔧 자동 수정 가능 항목
```

## @healthcheck - 프로젝트 건강 체크 ⭐⭐
```yaml
역할: 프로젝트 전반적인 상태 진단
호출: "@healthcheck"

진단 항목:
  - 코드 품질 점수 (A-F)
  - 테스트 커버리지
  - 보안 점수
  - 성능 점수
  - 의존성 건강도
  - 기술 부채 수준

출력: 종합 건강 보고서 + 개선 권장사항
```

## @fix-all - 모든 문제 일괄 수정 ⭐⭐⭐
```yaml
역할: 발견된 모든 문제를 한번에 수정
호출: "@fix-all"

수정 항목:
  - 타입 에러 자동 수정
  - 린트 에러 자동 수정 (--fix)
  - import 정리
  - 미사용 변수 제거
  - 포맷팅 정리
  - 의존성 업데이트
  - 보안 취약점 패치
```

---

# 🚀 원샷 빌드 (한번에 완성)

## @fullstack - 풀스택 원샷 빌더
```yaml
역할: 프론트 + 백엔드 + DB + 인증을 한번에 완성
호출: "@fullstack [앱 설명]"

예시:
  "@fullstack 회원제 블로그 만들어줘"
  "@fullstack 할일 관리 앱 만들어줘"

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

결과: API 키만 넣으면 즉시 작동
```

## @quickstart - 템플릿 빠른 시작
```yaml
호출: "@quickstart [템플릿]"

템플릿:
  auth        # 인증 시스템
  blog        # 블로그
  dashboard   # 대시보드
  ecommerce   # 쇼핑몰
  chat        # 실시간 채팅
  quiz        # 퀴즈/학습
  game        # 웹 게임
  landing     # 랜딩 페이지
  saas        # SaaS
  portfolio   # 포트폴리오
```

## @clone - 서비스 클론
```yaml
호출: "@clone [서비스명]"
예시: @clone twitter, @clone notion, @clone trello
```

## @feature - 기능 추가
```yaml
호출: "@feature [기능명]"
예시: @feature 댓글, @feature 좋아요, @feature 검색
```

## @page - 페이지 생성
```yaml
호출: "@page [페이지명]"
예시: @page 설정, @page 프로필, @page 대시보드
```

---

# 🔄 유지보수/관리

## @maintain - 유지보수 모드 ⭐⭐
```yaml
역할: 정기적인 유지보수 작업 수행
호출: "@maintain"

수행 작업:
  1. 의존성 업데이트 (보안 패치)
  2. 데드 코드 제거
  3. 미사용 의존성 제거
  4. 코드 포맷팅
  5. 타입 정리
  6. 성능 최적화 제안
  7. 보안 취약점 스캔
```

## @upgrade - 버전 업그레이드 ⭐⭐
```yaml
역할: 패키지/프레임워크 버전 업그레이드
호출: "@upgrade [대상]"

예시:
  @upgrade next          # Next.js 최신 버전
  @upgrade all           # 모든 패키지
  @upgrade react         # React 최신 버전
  @upgrade dependencies  # 의존성 전체

포함:
  - Breaking changes 확인
  - 마이그레이션 코드 수정
  - 호환성 테스트
  - 롤백 가이드
```

## @migrate - 마이그레이션 ⭐⭐
```yaml
역할: DB/코드 마이그레이션
호출: "@migrate [대상]"

예시:
  @migrate pages-to-app    # Pages Router → App Router
  @migrate prisma          # Prisma 마이그레이션
  @migrate supabase        # Supabase 스키마 변경
  @migrate auth            # 인증 시스템 변경
```

## @cleanup - 코드 정리 ⭐
```yaml
역할: 불필요한 코드/파일 정리
호출: "@cleanup"

정리 항목:
  - 미사용 import 제거
  - 미사용 변수/함수 제거
  - 빈 파일 제거
  - console.log 제거
  - 주석 처리된 코드 제거
  - 미사용 의존성 제거
  - .next, node_modules 캐시 정리
```

## @dependency - 의존성 관리 ⭐
```yaml
역할: 패키지 의존성 관리
호출: "@dependency [작업]"

작업:
  @dependency check     # 의존성 상태 확인
  @dependency update    # 안전한 업데이트
  @dependency audit     # 보안 취약점 검사
  @dependency fix       # 취약점 자동 수정
  @dependency clean     # 미사용 패키지 제거
```

## @backup - 백업
```yaml
역할: 코드/데이터 백업
호출: "@backup [대상]"

예시:
  @backup code        # 코드 백업 (git stash)
  @backup database    # DB 백업 스크립트 생성
  @backup env         # 환경변수 백업
```

## @rollback - 롤백
```yaml
역할: 이전 상태로 복원
호출: "@rollback [대상]"

예시:
  @rollback last       # 마지막 변경 취소
  @rollback package    # 패키지 버전 롤백
  @rollback migration  # 마이그레이션 롤백
```

## @hotfix - 긴급 수정 ⭐
```yaml
역할: 프로덕션 긴급 버그 수정
호출: "@hotfix [문제 설명]"

프로세스:
  1. 문제 즉시 분석
  2. 최소 범위 수정
  3. 빌드 테스트
  4. 배포 준비
```

---

# 👥 서브에이전트 전체 (40개)

## 🔧 자동 수정/검증 (7개) - NEW!
| 명령어 | 설명 |
|--------|------|
| `@autofix` | **에러 0개 될 때까지 자동 수정** |
| `@validate` | 전체 코드 품질 검증 |
| `@healthcheck` | 프로젝트 건강 체크 |
| `@fix-all` | 모든 문제 일괄 수정 |
| `@lint-fix` | 린트 에러 자동 수정 |
| `@type-fix` | 타입 에러 자동 수정 |
| `@format` | 코드 포맷팅 |

## 🔄 유지보수/관리 (8개) - NEW!
| 명령어 | 설명 |
|--------|------|
| `@maintain` | 정기 유지보수 |
| `@upgrade [대상]` | 버전 업그레이드 |
| `@migrate [대상]` | 마이그레이션 |
| `@cleanup` | 코드 정리 |
| `@dependency [작업]` | 의존성 관리 |
| `@backup [대상]` | 백업 |
| `@rollback [대상]` | 롤백 |
| `@hotfix [문제]` | 긴급 수정 |

## 🚀 원샷 빌드 (5개)
| 명령어 | 설명 |
|--------|------|
| `@fullstack [앱]` | 풀스택 앱 한번에 생성 |
| `@quickstart [템플릿]` | 템플릿으로 빠른 시작 |
| `@clone [서비스]` | 서비스 클론 |
| `@feature [기능]` | 기능 추가 |
| `@page [페이지]` | 페이지 생성 |

## 🛠️ 개발 (5개)
| 명령어 | 설명 |
|--------|------|
| `@debugger [에러]` | 에러 분석/해결 |
| `@frontend [작업]` | UI 개발 |
| `@backend [작업]` | API 개발 |
| `@database [작업]` | DB 설계/쿼리 |
| `@api-designer [설계]` | API 구조 설계 |

## 📐 설계 (4개)
| 명령어 | 설명 |
|--------|------|
| `@architect [요청]` | 시스템 설계 |
| `@ux-designer [작업]` | UX 설계 |
| `@ui-designer [작업]` | UI 디자인 |
| `@animator [요청]` | 애니메이션 |

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
| `@deploy [작업]` | Vercel 배포 |
| `@devops [작업]` | CI/CD |

## 📝 콘텐츠 (3개)
| 명령어 | 설명 |
|--------|------|
| `@documentation [대상]` | 문서화 |
| `@translator [번역]` | 번역 |
| `@copywriter [요청]` | 문구 작성 |

## 🔍 리서치 (2개)
| 명령어 | 설명 |
|--------|------|
| `@researcher [주제]` | 정보 검색 + 검증 |
| `@fact-checker [내용]` | 팩트체크 |

## 🎮 게임 (1개)
| 명령어 | 설명 |
|--------|------|
| `@game-designer [게임]` | 게임 기획 |

## 📊 분석 (2개)
| 명령어 | 설명 |
|--------|------|
| `@data-analyst [요청]` | 데이터 분석 |
| `@prompt-engineer [요청]` | AI 프롬프트 |

---

# 📚 스킬 전체 (45개)

## 🔧 자동 수정/검증 (7개) - NEW!
| 트리거 | 스킬 |
|--------|------|
| "자동 수정", "에러 고쳐" | auto-repair |
| "검증", "체크해줘" | code-validation |
| "건강 체크", "상태 확인" | project-health |
| "린트 수정" | lint-fix |
| "타입 수정" | type-fix |
| "포맷", "정렬" | code-format |
| "전체 수정" | fix-all |

## 🔄 유지보수 (8개) - NEW!
| 트리거 | 스킬 |
|--------|------|
| "유지보수", "관리" | maintenance |
| "업그레이드", "버전 올려" | version-upgrade |
| "마이그레이션" | migration |
| "정리", "클린업" | cleanup |
| "의존성", "패키지 관리" | dependency-management |
| "백업" | backup |
| "롤백", "되돌려" | rollback |
| "긴급 수정", "핫픽스" | hotfix |

## 🚀 핵심 (5개)
| 트리거 | 스킬 |
|--------|------|
| "풀스택", "전체 만들어줘" | fullstack-generator |
| "로그인", "회원가입" | auth-system |
| "CRUD", "게시판" | crud-generator |
| "웹앱", "Next.js" | nextjs-webapp |
| "API 연결", "Gemini" | api-integrator |

## 💾 데이터베이스 (3개)
| 트리거 | 스킬 |
|--------|------|
| "DB 설계", "스키마" | database-design |
| "DB 최적화", "쿼리" | database-optimizer |
| "실시간", "채팅" | realtime |

## 🎨 프론트엔드 (4개)
| 트리거 | 스킬 |
|--------|------|
| "폼", "유효성 검사" | form-handling |
| "상태 관리", "Zustand" | state-management |
| "애니메이션" | animation |
| "차트", "그래프" | charts |

## 📱 앱/게임 (5개)
| 트리거 | 스킬 |
|--------|------|
| "PWA", "오프라인" | pwa-app |
| "모바일 앱", "Expo" | mobile-app |
| "유니티", "Unity" | unity-game |
| "웹 게임", "Phaser" | web-game |
| "레벨 시스템" | game-mechanics |

## ⚙️ 기능 (5개)
| 트리거 | 스킬 |
|--------|------|
| "파일 업로드" | file-upload |
| "결제", "Stripe" | payment |
| "이메일 발송" | email |
| "지도" | map |
| "다국어" | i18n |

## ✅ 품질 (6개)
| 트리거 | 스킬 |
|--------|------|
| "에러", "오류" | error-debugger |
| "테스트" | testing |
| "SEO" | seo-optimization |
| "접근성" | accessibility |
| "성능 분석" | performance-audit |
| "모니터링" | monitoring |

## 🚀 배포 (1개)
| 트리거 | 스킬 |
|--------|------|
| "배포", "Vercel" | vercel-deploy |

## 🔍 리서치 (2개)
| 트리거 | 스킬 |
|--------|------|
| "자료 검색" | research-verification |
| "버전 호환" | version-compatibility |

---

# 🔍 정보 검증 규칙

```yaml
교차검증 필수:
  - 최소 2-3개 공신력 있는 출처 확인
  - 불확실하면 "확인 필요" 명시

할루시네이션 방지:
  - 존재하지 않는 API 사용 금지
  - 실제 테스트된 코드만 제공
```

---

# 🎨 UI/UX 규칙

```yaml
디자인:
  - 글래스모피즘 (backdrop-blur)
  - Framer Motion 애니메이션
  - 다크모드 지원

컴포넌트:
  - 스켈레톤 로딩
  - 토스트 알림
  - 로딩/에러/빈 상태
```

---

# 💰 비용 최적화

```yaml
Supabase: 로컬 캐시, 구독 최소화
AI API: 디바운스, 캐싱, 저렴한 모델 우선
```

---

# ⚖️ 저작권 안전

```yaml
폰트: Pretendard, Noto Sans KR, Inter (OFL)
아이콘: Lucide React, Heroicons (MIT)
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

## 프로젝트 생성 시
```
1. @fullstack [앱 설명]
2. 자동으로 @autofix 실행
3. 에러 0개 확인
4. 완료 보고서 출력
```

## 코드 수정 후
```
1. 코드 수정
2. @autofix 또는 @validate
3. 에러 0개 될 때까지 반복
4. 완료
```

## 정기 유지보수
```
1. @healthcheck (상태 확인)
2. @maintain (유지보수)
3. @dependency update (업데이트)
4. @autofix (검증)
```

---

# ⚡ 퀵 레퍼런스

## 🔥 가장 중요한 명령어
```
@fullstack [앱 설명]    # 완전한 앱 한번에 + 자동 검증
@autofix                # 에러 0개 될 때까지 자동 수정
@validate               # 전체 검증
```

## 원샷 빌드
```
@fullstack [앱]    @quickstart [템플릿]
@clone [서비스]    @feature [기능]    @page [페이지]
```

## 자동 수정/검증
```
@autofix       @validate      @healthcheck
@fix-all       @lint-fix      @type-fix
```

## 유지보수
```
@maintain      @upgrade       @migrate
@cleanup       @dependency    @hotfix
```

## 개발
```
@debugger      @frontend      @backend
@database      @api-designer
```

## 품질
```
@reviewer      @tester        @security
@optimizer     @refactorer    @accessibility
```

## 배포
```
@deploy        @devops
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

📁 생성된 파일:
- [파일 목록]

🔑 필요한 환경변수:
- .env.example 참조

🚀 실행 방법:
1. cp .env.example .env.local
2. .env.local에 API 키 입력
3. npm install
4. npm run dev
═══════════════════════════════════════
```

---

**Claude Code는 이 설정을 자동으로 읽고 적용합니다.**

**🔥 핵심:**
- `@fullstack [앱]` → 완전한 앱 생성
- `@autofix` → 에러 0개 될 때까지 자동 수정

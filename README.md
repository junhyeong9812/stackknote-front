# StackNote Frontend

노션 스타일의 협업 노트 애플리케이션 프론트엔드

## 🚀 기술 스택

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Radix UI + Custom Components
- **Editor**: BlockNote 0.17.0 / TipTap 2.2.4
- **State Management**: Zustand 4.5.0
- **Data Fetching**: TanStack Query 5.59.0
- **Form Handling**: React Hook Form 7.53.0
- **Real-time**: Yjs + y-websocket
- **Package Manager**: npm

## 📁 프로젝트 구조

```
stacknote-front/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # 인증 관련 페이지
│   │   ├── login/
│   │   ├── register/
│   │   └── guest/
│   ├── (main)/                  # 메인 애플리케이션
│   │   ├── dashboard/           # 대시보드 (공개 피드)
│   │   │   └── page.tsx
│   │   ├── workspace/           # 워크스페이스
│   │   │   └── [workspaceId]/
│   │   │       ├── page/
│   │   │       │   └── [pageId]/
│   │   │       ├── settings/
│   │   │       │   └── page.tsx
│   │   │       └── members/
│   │   │           └── page.tsx
│   │   └── public/              # 공개 페이지 (게스트용)
│   │       └── [username]/
│   │           └── [pageId]/
│   │               └── page.tsx
│   ├── api/                     # API 라우트
│   │   ├── upload/
│   │   ├── auth/
│   │   └── pages/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # 재사용 컴포넌트
│   ├── auth/                    # 인증 관련 컴포넌트
│   │   ├── guest-login.tsx
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── editor/                  # 에디터 관련 컴포넌트
│   │   ├── advanced-blocknote-editor.tsx
│   │   └── blocknote-editor.tsx
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── breadcrumb.tsx
│   │   ├── header.tsx
│   │   ├── main-layout.tsx
│   │   ├── main-sidebar.tsx
│   │   └── top-navigation.tsx
│   └── ui/                      # 기본 UI 컴포넌트 (Radix + Tailwind)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── index.ts
│       ├── input.tsx
│       ├── pagination.tsx       # 페이지네이션 컴포넌트
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── table.tsx            # 테이블 컴포넌트
│       ├── tabs.tsx
│       ├── toast.tsx
│       └── tooltip.tsx
├── lib/                         # 유틸리티 & 설정
│   ├── api/                     # API 클라이언트
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── comments.ts
│   │   ├── env.ts
│   │   ├── file.ts
│   │   ├── index.ts
│   │   ├── notification.ts
│   │   ├── page.ts
│   │   ├── tag.ts
│   │   └── workspace.ts
│   ├── config/                  # 설정 파일
│   │   ├── api-config.ts
│   │   ├── auth-config.ts
│   │   ├── editor-config.ts
│   │   └── env.ts
│   ├── hooks/                   # 커스텀 훅
│   │   ├── index.ts
│   │   ├── use-auth.ts
│   │   ├── use-drag-drop.ts
│   │   ├── use-editor.ts
│   │   └── use-file-upload.ts
│   ├── stores/                  # Zustand 스토어
│   │   ├── auth-store.ts
│   │   ├── index.ts
│   │   ├── page-store.ts
│   │   ├── ui-store.ts
│   │   └── workspace-store.ts
│   └── utils/                   # 헬퍼 함수
│       ├── cn.ts
│       ├── index.ts
│       └── theme.ts
├── public/                      # 정적 파일
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── types/                       # TypeScript 타입 정의
│   ├── api.ts
│   ├── auth.ts
│   ├── comment.ts
│   ├── file.ts
│   ├── index.ts
│   ├── notification.ts
│   ├── page.ts
│   ├── select.ts                # Select 컴포넌트 타입
│   ├── table.ts                 # Table 컴포넌트 타입
│   ├── tag.ts
│   ├── user.ts
│   └── workspace.ts
├── .env                         # 환경 변수 (기본)
├── .env.example                 # 환경 변수 예시
├── .env.local                   # 로컬 환경 변수
├── .gitignore                   # Git 무시 파일
├── .prettierrc                  # Prettier 설정
├── eslint.config.mjs            # ESLint 설정
├── next-env.d.ts                # Next.js 타입 정의
├── next.config.ts               # Next.js 설정
├── package-lock.json            # 의존성 잠금 파일
├── package.json                 # 프로젝트 의존성 및 스크립트
├── postcss.config.mjs           # PostCSS 설정
├── README.md                    # 프로젝트 문서
├── tailwind.config.ts           # Tailwind CSS 설정
└── tsconfig.json                # TypeScript 설정
```

## 📦 주요 의존성 (package.json)

### 핵심 프레임워크
- `next`: 15.3.3
- `react`: 19.0.0
- `react-dom`: 19.0.0

### 에디터
- `@blocknote/core`: 0.17.0
- `@blocknote/mantine`: 0.17.0
- `@blocknote/react`: 0.17.0
- `@tiptap/react`: 2.2.4 (+ 다양한 extension들)

### UI 라이브러리
- `@radix-ui/*`: 다양한 UI 컴포넌트들
- `lucide-react`: 0.460.0 (아이콘)
- `framer-motion`: 11.0.0 (애니메이션)
- `react-hot-toast`: 2.4.1 (토스트 알림)

### 상태 관리 & 데이터 페칭
- `zustand`: 4.5.0
- `@tanstack/react-query`: 5.59.0
- `axios`: 1.7.0

### 폼 & 유효성 검사
- `react-hook-form`: 7.53.0
- `@hookform/resolvers`: 3.9.0
- `zod`: 3.23.0

### 테이블 & 리스트
- `@tanstack/react-table`: 8.20.6 (추가됨)
- `react-window`: 1.8.8
- `react-virtualized-auto-sizer`: 1.0.24

### 실시간 협업
- `yjs`: 13.6.18
- `y-websocket`: 1.5.4

### 유틸리티
- `lodash`: 4.17.21
- `date-fns`: 3.6.0
- `uuid`: 10.0.0
- `clsx`: 2.1.0
- `tailwind-merge`: 2.3.0

## ⚙️ 설정 파일

### Next.js 설정 (next.config.ts)
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',        // Docker 빌드용
  basePath: '/stacknote',      // 기본 경로
  assetPrefix: '/stacknote',   // 정적 자산 경로
  images: {
    unoptimized: true          // 이미지 최적화 비활성화
  },
  eslint: {
    ignoreDuringBuilds: true   // 빌드 시 ESLint 무시
  }
};
```

### TypeScript 설정 (tsconfig.json)
- `strict`: true (엄격 모드 활성화)
- Path aliases 설정:
  - `@/*`: 루트 경로
  - `@/components/*`, `@/lib/*`, `@/types/*` 등
- 추가 컴파일러 옵션:
  - `noUncheckedIndexedAccess`: true
  - `noImplicitReturns`: true
  - `noImplicitOverride`: true

### Tailwind CSS 설정 (tailwind.config.ts)
- 다크모드: `class` 기반
- CSS 변수 기반 색상 시스템
- 커스텀 색상 팔레트:
  - Primary, Secondary, Accent
  - Gray 스케일 (25-950)
  - Success, Warning, Error
- 커스텀 폰트:
  - Sans: Inter
  - Mono: JetBrains Mono
- 애니메이션:
  - fade-in, slide-in, bounce-gentle

### ESLint 설정 (eslint.config.mjs)
주요 규칙:
- TypeScript 엄격 모드
- React Hooks 규칙 적용
- Import 순서 자동 정렬
- 접근성 규칙 경고
- 프로덕션 환경에서 console 경고

## 🚀 시작하기

### 개발 환경 실행
```bash
npm install
npm run dev
```

### 빌드
```bash
npm run build
npm run start
```

### 타입 체크
```bash
npm run type-check
```

### 린트 검사
```bash
npm run lint
```

## 🔧 환경 변수

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:
```env
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# 기타 필요한 환경 변수들...
```

## 📝 개발 현황

### ✅ 완료된 기능
- 기본 UI 컴포넌트 시스템 (Radix + Tailwind)
- TypeScript 타입 정의
- API 클라이언트 구조
- 상태 관리 스토어 구조
- 에디터 기본 컴포넌트
- 인증 관련 컴포넌트
- 대시보드 페이지
- 워크스페이스 설정 페이지
- 워크스페이스 멤버 관리 페이지
- 공개 페이지 뷰어
- 테이블 & 페이지네이션 컴포넌트

### 🚧 개발 진행 중
- Create page 기능
- Local page 관리
- Next.js App Router 페이지 구성
- 워크스페이스 관리 시스템
- 실시간 협업 기능
- 파일 업로드 및 미디어 관리

## 🏗️ 아키텍처 특징

- **App Router**: Next.js 13+ 최신 라우팅 시스템 사용
- **타입 안정성**: TypeScript strict 모드로 완전한 타입 안정성 보장
- **컴포넌트 설계**: Atomic Design 원칙에 따른 재사용 가능한 컴포넌트
- **상태 관리**: Zustand를 통한 간단하고 효율적인 전역 상태 관리
- **스타일링**: Tailwind CSS + CSS 변수로 다크모드 지원
- **성능 최적화**: React Query를 통한 서버 상태 캐싱 및 최적화
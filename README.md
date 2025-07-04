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
│   │   ├── workspace/           # 워크스페이스
│   │   │   └── [workspaceId]/
│   │   │       ├── page/
│   │   │       │   └── [pageId]/
│   │   │       ├── settings/
│   │   │       └── members/
│   │   └── public/              # 공개 페이지 (게스트용)
│   │       └── [username]/
│   │           └── [pageId]/
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
│   │   └── blocknote-editor.tsx
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── breadcrumb.tsx
│   │   ├── header.tsx
│   │   ├── main-layout.tsx
│   │   └── main-sidebar.tsx
│   └── ui/                      # 기본 UI 컴포넌트 (Radix + Tailwind)
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── index.ts
│       ├── input.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── switch.tsx
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
├── types/                       # TypeScript 타입 정의
│   ├── api.ts
│   ├── auth.ts
│   ├── comment.ts
│   ├── file.ts
│   ├── index.ts
│   ├── notification.ts
│   ├── page.ts
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

### 주요 디렉토리 설명

#### `components/`

- **`auth/`**: 로그인, 회원가입, 게스트 로그인 관련 컴포넌트
- **`editor/`**: BlockNote 기반 노션 스타일 에디터 컴포넌트
- **`layout/`**: 애플리케이션 레이아웃 (헤더, 사이드바, 브레드크럼 등)
- **`ui/`**: 재사용 가능한 기본 UI 컴포넌트 (Radix UI + Tailwind CSS)

#### `lib/`

- **`api/`**: 백엔드 API와의 통신을 담당하는 클라이언트 함수들
- **`config/`**: 애플리케이션 설정 (API, 인증, 에디터 등)
- **`hooks/`**: 재사용 가능한 React 커스텀 훅
- **`stores/`**: Zustand 기반 전역 상태 관리 스토어
- **`utils/`**: 유틸리티 함수 및 헬퍼

#### `types/`

- 애플리케이션 전반에서 사용되는 TypeScript 타입 정의
- API 응답, 데이터 모델, 컴포넌트 props 등의 타입

### 구현 현황

✅ **완료된 부분**:

- 기본 UI 컴포넌트 시스템 (Radix + Tailwind)
- TypeScript 타입 정의
- API 클라이언트 구조
- 상태 관리 스토어 구조
- 에디터 기본 컴포넌트
- 인증 관련 컴포넌트

🚧 **개발 진행 중**:
create page
local page

- Next.js App Router 페이지 구성
- 워크스페이스 관리 시스템
- 실시간 협업 기능
- 파일 업로드 및 미디어 관리

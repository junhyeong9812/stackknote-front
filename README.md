# StackNote Frontend

> 🚀 **Notion-style Document Management System - Frontend**

노션 스타일의 문서 관리 시스템 프론트엔드입니다. React + Next.js를 기반으로 구축된 현대적인 웹 애플리케이션입니다.

## 📋 목차

- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)

## 🛠️ 기술 스택

### Core

- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 CSS 프레임워크

### State Management & Data Fetching

- **Zustand** - 경량 상태 관리
- **TanStack Query** - 서버 상태 관리 및 캐싱

### UI & Components

- **Lucide React** - 아이콘 라이브러리
- **React Hook Form** - 폼 관리
- **Zod** - 스키마 검증

### Development

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅

## ✨ 주요 기능

### 📝 문서 관리

- **실시간 마크다운 에디터** - 노션 스타일의 블록 에디터
- **계층형 페이지 구조** - 워크스페이스 > 페이지 계층 관리
- **실시간 협업** - 여러 사용자 동시 편집
- **버전 히스토리** - 문서 변경 이력 추적

### 🏢 워크스페이스

- **다중 워크스페이스** - 프로젝트별 공간 분리
- **멤버 관리** - 사용자 초대 및 권한 설정
- **권한 시스템** - 읽기/쓰기/관리자 권한

### 🔍 검색 & 필터

- **전문 검색** - 제목, 내용 통합 검색
- **태그 기반 필터링** - 카테고리별 문서 분류
- **최근 문서** - 사용자별 접근 이력

### 📁 파일 관리

- **이미지 업로드** - 드래그 앤 드롭 지원
- **파일 첨부** - 다양한 파일 형식 지원
- **미디어 갤러리** - 업로드된 파일 관리

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.17 이상
- **npm** 또는 **yarn**

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd stacknote-front

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 파일 업로드 제한 (MB)
NEXT_PUBLIC_MAX_FILE_SIZE=10

# 애플리케이션 환경
NEXT_PUBLIC_APP_ENV=development
```

## 📁 프로젝트 구조

```
stacknote-front/
├── app/                        # Next.js App Router
│   ├── (auth)/                # 인증 페이지 그룹
│   │   ├── login/
│   │   └── register/
│   ├── (app)/                 # 메인 애플리케이션
│   │   ├── dashboard/
│   │   └── workspace/
│   │       └── [workspaceId]/
│   │           ├── page/
│   │           │   └── [pageId]/
│   │           └── settings/
│   ├── layout.tsx             # 루트 레이아웃
│   └── page.tsx               # 홈페이지
├── components/                 # 재사용 가능한 컴포넌트
│   ├── ui/                    # 기본 UI 컴포넌트
│   ├── editor/                # 마크다운 에디터 관련
│   ├── workspace/             # 워크스페이스 관련
│   └── common/                # 공통 컴포넌트
├── lib/                       # 유틸리티 및 설정
│   ├── api/                   # API 클라이언트
│   ├── stores/                # Zustand 스토어
│   ├── hooks/                 # 커스텀 훅
│   └── utils/                 # 헬퍼 함수
├── types/                     # TypeScript 타입 정의
└── public/                    # 정적 파일
```

## 🔧 개발 가이드

### 코드 스타일

```bash
# 린트 검사
npm run lint

# 타입 검사
npm run type-check

# 빌드 테스트
npm run build
```

### 컴포넌트 작성 규칙

1. **함수형 컴포넌트** 사용
2. **TypeScript 타입** 명시
3. **Props 인터페이스** 정의
4. **커스텀 훅** 활용

```typescript
interface PageEditorProps {
  pageId: string;
  initialContent?: string;
  onSave: (content: string) => void;
}

export function PageEditor({
  pageId,
  initialContent,
  onSave,
}: PageEditorProps) {
  // 컴포넌트 로직
}
```

### API 통신

TanStack Query를 사용한 서버 상태 관리:

```typescript
// hooks/usePages.ts
export function usePages(workspaceId: string) {
  return useQuery({
    queryKey: ["pages", workspaceId],
    queryFn: () => api.pages.list(workspaceId),
  });
}
```

### 상태 관리

Zustand를 사용한 클라이언트 상태 관리:

```typescript
// stores/authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## 🚢 배포

### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정
vercel env add NEXT_PUBLIC_API_URL
```

### Docker 배포

```bash
# Docker 이미지 빌드
docker build -t stacknote-frontend .

# 컨테이너 실행
docker run -p 3000:3000 stacknote-frontend
```

## 📚 주요 의존성

| 패키지          | 버전     | 용도             |
| --------------- | -------- | ---------------- |
| Next.js         | ^14.0.0  | React 프레임워크 |
| TypeScript      | ^5.0.0   | 타입 시스템      |
| Tailwind CSS    | ^3.0.0   | CSS 프레임워크   |
| Zustand         | ^4.4.0   | 상태 관리        |
| TanStack Query  | ^5.0.0   | 서버 상태 관리   |
| React Hook Form | ^7.45.0  | 폼 관리          |
| Lucide React    | ^0.263.1 | 아이콘           |

## 🔗 관련 링크

- **백엔드 저장소**: [StackNote Backend](../stacknote-back)
- **API 문서**: http://localhost:8080/api/swagger-ui.html
- **Next.js 문서**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

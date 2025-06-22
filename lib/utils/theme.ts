/**
 * 테마 관리 유틸리티
 * 다크모드/라이트모드 전환 및 로컬 스토리지 관리
 */

export type Theme = "light" | "dark" | "system";

const THEME_KEY = "stacknote-theme";

/**
 * 시스템 다크모드 선호도 확인
 */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * 저장된 테마 가져오기
 */
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";

  try {
    return (localStorage.getItem(THEME_KEY) as Theme) || "system";
  } catch {
    return "system";
  }
}

/**
 * 테마 저장하기
 */
export function setStoredTheme(theme: Theme): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage 접근 불가시 무시
  }
}

/**
 * 실제 적용될 테마 계산 (system일 경우 시스템 설정 사용)
 */
export function getResolvedTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

/**
 * 문서에 다크모드 클래스 적용/제거
 */
export function applyTheme(theme: "light" | "dark"): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * 테마 변경 (저장 + 적용)
 */
export function setTheme(theme: Theme): void {
  setStoredTheme(theme);
  const resolvedTheme = getResolvedTheme(theme);
  applyTheme(resolvedTheme);
}

/**
 * 다크모드 토글
 */
export function toggleTheme(): Theme {
  const currentTheme = getStoredTheme();
  const resolvedTheme = getResolvedTheme(currentTheme);

  // light <-> dark 토글
  const newTheme: Theme = resolvedTheme === "light" ? "dark" : "light";
  setTheme(newTheme);

  return newTheme;
}

/**
 * 시스템 테마 변경 감지 리스너 등록
 */
export function watchSystemTheme(
  callback: (theme: "light" | "dark") => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handler);

  // cleanup 함수 반환
  return () => mediaQuery.removeEventListener("change", handler);
}

/**
 * 초기 테마 설정 (SSR 대응)
 * HTML head에 삽입할 스크립트용
 */
export function getInitialThemeScript(): string {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('${THEME_KEY}') || 'system';
        var isDark = theme === 'dark' || 
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // localStorage 접근 불가시 기본값 사용
      }
    })();
  `;
}

/**
 * 테마 상태 확인
 */
export function getCurrentTheme(): {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  isDark: boolean;
} {
  const theme = getStoredTheme();
  const resolvedTheme = getResolvedTheme(theme);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
  };
}

/**
 * 클래스명 병합 유틸리티
 * Tailwind CSS 클래스를 조건부로 병합
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스명을 조건부로 병합하고 중복 제거
 *
 * @param inputs - 클래스명, 조건부 객체, 배열 등
 * @returns 병합된 클래스명 문자열
 *
 * @example
 * cn('px-2 py-1', 'bg-blue-500', { 'text-white': true })
 * // → 'px-2 py-1 bg-blue-500 text-white'
 *
 * cn('bg-red-500', 'bg-blue-500')
 * // → 'bg-blue-500' (마지막 것이 우선)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

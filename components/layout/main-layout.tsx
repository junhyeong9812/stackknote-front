// components/layout/main-layout.tsx
'use client';

import React from 'react';
import { MainSidebar } from './main-sidebar';
import { Header } from './header';
import { Breadcrumb } from './breadcrumb';
import { useSidebar, useMobile } from '@/lib/stores';
import { cn } from '@/lib/utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  showBreadcrumb = true,
  className,
}: MainLayoutProps) {
  const { collapsed, width } = useSidebar();
  const { isMobile } = useMobile();

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-950'>
      {/* 사이드바 */}
      {!isMobile && <MainSidebar />}

      {/* 메인 컨텐츠 영역 */}
      <div
        className='flex flex-1 flex-col overflow-hidden'
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 64 : width,
        }}
      >
        {/* 헤더 */}
        <Header />

        {/* 브레드크럼 */}
        {showBreadcrumb && (
          <div className='border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900'>
            <Breadcrumb />
          </div>
        )}

        {/* 메인 컨텐츠 */}
        <main className={cn('flex-1 overflow-auto', className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

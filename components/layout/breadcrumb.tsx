// components/layout/breadcrumb.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCurrentWorkspace, useCurrentPage } from '@/lib/stores';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  className?: string;
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ className, items }: BreadcrumbProps) {
  const currentWorkspace = useCurrentWorkspace();
  const currentPage = useCurrentPage();

  // 자동으로 breadcrumb 생성
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const breadcrumbs: BreadcrumbItem[] = [
      { label: '홈', href: '/dashboard', icon: Home },
    ];

    if (currentWorkspace) {
      breadcrumbs.push({
        label: currentWorkspace.name,
        href: `/workspace/${currentWorkspace.id}`,
      });
    }

    if (currentPage) {
      // 부모 페이지들 추가 (실제로는 API에서 가져와야 함)
      breadcrumbs.push({
        label: currentPage.title,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      className={cn(
        'flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400',
        className
      )}
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className='h-4 w-4 text-gray-400' />}

          {item.href ? (
            <Link
              href={item.href}
              className='flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-gray-100'
            >
              {item.icon && <item.icon className='h-4 w-4' />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className='flex items-center gap-1 font-medium text-gray-900 dark:text-gray-100'>
              {item.icon && <item.icon className='h-4 w-4' />}
              <span>{item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

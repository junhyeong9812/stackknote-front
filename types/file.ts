/**
 * 파일 관련 타입 정의
 */

import { UserResponse } from './user';

// 파일 타입 열거형
export type FileType =
  | 'IMAGE'
  | 'DOCUMENT'
  | 'VIDEO'
  | 'AUDIO'
  | 'ARCHIVE'
  | 'OTHER';

// 파일 업로드 요청
export interface FileUploadRequest {
  pageId?: number; // 연결할 페이지 ID (null이면 워크스페이스 전체 파일)
  description?: string;
  isPublic?: boolean; // 공개 파일 여부
}

// 파일 정보 수정 요청
export interface FileUpdateRequest {
  description?: string;
  isPublic?: boolean;
  pageId?: number; // 연결할 페이지 ID 변경
}

// 파일 상세 응답
export interface FileResponse {
  id: number;
  originalName: string;
  storedName: string;
  fileUrl: string; // 다운로드/접근 URL
  fileSize: number; // 바이트 단위
  formattedFileSize: string; // "1.5 MB" 형태
  mimeType: string;
  fileType: FileType;
  checksum: string; // 파일 무결성 검증용
  workspaceId: number;
  workspaceName: string;
  pageId?: number;
  pageTitle?: string;
  uploadedBy: UserResponse;
  downloadCount: number;
  isPublic: boolean;
  description?: string;

  // 이미지/비디오 전용 필드
  imageWidth?: number;
  imageHeight?: number;
  thumbnailUrl?: string; // 썸네일 URL
  previewUrl?: string; // 미리보기 URL
  hasThumbnail: boolean;
  isPreviewable: boolean; // 브라우저에서 미리보기 가능 여부

  // 비디오 전용 필드
  duration?: number; // 초 단위

  // 메타데이터
  metadata?: {
    exif?: Record<string, any>; // 이미지 EXIF 데이터
    dimensions?: { width: number; height: number };
    colorProfile?: string;
    [key: string]: any;
  };

  createdAt: string;
  updatedAt: string;
}

// 파일 업로드 응답 (업로드 완료 직후)
export interface FileUploadResponse {
  id: number;
  originalName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  fileSize: number;
  formattedFileSize: string;
  mimeType: string;
  fileType: FileType;
  isImage: boolean;
  isVideo: boolean;
  isPreviewable: boolean;
  imageWidth?: number;
  imageHeight?: number;
  duration?: number;
}

// 파일 통계 응답
export interface FileStatisticsResponse {
  totalFiles: number;
  totalSize: number; // 바이트 단위
  formattedTotalSize: string; // "1.2 GB" 형태
  fileTypeBreakdown: {
    images: number;
    documents: number;
    videos: number;
    audios: number;
    archives: number;
    others: number;
  };
  publicFiles: number;
  privateFiles: number;
  mostDownloadedFiles: {
    file: FileResponse;
    downloadCount: number;
  }[];
  recentUploads: FileResponse[];
}

// 파일 업로드 진행 상태
export interface FileUploadProgress {
  fileId?: number;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  uploadedBytes: number;
  totalBytes: number;
  remainingTime?: number; // 초 단위
  speed?: number; // bytes/second
}

// 파일 필터 옵션
export interface FileFilters {
  fileType?: FileType;
  isPublic?: boolean;
  pageId?: number;
  uploadedBy?: number;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  minSize?: number; // 바이트 단위
  maxSize?: number; // 바이트 단위
  sortBy?: 'name' | 'size' | 'createdAt' | 'downloadCount';
  sortDirection?: 'asc' | 'desc';
}

// 이미지 리사이즈 옵션
export interface ImageResizeOptions {
  width?: number;
  height?: number;
  quality?: number; // 0-100
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

// 파일 공유 설정
export interface FileShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  allowPreview: boolean;
  expiresAt?: string;
  password?: string;
}

// 파일 사용 정보
export interface FileUsage {
  fileId: number;
  usedInPages: {
    pageId: number;
    pageTitle: string;
    usageType: 'content' | 'cover' | 'attachment';
    position?: number; // 콘텐츠 내 위치
  }[];
  totalUsages: number;
}

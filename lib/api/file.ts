/**
 * 파일 관련 API 서비스
 */

import { api, apiClient } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  FileUploadRequest,
  FileUpdateRequest,
  FileResponse,
  FileUploadResponse,
  FileStatisticsResponse,
  FileType,
  PaginationParams,
  ApiResponse,
} from '@/types';

export class FileApiService {
  // === 파일 업로드 및 관리 ===

  /**
   * 파일 업로드
   */
  async uploadFile(
    workspaceId: number,
    file: File,
    request?: FileUploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<FileUploadResponse>> {
    return apiClient.uploadFile<FileUploadResponse>(
      API_ENDPOINTS.FILES.UPLOAD(workspaceId),
      file,
      request,
      onProgress
    );
  }

  /**
   * 파일 정보 수정
   */
  async updateFile(
    fileId: number,
    request: FileUpdateRequest
  ): Promise<ApiResponse<FileResponse>> {
    return api.put<FileResponse>(
      API_ENDPOINTS.FILES.GLOBAL_BY_ID(fileId),
      request
    );
  }

  /**
   * 파일 삭제
   */
  async deleteFile(fileId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.FILES.GLOBAL_BY_ID(fileId));
  }

  /**
   * 파일 공개 상태 토글
   */
  async toggleFileVisibility(
    fileId: number
  ): Promise<ApiResponse<FileResponse>> {
    return api.post<FileResponse>(
      API_ENDPOINTS.FILES.TOGGLE_VISIBILITY(fileId)
    );
  }

  /**
   * 파일 페이지 연결 해제
   */
  async detachFileFromPage(fileId: number): Promise<ApiResponse<FileResponse>> {
    return api.post<FileResponse>(API_ENDPOINTS.FILES.DETACH(fileId));
  }

  // === 파일 조회 ===

  /**
   * 파일 상세 조회
   */
  async getFile(fileId: number): Promise<ApiResponse<FileResponse>> {
    return api.get<FileResponse>(API_ENDPOINTS.FILES.GLOBAL_BY_ID(fileId));
  }

  /**
   * 워크스페이스 파일 목록 조회
   */
  async getWorkspaceFiles(
    workspaceId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(
      API_ENDPOINTS.FILES.BY_WORKSPACE(workspaceId),
      { params }
    );
  }

  /**
   * 페이지 파일 목록 조회
   */
  async getPageFiles(
    workspaceId: number,
    pageId: number
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(
      API_ENDPOINTS.FILES.BY_PAGE(workspaceId, pageId)
    );
  }

  /**
   * 연결되지 않은 파일들 조회
   */
  async getUnattachedFiles(
    workspaceId: number
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(API_ENDPOINTS.FILES.UNATTACHED(workspaceId));
  }

  /**
   * 파일 타입별 조회
   */
  async getFilesByType(
    workspaceId: number,
    fileType: FileType
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(
      API_ENDPOINTS.FILES.BY_TYPE(workspaceId, fileType)
    );
  }

  /**
   * 이미지 파일들만 조회
   */
  async getImageFiles(
    workspaceId: number
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(API_ENDPOINTS.FILES.IMAGES(workspaceId));
  }

  /**
   * 파일 검색
   */
  async searchFiles(
    workspaceId: number,
    keyword: string
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(API_ENDPOINTS.FILES.SEARCH(workspaceId), {
      params: { keyword },
    });
  }

  /**
   * 최근 업로드된 파일들 조회
   */
  async getRecentFiles(
    workspaceId: number,
    days: number = 7,
    limit: number = 10
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(API_ENDPOINTS.FILES.RECENT(workspaceId), {
      params: { days, limit },
    });
  }

  /**
   * 인기 파일들 조회
   */
  async getPopularFiles(
    workspaceId: number,
    limit: number = 10
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(API_ENDPOINTS.FILES.POPULAR(workspaceId), {
      params: { limit },
    });
  }

  /**
   * 내가 업로드한 파일들 조회
   */
  async getMyUploadedFiles(
    limit: number = 20
  ): Promise<ApiResponse<FileResponse[]>> {
    return api.get<FileResponse[]>(API_ENDPOINTS.FILES.MY_UPLOADS, {
      params: { limit },
    });
  }

  // === 파일 통계 ===

  /**
   * 워크스페이스 파일 통계 조회
   */
  async getFileStatistics(
    workspaceId: number
  ): Promise<ApiResponse<FileStatisticsResponse>> {
    return api.get<FileStatisticsResponse>(
      API_ENDPOINTS.FILES.STATISTICS(workspaceId)
    );
  }

  // === 파일 다운로드 및 미리보기 ===

  /**
   * 파일 다운로드
   */
  async downloadFile(fileId: number, filename?: string): Promise<void> {
    return apiClient.downloadFile(
      API_ENDPOINTS.FILES.DOWNLOAD(fileId),
      filename
    );
  }

  /**
   * 공개 파일 다운로드
   */
  async downloadPublicFile(
    fileId: number,
    download: boolean = true
  ): Promise<void> {
    const url = `${API_ENDPOINTS.FILES.PUBLIC(fileId)}?download=${download}`;
    return apiClient.downloadFile(url);
  }

  /**
   * 파일 미리보기 URL 생성
   */
  getPreviewUrl(fileId: number): string {
    return `${apiClient.getRawInstance().defaults.baseURL}${API_ENDPOINTS.FILES.PREVIEW(fileId)}`;
  }

  /**
   * 파일 썸네일 URL 생성
   */
  getThumbnailUrl(fileId: number): string {
    return `${apiClient.getRawInstance().defaults.baseURL}${API_ENDPOINTS.FILES.THUMBNAIL(fileId)}`;
  }

  /**
   * 공개 파일 URL 생성
   */
  getPublicFileUrl(fileId: number): string {
    return `${apiClient.getRawInstance().defaults.baseURL}${API_ENDPOINTS.FILES.PUBLIC(fileId)}`;
  }

  // === 파일 유틸리티 ===

  /**
   * 파일 크기 포맷팅
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 파일 타입 확인
   */
  getFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType.includes('text')
    ) {
      return 'DOCUMENT';
    }
    if (
      mimeType.includes('zip') ||
      mimeType.includes('tar') ||
      mimeType.includes('rar')
    ) {
      return 'ARCHIVE';
    }
    return 'OTHER';
  }

  /**
   * 이미지 파일 여부 확인
   */
  isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * 미리보기 가능 파일 여부 확인
   */
  isPreviewableFile(mimeType: string): boolean {
    const previewableMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'video/mp4',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
    ];

    return previewableMimeTypes.some(type => mimeType.includes(type));
  }
}

// 싱글톤 인스턴스 생성
export const fileApi = new FileApiService();

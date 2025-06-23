/**
 * 파일 업로드 관련 커스텀 훅
 */

import { useCallback, useState, useRef } from 'react';
import { fileApi } from '@/lib/api';
import {
  isAllowedFileType,
  isAllowedImageType,
  isValidFileSize,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/config/env';
import { FileUploadProgress, FileResponse, FileUploadResponse } from '@/types';

interface UploadOptions {
  workspaceId: number;
  pageId?: number;
  description?: string;
  isPublic?: boolean;
  onProgress?: (progress: number) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  uploadedFiles: FileUploadResponse[]; // 업로드 직후에는 FileUploadResponse를 사용
  errors: string[];
}

/**
 * 기본 파일 업로드 훅
 */
export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    uploadedFiles: [],
    errors: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // 파일 유효성 검사
  const validateFile = useCallback((file: File): string | null => {
    if (!isValidFileSize(file)) {
      return `파일 크기는 ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB 이하여야 합니다.`;
    }

    if (!isAllowedFileType(file)) {
      return '지원하지 않는 파일 형식입니다.';
    }

    return null;
  }, []);

  // 여러 파일 유효성 검사
  const validateFiles = useCallback(
    (
      files: File[]
    ): { valid: File[]; invalid: Array<{ file: File; error: string }> } => {
      const valid: File[] = [];
      const invalid: Array<{ file: File; error: string }> = [];

      files.forEach(file => {
        const error = validateFile(file);
        if (error) {
          invalid.push({ file, error });
        } else {
          valid.push(file);
        }
      });

      return { valid, invalid };
    },
    [validateFile]
  );

  // 단일 파일 업로드
  const uploadFile = useCallback(
    async (
      file: File,
      options: UploadOptions
    ): Promise<FileUploadResponse | null> => {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState(prev => ({
          ...prev,
          errors: [...prev.errors, validationError],
        }));
        return null;
      }

      try {
        setUploadState(prev => ({
          ...prev,
          isUploading: true,
          progress: 0,
          errors: [],
        }));

        abortControllerRef.current = new AbortController();

        const response = await fileApi.uploadFile(
          options.workspaceId,
          file,
          {
            pageId: options.pageId,
            description: options.description,
            isPublic: options.isPublic,
          },
          progress => {
            setUploadState(prev => ({ ...prev, progress }));
            options.onProgress?.(progress);
          }
        );

        const uploadedFile = response.data;

        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          progress: 100,
          uploadedFiles: [...prev.uploadedFiles, uploadedFile],
        }));

        return uploadedFile;
      } catch (error: any) {
        setUploadState(prev => ({
          ...prev,
          isUploading: false,
          progress: 0,
          errors: [
            ...prev.errors,
            error.message || '파일 업로드에 실패했습니다.',
          ],
        }));
        return null;
      }
    },
    [validateFile]
  );

  // 여러 파일 업로드
  const uploadFiles = useCallback(
    async (
      files: File[],
      options: UploadOptions
    ): Promise<FileUploadResponse[]> => {
      const { valid, invalid } = validateFiles(files);

      if (invalid.length > 0) {
        setUploadState(prev => ({
          ...prev,
          errors: [
            ...prev.errors,
            ...invalid.map(item => `${item.file.name}: ${item.error}`),
          ],
        }));
      }

      if (valid.length === 0) {
        return [];
      }

      const uploadedFiles: FileUploadResponse[] = [];

      setUploadState(prev => ({
        ...prev,
        isUploading: true,
        errors: [],
      }));

      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        if (!file) continue; // 파일이 undefined인 경우 건너뛰기

        try {
          const uploadedFile = await uploadFile(file, {
            ...options,
            onProgress: progress => {
              const totalProgress = (i * 100 + progress) / valid.length;
              setUploadState(prev => ({ ...prev, progress: totalProgress }));
              options.onProgress?.(totalProgress);
            },
          });

          if (uploadedFile) {
            uploadedFiles.push(uploadedFile);
          }
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        uploadedFiles: [...prev.uploadedFiles, ...uploadedFiles], // 타입 일치
      }));

      return uploadedFiles;
    },
    [validateFiles, uploadFile]
  );

  // 업로드 취소
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: false,
      progress: 0,
    }));
  }, []);

  // 상태 초기화
  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      uploadedFiles: [],
      errors: [],
    });
  }, []);

  // 에러 제거
  const clearErrors = useCallback(() => {
    setUploadState(prev => ({ ...prev, errors: [] }));
  }, []);

  return {
    ...uploadState,
    uploadFile,
    uploadFiles,
    validateFile,
    validateFiles,
    cancelUpload,
    resetUpload,
    clearErrors,
  };
}

/**
 * 드래그 앤 드롭 파일 업로드 훅
 */
export function useDropzoneUpload(options: Omit<UploadOptions, 'onProgress'>) {
  const fileUpload = useFileUpload();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 드래그 이벤트 처리
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await fileUpload.uploadFiles(files, options);
      }
    },
    [fileUpload, options]
  );

  // 파일 선택기 열기
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 선택 처리
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await fileUpload.uploadFiles(files, options);
      }

      // 입력 초기화 (같은 파일 재선택 가능하도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [fileUpload, options]
  );

  return {
    ...fileUpload,
    isDragActive,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    handleFileSelect,
  };
}

/**
 * 이미지 업로드 및 미리보기 훅
 */
export function useImageUpload() {
  const fileUpload = useFileUpload();
  const [previews, setPreviews] = useState<
    Array<{
      file: File;
      preview: string;
      id: string;
    }>
  >([]);

  // 이미지 파일 유효성 검사
  const validateImage = useCallback((file: File): string | null => {
    if (!isAllowedImageType(file)) {
      return '지원하지 않는 이미지 형식입니다.';
    }

    if (!isValidFileSize(file)) {
      return `이미지 크기는 ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB 이하여야 합니다.`;
    }

    return null;
  }, []);

  // 이미지 미리보기 생성
  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  // 이미지 추가
  const addImages = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));

      const newPreviews = await Promise.all(
        imageFiles.map(async file => {
          if (!file) return null; // 파일이 undefined인 경우 처리
          const preview = await createPreview(file);
          return {
            file,
            preview,
            id: `${file.name}-${Date.now()}-${Math.random()}`,
          };
        })
      );

      // null 값 필터링
      const validPreviews = newPreviews.filter(
        (preview): preview is NonNullable<typeof preview> => preview !== null
      );

      setPreviews(prev => [...prev, ...validPreviews]);
    },
    [createPreview]
  );

  // 이미지 제거
  const removeImage = useCallback((id: string) => {
    setPreviews(prev => {
      const preview = prev.find(p => p.id === id);
      if (preview) {
        URL.revokeObjectURL(preview.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  // 모든 이미지 제거
  const clearImages = useCallback(() => {
    previews.forEach(preview => {
      URL.revokeObjectURL(preview.preview);
    });
    setPreviews([]);
  }, [previews]);

  // 이미지 업로드
  const uploadImages = useCallback(
    async (options: UploadOptions) => {
      const files = previews.map(p => p.file);
      const result = await fileUpload.uploadFiles(files, options);

      if (result.length > 0) {
        clearImages();
      }

      return result;
    },
    [previews, fileUpload.uploadFiles, clearImages]
  );

  return {
    ...fileUpload,
    previews,
    validateImage,
    addImages,
    removeImage,
    clearImages,
    uploadImages,
  };
}

/**
 * 파일 진행상황 관리 훅
 */
export function useUploadProgress() {
  const [uploads, setUploads] = useState<Map<string, FileUploadProgress>>(
    new Map()
  );

  // 업로드 시작
  const startUpload = useCallback(
    (fileId: string, fileName: string, totalBytes: number) => {
      setUploads(prev =>
        new Map(prev).set(fileId, {
          fileName,
          progress: 0,
          status: 'uploading',
          uploadedBytes: 0,
          totalBytes,
        })
      );
    },
    []
  );

  // 진행상황 업데이트
  const updateProgress = useCallback(
    (fileId: string, uploadedBytes: number, speed?: number) => {
      setUploads(prev => {
        const current = prev.get(fileId);
        if (!current) return prev;

        const progress = Math.round((uploadedBytes / current.totalBytes) * 100);
        const remainingBytes = current.totalBytes - uploadedBytes;
        const remainingTime = speed ? remainingBytes / speed : undefined;

        const updated = new Map(prev);
        updated.set(fileId, {
          ...current,
          progress,
          uploadedBytes,
          speed,
          remainingTime,
        });

        return updated;
      });
    },
    []
  );

  // 업로드 완료
  const completeUpload = useCallback(
    (fileId: string, fileResponse?: FileResponse) => {
      setUploads(prev => {
        const current = prev.get(fileId);
        if (!current) return prev;

        const updated = new Map(prev);
        updated.set(fileId, {
          ...current,
          progress: 100,
          status: 'completed',
          fileId: fileResponse?.id,
        });

        return updated;
      });
    },
    []
  );

  // 업로드 실패
  const failUpload = useCallback((fileId: string, error: string) => {
    setUploads(prev => {
      const current = prev.get(fileId);
      if (!current) return prev;

      const updated = new Map(prev);
      updated.set(fileId, {
        ...current,
        status: 'error',
        error,
      });

      return updated;
    });
  }, []);

  // 업로드 제거
  const removeUpload = useCallback((fileId: string) => {
    setUploads(prev => {
      const updated = new Map(prev);
      updated.delete(fileId);
      return updated;
    });
  }, []);

  // 모든 업로드 제거
  const clearUploads = useCallback(() => {
    setUploads(new Map());
  }, []);

  // 진행 중인 업로드 확인
  const hasActiveUploads = useCallback(() => {
    return Array.from(uploads.values()).some(
      upload => upload.status === 'uploading' || upload.status === 'pending'
    );
  }, [uploads]);

  return {
    uploads: Array.from(uploads.entries()).map(([id, upload]) => ({
      id,
      ...upload,
    })),
    startUpload,
    updateProgress,
    completeUpload,
    failUpload,
    removeUpload,
    clearUploads,
    hasActiveUploads,
  };
}

/**
 * 파일 크기 포맷팅 유틸리티 훅
 */
export function useFileUtils() {
  // 파일 크기 포맷팅
  const formatFileSize = useCallback((bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  // 파일 타입 아이콘 가져오기
  const getFileIcon = useCallback((mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎬';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
      return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
      return '📽️';
    if (
      mimeType.includes('zip') ||
      mimeType.includes('rar') ||
      mimeType.includes('tar')
    )
      return '📦';
    if (mimeType.includes('text')) return '📋';
    return '📁';
  }, []);

  // 파일 확장자 추출
  const getFileExtension = useCallback((filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  }, []);

  // 파일명에서 이름 부분만 추출
  const getFileNameWithoutExtension = useCallback(
    (filename: string): string => {
      return filename.replace(/\.[^/.]+$/, '');
    },
    []
  );

  // 안전한 파일명 생성
  const sanitizeFileName = useCallback((filename: string): string => {
    return filename
      .replace(/[^a-z0-9.]/gi, '_')
      .replace(/__+/g, '_')
      .replace(/^_|_$/g, '');
  }, []);

  return {
    formatFileSize,
    getFileIcon,
    getFileExtension,
    getFileNameWithoutExtension,
    sanitizeFileName,
  };
}

/**
 * 드래그 앤 드롭 관련 커스텀 훅
 */

import { useCallback, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DRAG_DROP_CONFIG } from '@/lib/config/editor-config';

interface DragDropItem {
  id: string;
  type: string;
  data: any;
}

/**
 * 기본 드래그 앤 드롭 훅
 */
export function useDragDrop<T extends DragDropItem>() {
  const [items, setItems] = useState<T[]>([]);
  const [activeItem, setActiveItem] = useState<T | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_DROP_CONFIG.dragThreshold,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 시작
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const activeItem = items.find(item => item.id === event.active.id);
      if (activeItem) {
        setActiveItem(activeItem);
      }
    },
    [items]
  );

  // 드래그 오버
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setDraggedOver(over ? String(over.id) : null);
  }, []);

  // 드래그 종료
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems(prevItems => {
        const oldIndex = prevItems.findIndex(item => item.id === active.id);
        const newIndex = prevItems.findIndex(item => item.id === over.id);

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }

    setActiveItem(null);
    setDraggedOver(null);
  }, []);

  // 아이템 추가
  const addItem = useCallback((item: T, index?: number) => {
    setItems(prev => {
      if (index !== undefined) {
        const newItems = [...prev];
        newItems.splice(index, 0, item);
        return newItems;
      }
      return [...prev, item];
    });
  }, []);

  // 아이템 제거
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // 아이템 업데이트
  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  return {
    items,
    activeItem,
    draggedOver,
    sensors,
    setItems,
    addItem,
    removeItem,
    updateItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}

/**
 * 블록 드래그 앤 드롭 훅
 */
export function useBlockDragDrop() {
  const dragDrop = useDragDrop();
  const [isDragging, setIsDragging] = useState(false);
  const [dropZoneIndex, setDropZoneIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setIsDragging(true);
      dragDrop.handleDragStart(event);
    },
    [dragDrop]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false);
      setDropZoneIndex(null);
      dragDrop.handleDragEnd(event);
    },
    [dragDrop]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;

      if (over) {
        // 드롭존 인덱스 계산
        const overId = String(over.id);
        const index = dragDrop.items.findIndex(item => item.id === overId);
        setDropZoneIndex(index);
      } else {
        setDropZoneIndex(null);
      }

      dragDrop.handleDragOver(event);
    },
    [dragDrop]
  );

  return {
    ...dragDrop,
    isDragging,
    dropZoneIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}

/**
 * 파일 드래그 앤 드롭 훅
 */
export function useFileDragDrop() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState<File[]>([]);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    dragCounterRef.current++;

    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
    dragCounterRef.current = 0;

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      setDraggedFiles(files);
      event.dataTransfer.clearData();
      return files;
    }

    return [];
  }, []);

  const clearFiles = useCallback(() => {
    setDraggedFiles([]);
  }, []);

  return {
    isDragActive,
    draggedFiles,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearFiles,
  };
}

/**
 * 리사이즈 가능한 요소 훅
 */
export function useResizable(initialWidth = 300, initialHeight = 200) {
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      setIsResizing(true);
      startPosRef.current = { x: event.clientX, y: event.clientY };
      startSizeRef.current = size;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startPosRef.current.x;
        const deltaY = e.clientY - startPosRef.current.y;

        setSize({
          width: Math.max(100, startSizeRef.current.width + deltaX),
          height: Math.max(100, startSizeRef.current.height + deltaY),
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [size]
  );

  const resetSize = useCallback(() => {
    setSize({ width: initialWidth, height: initialHeight });
  }, [initialWidth, initialHeight]);

  return {
    size,
    isResizing,
    resizeRef,
    handleMouseDown,
    resetSize,
    setSize,
  };
}

/**
 * 드래그 앤 드롭 컨텍스트 훅
 */
export function useDragDropContext() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: DRAG_DROP_CONFIG.dragThreshold,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setDraggedItem(event.active.data.current);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    setDraggedItem(null);
  }, []);

  return {
    activeId,
    draggedItem,
    sensors,
    handleDragStart,
    handleDragEnd,
    DndContext,
    DragOverlay,
    closestCenter,
  };
}

/**
 * 정렬 가능한 리스트 훅
 */
export function useSortableList<T extends { id: string }>(
  initialItems: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => arrayMove(prev, fromIndex, toIndex));
  }, []);

  const moveItemById = useCallback((fromId: string, toId: string) => {
    setItems(prev => {
      const fromIndex = prev.findIndex(item => item.id === fromId);
      const toIndex = prev.findIndex(item => item.id === toId);

      if (fromIndex === -1 || toIndex === -1) return prev;

      return arrayMove(prev, fromIndex, toIndex);
    });
  }, []);

  const addItem = useCallback((item: T, index?: number) => {
    setItems(prev => {
      if (index !== undefined) {
        const newItems = [...prev];
        newItems.splice(index, 0, item);
        return newItems;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const reorderItems = useCallback((newOrder: string[]) => {
    setItems(prev => {
      const itemMap = new Map(prev.map(item => [item.id, item]));
      return newOrder.map(id => itemMap.get(id)).filter(Boolean) as T[];
    });
  }, []);

  return {
    items,
    setItems,
    moveItem,
    moveItemById,
    addItem,
    removeItem,
    updateItem,
    reorderItems,
    SortableContext,
    verticalListSortingStrategy,
  };
}

/**
 * 드래그 프리뷰 훅
 */
export function useDragPreview() {
  const [previewElement, setPreviewElement] = useState<HTMLElement | null>(
    null
  );
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});

  const updatePreview = useCallback(
    (element: HTMLElement | null, style?: React.CSSProperties) => {
      setPreviewElement(element);
      if (style) {
        setPreviewStyle(style);
      }
    },
    []
  );

  const hidePreview = useCallback(() => {
    setPreviewElement(null);
    setPreviewStyle({});
  }, []);

  const defaultPreviewStyle: React.CSSProperties = {
    opacity: DRAG_DROP_CONFIG.preview.opacity,
    transform: `scale(${DRAG_DROP_CONFIG.preview.scale})`,
    pointerEvents: 'none',
    zIndex: 1000,
    ...previewStyle,
  };

  return {
    previewElement,
    previewStyle: defaultPreviewStyle,
    updatePreview,
    hidePreview,
  };
}

/**
 * 드롭존 훅
 */
export function useDropZone(onDrop?: (items: any[]) => void) {
  const [isOver, setIsOver] = useState(false);
  const [canDrop, setCanDrop] = useState(false);

  const handleDragEnter = useCallback(() => {
    setIsOver(true);
    setCanDrop(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsOver(false);
    setCanDrop(false);
  }, []);

  const handleDrop = useCallback(
    (items: any[]) => {
      setIsOver(false);
      setCanDrop(false);
      onDrop?.(items);
    },
    [onDrop]
  );

  const dropZoneStyle: React.CSSProperties = {
    outline:
      isOver && canDrop
        ? `${DRAG_DROP_CONFIG.dropZone.indicatorThickness}px solid ${DRAG_DROP_CONFIG.dropZone.indicatorColor}`
        : 'none',
    transition: 'outline 0.2s ease',
  };

  return {
    isOver,
    canDrop,
    dropZoneStyle,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}

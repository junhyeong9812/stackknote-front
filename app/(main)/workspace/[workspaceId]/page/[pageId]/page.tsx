'use client';

import { AdvancedBlockNoteEditor } from '@/components/editor/advanced-blocknote-editor';

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ workspaceId: string; pageId: string }>;
}) {
  // Next.js 15에서 params는 Promise입니다
  const { workspaceId, pageId } = await params;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">페이지 편집</h1>
        <p className="text-gray-600">
          워크스페이스: {workspaceId} | 페이지: {pageId}
        </p>
      </div>
      
      <AdvancedBlockNoteEditor
        className="w-full"
        placeholder="페이지 내용을 입력하세요..."
        showToolbar={true}
        onContentChange={(content) => {
          console.log('Content changed:', content);
        }}
      />
    </div>
  );
}
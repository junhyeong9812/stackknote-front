'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Mail,
  MoreHorizontal,
  Crown,
  Shield,
  Eye,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  SearchInput,
  SimpleSelect,
  Badge,
  UserAvatar,
  SimpleTooltip,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  SimpleTabs,
} from '@/components/ui';
import { DataTable } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { useWorkspaceStore } from '@/lib/stores/workspace-store';
import { useToastHelpers } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type {
  WorkspaceMemberResponse,
  MemberInviteRequest,
  WorkspaceMemberRole,
  TableColumn,
  PaginationInfo,
  SelectOption,
} from '@/types';

// 멤버 상태 필터 옵션
const statusOptions: SelectOption[] = [
  { value: 'all', label: '전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'PENDING', label: '대기 중' },
  { value: 'INACTIVE', label: '비활성' },
];

// 역할 필터 옵션
const roleFilterOptions: SelectOption[] = [
  { value: 'all', label: '모든 역할' },
  { value: 'OWNER', label: '소유자' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'MEMBER', label: '멤버' },
  { value: 'VIEWER', label: '뷰어' },
];

// 역할 변경 옵션 (소유자 제외)
const roleOptions: SelectOption[] = [
  { value: 'VIEWER', label: '뷰어' },
  { value: 'MEMBER', label: '멤버' },
  { value: 'ADMIN', label: '관리자' },
];

export default function WorkspaceMembersPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = parseInt(params.workspaceId as string);

  const {
    currentWorkspace,
    members,
    isMembersLoading,
    membersError,
    fetchWorkspace,
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
    generateInviteCode,
  } = useWorkspaceStore();

  const { success, error: showError } = useToastHelpers();

  // 상태 관리
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(
    new Set()
  );

  // 초대 폼
  const [inviteForm, setInviteForm] = useState<MemberInviteRequest>({
    email: '',
    role: 'MEMBER',
    message: '',
  });

  // 페이지네이션
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // 데이터 로드
  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      fetchMembers(workspaceId);
    }
  }, [workspaceId]);

  // 페이지네이션 업데이트
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredMembers.length,
      totalPages: Math.ceil(filteredMembers.length / prev.size),
      hasNext: prev.page < Math.ceil(filteredMembers.length / prev.size),
      hasPrevious: prev.page > 1,
    }));
  }, [members, searchQuery, statusFilter, roleFilter]);

  // 권한 체크
  const canManage = currentWorkspace?.canManage ?? false;
  const isOwner = currentWorkspace?.currentUserRole === 'OWNER';

  // 멤버 데이터 필터링
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch =
        member.user.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        member.isActive === (statusFilter === 'ACTIVE');
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [members, searchQuery, statusFilter, roleFilter]);

  // 페이지네이션된 데이터
  const paginatedMembers = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.size;
    const endIndex = startIndex + pagination.size;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, pagination.page, pagination.size]);

  // 역할 아이콘 가져오기
  const getRoleIcon = (role: WorkspaceMemberRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className='h-4 w-4 text-yellow-500' />;
      case 'ADMIN':
        return <Shield className='h-4 w-4 text-blue-500' />;
      case 'MEMBER':
        return <Users className='h-4 w-4 text-green-500' />;
      case 'VIEWER':
        return <Eye className='h-4 w-4 text-gray-500' />;
      default:
        return null;
    }
  };

  // 상태 배지 가져오기
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge variant='default' className='bg-green-100 text-green-800'>
          활성
        </Badge>
      );
    }
    return <Badge variant='secondary'>비활성</Badge>;
  };

  // 테이블 컬럼 정의
  const columns: TableColumn<WorkspaceMemberResponse>[] = [
    {
      id: 'user',
      header: '사용자',
      accessorKey: 'user',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <UserAvatar
            src={row.user.profileImageUrl}
            name={row.user.username}
            size='sm'
          />
          <div>
            <div className='font-medium'>{row.user.username}</div>
            <div className='text-sm text-gray-500'>{row.user.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'role',
      header: '역할',
      accessorKey: 'role',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          {getRoleIcon(row.role)}
          <span>
            {row.role === 'OWNER'
              ? '소유자'
              : row.role === 'ADMIN'
                ? '관리자'
                : row.role === 'MEMBER'
                  ? '멤버'
                  : '뷰어'}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'status',
      header: '상태',
      accessorKey: 'isActive',
      cell: ({ row }) => getStatusBadge(row.isActive),
      sortable: true,
    },
    {
      id: 'joinedAt',
      header: '참여일',
      accessorKey: 'joinedAt',
      cell: ({ row }) => new Date(row.joinedAt).toLocaleDateString('ko-KR'),
      sortable: true,
    },
    {
      id: 'actions',
      header: '작업',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          {row.role !== 'OWNER' && canManage && (
            <>
              <SimpleSelect
                value={row.role}
                onValueChange={value =>
                  handleRoleChange(
                    row.id,
                    value as Exclude<WorkspaceMemberRole, 'OWNER'>
                  )
                }
                options={roleOptions}
                disabled={!isOwner}
              />
              <SimpleTooltip content='멤버 제거'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveMember(row.id)}
                  disabled={!isOwner}
                  className='text-red-600 hover:text-red-700'
                >
                  <UserX className='h-4 w-4' />
                </Button>
              </SimpleTooltip>
            </>
          )}
          {row.role === 'OWNER' && (
            <Badge variant='outline' className='text-yellow-600'>
              소유자
            </Badge>
          )}
        </div>
      ),
    },
  ];

  // 멤버 초대
  const handleInviteMember = async () => {
    try {
      await inviteMember(workspaceId, inviteForm);
      success({ title: '멤버를 초대했습니다' });
      setIsInviteDialogOpen(false);
      setInviteForm({ email: '', role: 'MEMBER', message: '' });
    } catch (error) {
      showError({ title: '초대에 실패했습니다', description: String(error) });
    }
  };

  // 역할 변경
  const handleRoleChange = async (
    memberId: number,
    role: Exclude<WorkspaceMemberRole, 'OWNER'>
  ) => {
    try {
      await updateMemberRole(workspaceId, memberId, { role });
      success({ title: '멤버 역할이 변경되었습니다' });
    } catch (error) {
      showError({
        title: '역할 변경에 실패했습니다',
        description: String(error),
      });
    }
  };

  // 멤버 제거
  const handleRemoveMember = async (memberId: number) => {
    try {
      await removeMember(workspaceId, memberId);
      success({ title: '멤버가 제거되었습니다' });
    } catch (error) {
      showError({
        title: '멤버 제거에 실패했습니다',
        description: String(error),
      });
    }
  };

  // 초대 링크 생성
  const handleGenerateInviteLink = async () => {
    try {
      const code = await generateInviteCode(workspaceId);
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite/${code}`
      );
      success({ title: '초대 링크가 생성되고 복사되었습니다' });
    } catch (error) {
      showError({
        title: '초대 링크 생성에 실패했습니다',
        description: String(error),
      });
    }
  };

  // 권한 없음 처리
  if (!canManage) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-center'>
          <Shield className='mx-auto mb-4 h-16 w-16 text-gray-400' />
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            접근 권한이 없습니다
          </h2>
          <p className='mt-2 text-gray-500 dark:text-gray-400'>
            이 워크스페이스의 멤버를 관리할 권한이 없습니다.
          </p>
          <Button
            onClick={() => router.push(`/workspace/${workspaceId}`)}
            className='mt-4'
          >
            워크스페이스로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      value: 'members',
      label: '멤버 목록',
      badge: <Badge variant='secondary'>{filteredMembers.length}</Badge>,
      content: (
        <div className='space-y-6'>
          {/* 검색 및 필터 */}
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='flex-1'>
              <SearchInput
                placeholder='멤버 검색...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
              />
            </div>
            <div className='flex gap-2'>
              <SimpleSelect
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={statusOptions}
                placeholder='상태'
              />
              <SimpleSelect
                value={roleFilter}
                onValueChange={setRoleFilter}
                options={roleFilterOptions}
                placeholder='역할'
              />
            </div>
          </div>

          {/* 테이블 */}
          <Card>
            <CardContent className='p-0'>
              <DataTable
                data={paginatedMembers}
                columns={columns}
                loading={isMembersLoading}
                error={membersError || undefined}
                emptyMessage='멤버가 없습니다.'
                config={{
                  selectable: true,
                  sortable: true,
                  hover: true,
                }}
              />
            </CardContent>
          </Card>

          {/* 페이지네이션 */}
          {filteredMembers.length > pagination.size && (
            <Pagination
              pagination={pagination}
              onPageChange={page => setPagination(prev => ({ ...prev, page }))}
              onPageSizeChange={size =>
                setPagination(prev => ({ ...prev, size, page: 1 }))
              }
            />
          )}
        </div>
      ),
    },
    {
      value: 'pending',
      label: '대기 중인 초대',
      content: (
        <Card>
          <CardContent className='py-12 text-center'>
            <Clock className='mx-auto mb-4 h-12 w-12 text-gray-400' />
            <h3 className='mb-2 text-lg font-medium'>
              대기 중인 초대가 없습니다
            </h3>
            <p className='mb-4 text-gray-500'>
              새로운 멤버를 초대하여 협업을 시작하세요.
            </p>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              멤버 초대
            </Button>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className='container mx-auto max-w-7xl px-6 py-8'>
      {/* 헤더 */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>멤버 관리</h1>
            <p className='mt-2 text-gray-500 dark:text-gray-400'>
              {currentWorkspace?.name} 워크스페이스의 멤버를 관리하세요.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={handleGenerateInviteLink}>
              <Copy className='mr-2 h-4 w-4' />
              초대 링크 복사
            </Button>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              멤버 초대
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-blue-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>전체 멤버</p>
                <p className='text-2xl font-bold'>{members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <CheckCircle className='h-8 w-8 text-green-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>활성 멤버</p>
                <p className='text-2xl font-bold'>
                  {members.filter(m => m.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <Shield className='h-8 w-8 text-purple-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>관리자</p>
                <p className='text-2xl font-bold'>
                  {
                    members.filter(
                      m => m.role === 'ADMIN' || m.role === 'OWNER'
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center'>
              <Clock className='h-8 w-8 text-orange-600' />
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-500'>대기 중</p>
                <p className='text-2xl font-bold'>0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 컨텐츠 */}
      <SimpleTabs items={tabItems} defaultValue='members' variant='line' />

      {/* 멤버 초대 다이얼로그 */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>멤버 초대</DialogTitle>
            <DialogDescription>
              새로운 멤버를 워크스페이스에 초대합니다.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>이메일 주소 *</label>
              <Input
                type='email'
                value={inviteForm.email}
                onChange={e =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                placeholder='초대할 사용자의 이메일을 입력하세요'
              />
            </div>

            <div>
              <label className='text-sm font-medium'>역할</label>
              <SimpleSelect
                value={inviteForm.role}
                onValueChange={value =>
                  setInviteForm({
                    ...inviteForm,
                    role: value as Exclude<WorkspaceMemberRole, 'OWNER'>,
                  })
                }
                options={roleOptions}
              />
            </div>

            <div>
              <label className='text-sm font-medium'>
                초대 메시지 (선택사항)
              </label>
              <Input
                value={inviteForm.message}
                onChange={e =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
                placeholder='초대와 함께 보낼 메시지를 입력하세요'
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsInviteDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleInviteMember}>초대 보내기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

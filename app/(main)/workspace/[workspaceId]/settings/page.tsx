'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Settings,
  Users,
  Shield,
  Trash2,
  Upload,
  Copy,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Globe,
  Lock,
  Crown,
  UserX,
  Mail,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Label,
  FormField,
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
  ConfirmDialog,
  Switch,
} from '@/components/ui';
import { useWorkspaceStore } from '@/lib/stores/workspace-store';
import { useToastHelpers } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import type {
  WorkspaceUpdateRequest,
  WorkspaceMemberResponse,
  MemberInviteRequest,
  WorkspaceVisibility,
  WorkspaceMemberRole,
} from '@/types';
import type { SelectOption } from '@/components/ui/select';

// 탭 정의
type SettingTab = 'general' | 'members' | 'permissions' | 'danger';

interface TabItem {
  id: SettingTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const tabs: TabItem[] = [
  {
    id: 'general',
    label: '일반',
    icon: Settings,
    description: '워크스페이스 기본 정보',
  },
  {
    id: 'members',
    label: '멤버',
    icon: Users,
    description: '멤버 관리 및 초대',
  },
  {
    id: 'permissions',
    label: '권한',
    icon: Shield,
    description: '접근 권한 및 보안 설정',
  },
  {
    id: 'danger',
    label: '위험 영역',
    icon: Trash2,
    description: '워크스페이스 삭제',
  },
];

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = parseInt(params.workspaceId as string);

  const {
    currentWorkspace,
    members,
    isLoading,
    isMembersLoading,
    error,
    membersError,
    fetchWorkspace,
    fetchMembers,
    updateWorkspace,
    inviteMember,
    updateMemberRole,
    removeMember,
    deleteWorkspace,
    generateInviteCode,
    removeInviteCode,
  } = useWorkspaceStore();

  const { success, error: showError } = useToastHelpers();

  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState<MemberInviteRequest>({
    email: '',
    role: 'MEMBER',
    message: '',
  });

  // 일반 설정 폼
  const [generalForm, setGeneralForm] = useState<WorkspaceUpdateRequest>({
    name: '',
    description: '',
    visibility: 'PRIVATE',
  });

  // 워크스페이스 정보 로드
  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      fetchMembers(workspaceId);
    }
  }, [workspaceId]);

  // 폼 초기값 설정
  useEffect(() => {
    if (currentWorkspace) {
      setGeneralForm({
        name: currentWorkspace.name,
        description: currentWorkspace.description || '',
        visibility: currentWorkspace.visibility,
      });
    }
  }, [currentWorkspace]);

  // 권한 체크
  const canManage = currentWorkspace?.canManage ?? false;
  const isOwner = currentWorkspace?.currentUserRole === 'OWNER';

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            워크스페이스를 찾을 수 없습니다
          </h2>
          <p className='mt-2 text-gray-500 dark:text-gray-400'>
            존재하지 않거나 접근 권한이 없는 워크스페이스입니다.
          </p>
          <Button onClick={() => router.push('/dashboard')} className='mt-4'>
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-center'>
          <Shield className='mx-auto mb-4 h-16 w-16 text-gray-400' />
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            접근 권한이 없습니다
          </h2>
          <p className='mt-2 text-gray-500 dark:text-gray-400'>
            이 워크스페이스의 설정을 변경할 권한이 없습니다.
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

  // 일반 설정 저장
  const handleGeneralSave = async () => {
    try {
      await updateWorkspace(workspaceId, generalForm);
      success({ title: '설정이 저장되었습니다' });
    } catch (error) {
      showError({ title: '저장에 실패했습니다', description: String(error) });
    }
  };

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

  // 멤버 역할 변경
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

  // 초대 코드 생성
  const handleGenerateInviteCode = async () => {
    try {
      const code = await generateInviteCode(workspaceId);
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite/${code}`
      );
      success({ title: '초대 링크가 생성되고 복사되었습니다' });
    } catch (error) {
      showError({
        title: '초대 코드 생성에 실패했습니다',
        description: String(error),
      });
    }
  };

  // 워크스페이스 삭제
  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspace(workspaceId);
      success({ title: '워크스페이스가 삭제되었습니다' });
      router.push('/dashboard');
    } catch (error) {
      showError({ title: '삭제에 실패했습니다', description: String(error) });
    }
  };

  const roleOptions: SelectOption[] = [
    { value: 'VIEWER', label: '뷰어' },
    { value: 'MEMBER', label: '멤버' },
    { value: 'ADMIN', label: '관리자' },
  ];

  const visibilityOptions = [
    { value: 'PRIVATE', label: '비공개' },
    { value: 'PUBLIC', label: '공개' },
  ];

  const getRoleIcon = (role: WorkspaceMemberRole) => {
    switch (role) {
      case 'OWNER':
        return <Crown className='h-4 w-4 text-yellow-500' />;
      case 'ADMIN':
        return <Shield className='h-4 w-4 text-blue-500' />;
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>
                  워크스페이스의 기본 정보를 수정할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField label='워크스페이스 이름' required>
                  <Input
                    value={generalForm.name}
                    onChange={e =>
                      setGeneralForm({ ...generalForm, name: e.target.value })
                    }
                    placeholder='워크스페이스 이름을 입력하세요'
                  />
                </FormField>

                <FormField label='설명'>
                  <Textarea
                    value={generalForm.description}
                    onChange={e =>
                      setGeneralForm({
                        ...generalForm,
                        description: e.target.value,
                      })
                    }
                    placeholder='워크스페이스에 대한 설명을 입력하세요'
                    rows={3}
                  />
                </FormField>

                <FormField label='공개 범위'>
                  <SimpleSelect
                    value={generalForm.visibility}
                    onValueChange={(value: WorkspaceVisibility) =>
                      setGeneralForm({ ...generalForm, visibility: value })
                    }
                    options={visibilityOptions}
                  />
                </FormField>

                <div className='flex justify-end'>
                  <Button onClick={handleGeneralSave}>저장</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'members':
        return (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>멤버 관리</CardTitle>
                    <CardDescription>
                      워크스페이스 멤버를 관리하고 새로운 멤버를 초대할 수
                      있습니다.
                    </CardDescription>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      onClick={handleGenerateInviteCode}
                      variant='outline'
                    >
                      <Copy className='mr-2 h-4 w-4' />
                      초대 링크 복사
                    </Button>
                    <Button onClick={() => setIsInviteDialogOpen(true)}>
                      <Mail className='mr-2 h-4 w-4' />
                      멤버 초대
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isMembersLoading ? (
                  <div className='flex justify-center py-8'>
                    <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary'></div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {members.map(member => (
                      <div
                        key={member.id}
                        className='flex items-center justify-between rounded-lg border p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <UserAvatar
                            src={member.user.profileImageUrl}
                            name={member.user.username}
                            size='sm'
                          />
                          <div>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium'>
                                {member.user.username}
                              </span>
                              {getRoleIcon(member.role)}
                              <Badge variant='secondary'>
                                {member.role === 'OWNER'
                                  ? '소유자'
                                  : member.role === 'ADMIN'
                                    ? '관리자'
                                    : member.role === 'MEMBER'
                                      ? '멤버'
                                      : '뷰어'}
                              </Badge>
                            </div>
                            <p className='text-sm text-gray-500'>
                              {member.user.email}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center gap-2'>
                          {member.role !== 'OWNER' && isOwner && (
                            <>
                              <SimpleSelect
                                value={member.role}
                                onValueChange={value =>
                                  handleRoleChange(
                                    member.id,
                                    value as Exclude<
                                      WorkspaceMemberRole,
                                      'OWNER'
                                    >
                                  )
                                }
                                options={roleOptions}
                              />
                              <SimpleTooltip content='멤버 제거'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => handleRemoveMember(member.id)}
                                  className='text-red-600 hover:text-red-700'
                                >
                                  <UserX className='h-4 w-4' />
                                </Button>
                              </SimpleTooltip>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'permissions':
        return (
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>접근 권한</CardTitle>
                <CardDescription>
                  워크스페이스의 접근 권한과 보안 설정을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <Label>공개 페이지 허용</Label>
                    <p className='text-sm text-gray-500'>
                      멤버가 공개 페이지를 만들 수 있습니다.
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <Label>게스트 댓글 허용</Label>
                    <p className='text-sm text-gray-500'>
                      로그인하지 않은 사용자도 댓글을 남길 수 있습니다.
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <Label>알림 활성화</Label>
                    <p className='text-sm text-gray-500'>
                      워크스페이스 활동에 대한 알림을 받습니다.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'danger':
        return (
          <div className='space-y-6'>
            <Card className='border-red-200 dark:border-red-800'>
              <CardHeader>
                <CardTitle className='text-red-600 dark:text-red-400'>
                  위험 영역
                </CardTitle>
                <CardDescription>
                  이 작업들은 되돌릴 수 없습니다. 신중하게 진행하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isOwner && (
                  <div className='flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-800'>
                    <div>
                      <h4 className='font-medium text-red-600 dark:text-red-400'>
                        워크스페이스 삭제
                      </h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        모든 페이지와 데이터가 영구적으로 삭제됩니다.
                      </p>
                    </div>
                    <Button
                      variant='destructive'
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      삭제
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='container mx-auto max-w-6xl px-6 py-8'>
      {/* 헤더 */}
      <div className='mb-8'>
        <div className='mb-2 flex items-center gap-3'>
          {currentWorkspace.icon && (
            <span className='text-2xl'>{currentWorkspace.icon}</span>
          )}
          <h1 className='text-3xl font-bold'>{currentWorkspace.name} 설정</h1>
        </div>
        <p className='text-gray-500 dark:text-gray-400'>
          워크스페이스의 설정을 관리하고 멤버를 초대하세요.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='flex-shrink-0 lg:w-64'>
          <nav className='space-y-1'>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className='h-4 w-4' />
                  <div>
                    <div className='font-medium'>{tab.label}</div>
                    <div className='text-xs opacity-75'>{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 탭 내용 */}
        <div className='min-w-0 flex-1'>{renderTabContent()}</div>
      </div>

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
            <FormField label='이메일 주소' required>
              <Input
                type='email'
                value={inviteForm.email}
                onChange={e =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                placeholder='초대할 사용자의 이메일을 입력하세요'
              />
            </FormField>

            <FormField label='역할'>
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
            </FormField>

            <FormField label='초대 메시지 (선택사항)'>
              <Textarea
                value={inviteForm.message}
                onChange={e =>
                  setInviteForm({ ...inviteForm, message: e.target.value })
                }
                placeholder='초대와 함께 보낼 메시지를 입력하세요'
                rows={3}
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsInviteDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleInviteMember}>초대</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='워크스페이스 삭제'
        description={`정말로 "${currentWorkspace.name}" 워크스페이스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 페이지와 데이터가 영구적으로 삭제됩니다.`}
        confirmText='삭제'
        cancelText='취소'
        variant='destructive'
        onConfirm={handleDeleteWorkspace}
      />
    </div>
  );
}

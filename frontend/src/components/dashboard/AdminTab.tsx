import { useState } from 'react';
import {
  useGetActiveUCA,
  useUpdateUCA,
  useGetAllMembers,
  useCreateConsensusMeeting,
  useGetPendingJoinRequests,
  useUpdateJoinRequestStatus,
  usePromoteToAdmin,
  useDeleteUser,
  useIsCouncilMember,
} from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Users, Loader2, Save, Plus, MessageSquare, Coins, UserCheck, UserX, UserCog, Trash2, Crown } from 'lucide-react';
import { toast } from 'sonner';
import TokenomicsTab from './TokenomicsTab';
import DailyRewardsConfigCard from './DailyRewardsConfigCard';
import { Principal } from '@icp-sdk/core/principal';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { JoinRequestStatus } from '../../backend';

export default function AdminTab() {
  const { identity } = useInternetIdentity();
  const { data: ucaText, isLoading: ucaLoading } = useGetActiveUCA();
  const { data: profiles } = useGetAllMembers();
  const { data: pendingRequests, isLoading: requestsLoading } = useGetPendingJoinRequests();
  const updateUCA = useUpdateUCA();
  const createMeeting = useCreateConsensusMeeting();
  const updateRequestStatus = useUpdateJoinRequestStatus();
  const promoteToAdmin = usePromoteToAdmin();
  const deleteUser = useDeleteUser();

  const [editedUCA, setEditedUCA] = useState('');
  const [isEditingUCA, setIsEditingUCA] = useState(false);
  const [newMeetingId, setNewMeetingId] = useState('');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [processingMember, setProcessingMember] = useState<string | null>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleEditUCA = () => {
    setEditedUCA(ucaText || '');
    setIsEditingUCA(true);
  };

  const handleSaveUCA = async () => {
    try {
      await updateUCA.mutateAsync(editedUCA);
      toast.success('UCA updated successfully!');
      setIsEditingUCA(false);
    } catch (error) {
      toast.error('Failed to update UCA');
      console.error('Error updating UCA:', error);
    }
  };

  const handleCreateMeeting = async () => {
    if (!newMeetingId.trim()) {
      toast.error('Please enter a meeting ID');
      return;
    }

    try {
      await createMeeting.mutateAsync(newMeetingId.trim());
      toast.success('Consensus meeting created successfully!');
      setNewMeetingId('');
    } catch (error) {
      toast.error('Failed to create meeting');
      console.error('Error creating meeting:', error);
    }
  };

  const handleApproveRequest = async (userPrincipal: Principal) => {
    const principalStr = userPrincipal.toString();
    setProcessingRequest(principalStr);
    
    try {
      await updateRequestStatus.mutateAsync({
        user: userPrincipal,
        status: JoinRequestStatus.approved,
      });
      toast.success('Join request approved successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to approve request: ${errorMessage}`);
      console.error('Error approving request:', error);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (userPrincipal: Principal) => {
    const principalStr = userPrincipal.toString();
    setProcessingRequest(principalStr);
    
    try {
      await updateRequestStatus.mutateAsync({
        user: userPrincipal,
        status: JoinRequestStatus.rejected,
      });
      toast.success('Join request rejected successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to reject request: ${errorMessage}`);
      console.error('Error rejecting request:', error);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handlePromoteToAdmin = async (userPrincipal: Principal) => {
    const principalStr = userPrincipal.toString();
    setProcessingMember(principalStr);
    
    try {
      await promoteToAdmin.mutateAsync(userPrincipal);
      toast.success('User promoted to admin successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to promote user: ${errorMessage}`);
      console.error('Error promoting user:', error);
    } finally {
      setProcessingMember(null);
    }
  };

  const handleDeleteUser = async (userPrincipal: Principal) => {
    const principalStr = userPrincipal.toString();
    
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    setProcessingMember(principalStr);
    
    try {
      await deleteUser.mutateAsync(userPrincipal);
      toast.success('User deleted successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error(`Failed to delete user: ${errorMessage}`);
      console.error('Error deleting user:', error);
    } finally {
      setProcessingMember(null);
    }
  };

  // Get user profile for each pending request
  const getProfileForRequest = (principal: Principal) => {
    return profiles?.find((p) => p.principal.toString() === principal.toString());
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <img
                src="/assets/generated/admin-icon-transparent.dim_64x64.png"
                alt="Admin"
                className="h-6 w-6"
              />
            </div>
            <div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage UCA, members, membership requests, consensus meetings, daily rewards, and tokenomics</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Shield className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="tokenomics" className="gap-2">
            <Coins className="h-4 w-4" />
            Tokenomics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* UCA Management */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>User Contributor Agreement</CardTitle>
                    <CardDescription>View and edit the active UCA text</CardDescription>
                  </div>
                </div>
                {!isEditingUCA && (
                  <Button onClick={handleEditUCA} variant="outline" size="sm">
                    Edit UCA
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ucaLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : isEditingUCA ? (
                <>
                  <Textarea
                    value={editedUCA}
                    onChange={(e) => setEditedUCA(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter UCA text..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveUCA} disabled={updateUCA.isPending}>
                      {updateUCA.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingUCA(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <pre className="whitespace-pre-wrap text-sm">{ucaText}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Rewards Configuration */}
          <DailyRewardsConfigCard />

          {/* Membership Requests Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <img
                    src="/assets/generated/membership-approval-icon-transparent.dim_64x64.png"
                    alt="Membership Approval"
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <CardTitle>Membership Requests</CardTitle>
                  <CardDescription>
                    {pendingRequests?.length || 0} pending request{pendingRequests?.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : pendingRequests && pendingRequests.length > 0 ? (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Approvals</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request) => {
                        const profile = getProfileForRequest(request.principal);
                        const principalStr = request.principal.toString();
                        const isProcessing = processingRequest === principalStr;
                        const approvalCount = request.approvals.length;
                        
                        return (
                          <TableRow key={principalStr}>
                            <TableCell className="font-medium">
                              {profile?.username || 'Unknown'}
                            </TableCell>
                            <TableCell>{profile?.email || 'N/A'}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {principalStr.slice(0, 20)}...
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  {approvalCount} approval{approvalCount !== 1 ? 's' : ''}
                                </Badge>
                                {approvalCount >= 2 && (
                                  <Badge variant="default" className="bg-green-600">
                                    Ready
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveRequest(request.principal)}
                                  disabled={isProcessing || updateRequestStatus.isPending}
                                >
                                  {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4" />
                                      Accept
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectRequest(request.principal)}
                                  disabled={isProcessing || updateRequestStatus.isPending}
                                >
                                  {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <UserX className="mr-2 h-4 w-4" />
                                      Reject
                                    </>
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <img
                    src="/assets/generated/join-request-icon-transparent.dim_64x64.png"
                    alt="No requests"
                    className="h-16 w-16 mx-auto mb-4 opacity-50"
                  />
                  <p>No pending membership requests</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Members Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Members Management</CardTitle>
                  <CardDescription>
                    Manage member roles and permissions - {profiles?.length || 0} total members
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles?.map((profile) => {
                      const principalStr = profile.principal.toString();
                      const isCurrentUser = principalStr === currentUserPrincipal;
                      const isProcessing = processingMember === principalStr;
                      
                      return (
                        <MemberRow
                          key={principalStr}
                          profile={profile}
                          isCurrentUser={isCurrentUser}
                          isProcessing={isProcessing}
                          onPromote={handlePromoteToAdmin}
                          onDelete={handleDeleteUser}
                          promoteLoading={promoteToAdmin.isPending}
                          deleteLoading={deleteUser.isPending}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Consensus Meeting Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Consensus Meeting Management</CardTitle>
                  <CardDescription>Create weekly consensus meetings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Create New Meeting</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter meeting ID (e.g., Week-2025-01)"
                  value={newMeetingId}
                  onChange={(e) => setNewMeetingId(e.target.value)}
                />
                <Button onClick={handleCreateMeeting} disabled={createMeeting.isPending}>
                  {createMeeting.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenomics" className="space-y-6">
          <TokenomicsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Separate component for member row to handle council member status
function MemberRow({
  profile,
  isCurrentUser,
  isProcessing,
  onPromote,
  onDelete,
  promoteLoading,
  deleteLoading,
}: {
  profile: any;
  isCurrentUser: boolean;
  isProcessing: boolean;
  onPromote: (principal: Principal) => void;
  onDelete: (principal: Principal) => void;
  promoteLoading: boolean;
  deleteLoading: boolean;
}) {
  const { data: isCouncil } = useIsCouncilMember();
  const principalStr = profile.principal.toString();

  return (
    <TableRow>
      <TableCell className="font-medium">
        {profile.username}
        {isCurrentUser && (
          <Badge variant="outline" className="ml-2">You</Badge>
        )}
      </TableCell>
      <TableCell>{profile.email}</TableCell>
      <TableCell>
        {isCouncil && (
          <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">
            <Crown className="mr-1 h-3 w-3" />
            Council Member
          </Badge>
        )}
      </TableCell>
      <TableCell className="font-mono text-xs">
        {principalStr.slice(0, 20)}...
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPromote(profile.principal)}
            disabled={isCurrentUser || isProcessing || promoteLoading}
          >
            {isProcessing && promoteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserCog className="mr-2 h-4 w-4" />
                Promote to Admin
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(profile.principal)}
            disabled={isCurrentUser || isProcessing || deleteLoading}
          >
            {isProcessing && deleteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </>
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

import { useGetAllMembers, useIsCouncilMember, useGetPendingJoinRequests, useApproveMemberJoinRequest, useGetCallerCategory, useIsCallerAdmin, useCalculateAverageREP } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Users, Search, Loader2, Crown, UserCheck, Lock } from 'lucide-react';
import { useState } from 'react';
import type { UserProfile } from '../../backend';
import { UserCategory } from '../../backend';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import CopyAddressButton from '../CopyAddressButton';

export default function MembersTab() {
  const { t } = useLanguage();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: userCategory, isLoading: categoryLoading } = useGetCallerCategory();
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useGetAllMembers();
  const { data: pendingRequests, isLoading: pendingLoading } = useGetPendingJoinRequests();
  const approveRequest = useApproveMemberJoinRequest();
  const [searchQuery, setSearchQuery] = useState('');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  const isActiveMember = userCategory === UserCategory.activeMember;
  const isAuthorized = isAdmin || isActiveMember;
  const isCheckingAuth = isAdminLoading || categoryLoading;

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-destructive/10">
              <Lock className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{t.members.accessRestricted}</h3>
              <p className="text-muted-foreground max-w-md">
                {t.members.accessRestrictedDesc}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (profilesError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t.common.error}</AlertTitle>
        <AlertDescription>
          {t.members.accessRestrictedDesc}
        </AlertDescription>
      </Alert>
    );
  }

  const filteredProfiles = profiles?.filter(profile =>
    profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvatarUrl = (profile: UserProfile) => {
    if (profile.profilePicture) {
      return profile.profilePicture.getDirectURL();
    }
    return '/assets/generated/default-avatar.dim_150x150.png';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleApproveRequest = async (userPrincipal: Principal) => {
    const principalStr = userPrincipal.toString();
    setProcessingRequest(principalStr);
    
    try {
      await approveRequest.mutateAsync(userPrincipal);
      toast.success(t.toast.approveSuccess);
    } catch (error: any) {
      const errorMessage = error?.message || t.toast.approveError;
      toast.error(errorMessage);
      console.error('Error approving request:', error);
    } finally {
      setProcessingRequest(null);
    }
  };

  const getProfileForRequest = (principal: Principal) => {
    return profiles?.find((p) => p.principal.toString() === principal.toString());
  };

  const showMemberApprovalSection = isActiveMember && pendingRequests && pendingRequests.length > 0;

  return (
    <div className="space-y-6">
      {showMemberApprovalSection && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <img
                  src="/assets/generated/membership-approval-icon-transparent.dim_64x64.png"
                  alt={t.members.pendingRequests}
                  className="h-5 w-5"
                />
              </div>
              <div>
                <CardTitle>{t.members.pendingRequests}</CardTitle>
                <CardDescription>
                  {pendingRequests.length} {t.members.pendingRequestsDesc}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.members.username}</TableHead>
                      <TableHead>{t.members.email}</TableHead>
                      <TableHead>{t.members.approvals}</TableHead>
                      <TableHead>{t.members.actions}</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {approvalCount} / 2 {t.members.approvals}
                              </Badge>
                              {approvalCount >= 2 && (
                                <Badge variant="default" className="bg-green-600">
                                  {t.members.ready}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveRequest(request.principal)}
                              disabled={isProcessing || approveRequest.isPending}
                            >
                              {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  {t.members.approve}
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t.members.title}</CardTitle>
              <CardDescription>
                {profiles?.length || 0} {t.members.subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.members.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {profilesLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProfiles && filteredProfiles.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <MemberCard key={profile.principal.toString()} profile={profile} getAvatarUrl={getAvatarUrl} getInitials={getInitials} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? t.members.noMembersSearch : t.members.noMembers}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MemberCard({ 
  profile, 
  getAvatarUrl, 
  getInitials 
}: { 
  profile: UserProfile; 
  getAvatarUrl: (profile: UserProfile) => string; 
  getInitials: (name: string) => string;
}) {
  const { t } = useLanguage();
  const { data: isCouncil } = useIsCouncilMember();
  const { data: averageREP } = useCalculateAverageREP(profile.principal);
  const principalStr = profile.principal.toString();

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={getAvatarUrl(profile)} alt={profile.username} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(profile.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{profile.username}</h3>
              {isCouncil && (
                <img
                  src="/assets/generated/council-member-badge-transparent.dim_32x32.png"
                  alt={t.members.council}
                  className="h-5 w-5"
                  title={t.members.council}
                />
              )}
            </div>
            {isCouncil && (
              <Badge variant="default" className="bg-amber-600 hover:bg-amber-700 mb-2">
                <Crown className="mr-1 h-3 w-3" />
                {t.members.council}
              </Badge>
            )}
            <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
            {averageREP !== undefined && averageREP > 0n && (
              <div className="mt-2 flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  Avg REP: {averageREP.toString()}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground font-mono truncate">
                {principalStr.slice(0, 20)}...
              </p>
              <CopyAddressButton address={principalStr} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import { useGetCallerUserProfile, useGetTokenBalance, useGetMembershipStatus, useSubmitJoinRequest, useHasAcceptedUCA, useLeaveCommunity, useGetCallerCategory } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Coins, Award, Mail, User, Edit, UserPlus, CheckCircle2, Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import EditProfileDialog from './EditProfileDialog';
import UCADialog from './UCADialog';
import DailyRewardCard from './DailyRewardCard';
import DonatePHILCard from './DonatePHILCard';
import TokenomicsInfoSection from './TokenomicsInfoSection';
import { toast } from 'sonner';
import { UserCategory } from '../../backend';
import { useLanguage } from '../../contexts/LanguageContext';

export default function OverviewTab() {
  const { t } = useLanguage();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: tokenBalance } = useGetTokenBalance();
  const { data: membershipStatus, isLoading: membershipLoading } = useGetMembershipStatus();
  const { data: hasAcceptedUCA, isLoading: ucaLoading } = useHasAcceptedUCA();
  const { data: userCategory, isLoading: categoryLoading } = useGetCallerCategory();
  const submitJoinRequest = useSubmitJoinRequest();
  const leaveCommunity = useLeaveCommunity();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ucaDialogOpen, setUcaDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const getAvatarUrl = () => {
    if (userProfile?.profilePicture) {
      return userProfile.profilePicture.getDirectURL();
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

  const getCategoryLabel = (category: UserCategory) => {
    switch (category) {
      case UserCategory.nonMember:
        return t.categories.nonMember;
      case UserCategory.member:
        return t.categories.member;
      case UserCategory.activeMember:
        return t.categories.activeMember;
      default:
        return 'Unknown';
    }
  };

  const getCategoryBadge = (category: UserCategory) => {
    switch (category) {
      case UserCategory.nonMember:
        return (
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/non-member-badge-transparent.dim_32x32.png"
              alt={t.categories.nonMember}
              className="h-6 w-6"
            />
            <Badge variant="outline" className="text-muted-foreground">
              {t.categories.nonMember}
            </Badge>
          </div>
        );
      case UserCategory.member:
        return (
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/member-badge-transparent.dim_32x32.png"
              alt={t.categories.member}
              className="h-6 w-6"
            />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t.categories.member}
            </Badge>
          </div>
        );
      case UserCategory.activeMember:
        return (
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/active-member-badge-transparent.dim_32x32.png"
              alt={t.categories.activeMember}
              className="h-6 w-6"
            />
            <Badge variant="default" className="bg-green-600 text-white dark:bg-green-700">
              {t.categories.activeMember}
            </Badge>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRequestToJoin = async () => {
    if (!hasAcceptedUCA) {
      setUcaDialogOpen(true);
    } else {
      try {
        await submitJoinRequest.mutateAsync();
        toast.success(t.toast.joinRequestSuccess);
      } catch (error) {
        toast.error(t.toast.joinRequestError);
        console.error('Error submitting join request:', error);
      }
    }
  };

  const handleUCAAccepted = async () => {
    setUcaDialogOpen(false);
    try {
      await submitJoinRequest.mutateAsync();
      toast.success(t.toast.joinRequestSuccess);
    } catch (error) {
      toast.error(t.toast.joinRequestError);
      console.error('Error submitting join request:', error);
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      await leaveCommunity.mutateAsync();
      toast.success(t.toast.leaveCommunitySuccess);
      setLeaveDialogOpen(false);
    } catch (error) {
      toast.error(t.toast.leaveCommunityError);
      console.error('Error leaving community:', error);
    }
  };

  const showRequestButton = 
    userProfile && 
    !membershipLoading && 
    !ucaLoading &&
    membershipStatus && 
    !membershipStatus.isMember && 
    !membershipStatus.hasPendingRequest;

  const showRequestSent = 
    userProfile && 
    !membershipLoading && 
    membershipStatus && 
    membershipStatus.hasPendingRequest;

  const showLeaveButton = 
    userProfile && 
    !membershipLoading && 
    membershipStatus && 
    membershipStatus.isMember;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-primary/20">
                  <AvatarImage src={getAvatarUrl()} alt={userProfile?.username || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {userProfile ? getInitials(userProfile.username) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{userProfile?.username}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {userProfile?.email}
                  </CardDescription>
                  {!categoryLoading && userCategory && (
                    <div className="mt-2">
                      {getCategoryBadge(userCategory)}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                {t.overview.editProfile}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProfile?.bio && (
              <div className="text-sm text-muted-foreground">
                <p className="whitespace-pre-wrap">{userProfile.bio}</p>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="font-mono text-xs">{userProfile?.principal.toString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{t.overview.repToken}</CardTitle>
                <CardDescription>{t.overview.repDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {tokenBalance ? tokenBalance.rep.toString() : '0'}
              </span>
              <Badge variant="secondary" className="text-xs">REP</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t.overview.repEarned}
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Coins className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle>{t.overview.philToken}</CardTitle>
                <CardDescription>{t.overview.philDesc}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-accent">
                {tokenBalance ? tokenBalance.phil.toString() : '0'}
              </span>
              <Badge variant="secondary" className="text-xs">PHIL</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t.overview.philReward}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Join the Phil3 Community Card - Positioned immediately after User Profile Card */}
      {showRequestButton && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <img
                    src="/assets/generated/join-request-icon-transparent.dim_64x64.png"
                    alt={t.overview.joinCommunity}
                    className="h-12 w-12"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl">{t.overview.joinCommunity}</CardTitle>
                  <CardDescription className="mt-1">
                    {t.overview.joinCommunityDesc}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleRequestToJoin} 
              disabled={submitJoinRequest.isPending || ucaLoading}
              className="w-full sm:w-auto"
              size="lg"
            >
              {submitJoinRequest.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.overview.submitting}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t.overview.requestToJoin}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Request Sent Card - Positioned immediately after Join the Phil3 Community Card */}
      {showRequestSent && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-700 dark:text-green-400">{t.overview.requestSent}</CardTitle>
                <CardDescription className="mt-1">
                  {t.overview.requestSentDesc}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Daily Rewards Card */}
      <DailyRewardCard />

      {/* Send Token Card */}
      <DonatePHILCard />

      {/* Tokenomics Information Section - Only for Admins and Council Members */}
      <TokenomicsInfoSection />

      {/* Leave Community Card - Positioned at the bottom */}
      {showLeaveButton && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <LogOut className="h-12 w-12 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t.overview.leaveCommunity}</CardTitle>
                  <CardDescription className="mt-1">
                    {t.overview.leaveCommunityDesc}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLeaveDialogOpen(true)} 
              variant="destructive"
              className="w-full sm:w-auto"
              size="lg"
            >
              <LogOut className="mr-2 h-5 w-5" />
              {t.overview.leaveCommunity}
            </Button>
          </CardContent>
        </Card>
      )}

      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <UCADialog open={ucaDialogOpen} onOpenChange={setUcaDialogOpen} onAccepted={handleUCAAccepted} />
      
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.overview.leaveConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.overview.leaveConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLeaveCommunity}
              disabled={leaveCommunity.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {leaveCommunity.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.overview.leaving}
                </>
              ) : (
                t.overview.leaveCommunity
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

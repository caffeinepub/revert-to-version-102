import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useGetCouncilDashboard, useGetPendingCouncilActions, useGetApprovedCouncilActions, useProposeCouncilAction, useApproveCouncilAction, useIsCouncilMember, useIsCallerAdmin, useRecalculateCouncilByAverageREP, useGetCouncilMembers, useGetAverageREPForAllMembers } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Loader2, Users, Wallet, Coins, Vote, Clock, CheckCircle2, FileText, Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatDate } from '../../lib/i18n';

export default function CouncilTab() {
  const { t, locale } = useLanguage();
  const { data: councilDashboard, isLoading, error } = useGetCouncilDashboard();
  const { data: pendingActions, isLoading: loadingPending } = useGetPendingCouncilActions();
  const { data: approvedActions, isLoading: loadingApproved } = useGetApprovedCouncilActions();
  const { data: isCouncilMember, isLoading: loadingCouncilStatus } = useIsCouncilMember();
  const { data: isAdmin, isLoading: loadingAdminStatus } = useIsCallerAdmin();
  const { data: councilMembers } = useGetCouncilMembers();
  const { data: averageREPData } = useGetAverageREPForAllMembers();
  const { identity } = useInternetIdentity();
  
  const proposeAction = useProposeCouncilAction();
  const approveAction = useApproveCouncilAction();
  const recalculateCouncil = useRecalculateCouncilByAverageREP();

  const [showProposeForm, setShowProposeForm] = useState(false);
  const [actionId, setActionId] = useState('');
  const [actionDetails, setActionDetails] = useState('');

  // User is eligible if they are a council member OR admin
  const isEligibleToPropose = isCouncilMember || isAdmin;
  const isCheckingEligibility = loadingCouncilStatus || loadingAdminStatus;

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return formatDate(date, locale);
  };

  const handleProposeAction = async () => {
    if (!actionId.trim() || !actionDetails.trim()) {
      toast.error(t.council.actionIdAndDetailsRequired);
      return;
    }

    try {
      await proposeAction.mutateAsync({ actionId: actionId.trim(), details: actionDetails.trim() });
      toast.success(t.council.actionCreatedSuccess);
      setActionId('');
      setActionDetails('');
      setShowProposeForm(false);
    } catch (error: any) {
      toast.error(error.message || t.council.actionCreatedError);
    }
  };

  const handleApproveAction = async (actionId: string) => {
    try {
      await approveAction.mutateAsync(actionId);
      toast.success(t.council.actionApprovedSuccess);
    } catch (error: any) {
      toast.error(error.message || t.council.actionApprovedError);
    }
  };

  const handleRecalculateCouncil = async () => {
    try {
      await recalculateCouncil.mutateAsync();
      toast.success(t.council.recalculateSuccess);
    } catch (error: any) {
      toast.error(error.message || t.council.recalculateError);
    }
  };

  const hasUserApproved = (action: any) => {
    if (!identity) return false;
    const userPrincipal = identity.getPrincipal().toString();
    return action.approvals.some((p: any) => p.toString() === userPrincipal);
  };

  const getAverageREPForMember = (principal: string): bigint => {
    if (!averageREPData) return 0n;
    const entry = averageREPData.find(([p]) => p.toString() === principal);
    return entry ? entry[1] : 0n;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {t.council.errorLoading}
        </AlertDescription>
      </Alert>
    );
  }

  if (!councilDashboard) {
    return (
      <Alert>
        <AlertDescription>
          {t.council.notAvailable}
        </AlertDescription>
      </Alert>
    );
  }

  const panelIcons = [
    { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { icon: Wallet, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    { icon: Coins, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { icon: Vote, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  const panelImages = [
    '/assets/generated/membership-oversight-icon-transparent.dim_48x48.png',
    '/assets/generated/treasury-management-icon-transparent.dim_48x48.png',
    '/assets/generated/token-distribution-icon-transparent.dim_48x48.png',
    '/assets/generated/proposal-voting-icon-transparent.dim_48x48.png',
  ];

  const responsibilityTitles = [
    t.council.membershipOversight,
    t.council.treasuryManagement,
    t.council.tokenDistribution,
    t.council.proposalVoting,
  ];

  const responsibilityDescriptions = [
    t.council.membershipOversightDesc,
    t.council.treasuryManagementDesc,
    t.council.tokenDistributionDesc,
    t.council.proposalVotingDesc,
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <img
                src="/assets/generated/council-dashboard-icon-transparent.dim_64x64.png"
                alt={t.council.title}
                className="h-12 w-12"
              />
            </div>
            <div>
              <CardTitle className="text-3xl">{t.council.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {t.council.subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Last Council Update Indicator with Recalculate Button */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.council.lastUpdate}</p>
                <p className="text-lg font-semibold text-foreground">
                  {councilDashboard.lastCouncilUpdate > 0n 
                    ? formatTimestamp(councilDashboard.lastCouncilUpdate)
                    : t.council.notYetUpdated}
                </p>
              </div>
            </div>
            {!isCheckingEligibility && isEligibleToPropose && (
              <Button 
                onClick={handleRecalculateCouncil}
                disabled={recalculateCouncil.isPending}
                variant="default"
              >
                {recalculateCouncil.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {t.council.recalculateButton}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Council Members with Average REP */}
      {councilMembers && councilMembers.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t.council.currentMembers}
            </CardTitle>
            <CardDescription>{t.council.currentMembersDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {councilMembers.map((member, index) => {
                const avgREP = getAverageREPForMember(member.toString());
                return (
                  <div key={member.toString()} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <Badge variant="default" className="bg-amber-600">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-mono text-sm">{member.toString().slice(0, 20)}...</p>
                        <p className="text-xs text-muted-foreground">{t.council.councilMember}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{avgREP.toString()} REP</p>
                      <p className="text-xs text-muted-foreground">{t.council.weekAverage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multi-Signature Actions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/multisig-approval-icon-transparent.dim_48x48.png"
              alt={t.council.multiSigActions}
              className="h-10 w-10"
            />
            <div>
              <h2 className="text-2xl font-bold">{t.council.multiSigActions}</h2>
              <p className="text-sm text-muted-foreground">{t.council.multiSigDesc}</p>
            </div>
          </div>
          {/* Show button when eligibility is determined and user is eligible */}
          {!isCheckingEligibility && isEligibleToPropose && (
            <Button onClick={() => setShowProposeForm(!showProposeForm)} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              {t.council.proposeAction}
            </Button>
          )}
          {/* Show loading state while checking eligibility */}
          {isCheckingEligibility && (
            <Button variant="default" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t.common.loading}
            </Button>
          )}
        </div>

        {/* Propose Action Form */}
        {showProposeForm && !isCheckingEligibility && isEligibleToPropose && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle>{t.council.proposeNewAction}</CardTitle>
              <CardDescription>{t.council.proposeNewActionDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="actionId">{t.council.actionId}</Label>
                <Input
                  id="actionId"
                  placeholder={t.council.actionIdPlaceholder}
                  value={actionId}
                  onChange={(e) => setActionId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actionDetails">{t.council.actionDetails}</Label>
                <Textarea
                  id="actionDetails"
                  placeholder={t.council.actionDetailsPlaceholder}
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleProposeAction} 
                  disabled={proposeAction.isPending}
                >
                  {proposeAction.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t.council.submitProposal}
                </Button>
                <Button variant="outline" onClick={() => setShowProposeForm(false)}>
                  {t.common.cancel}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t.council.pendingActions}
            </CardTitle>
            <CardDescription>{t.council.pendingActionsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !pendingActions || pendingActions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t.council.noPendingActions}</p>
            ) : (
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <Card key={action.actionId} className="border-amber-200 dark:border-amber-900/30">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{action.actionId}</h4>
                              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                                {t.council.pending}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{action.details}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{t.council.proposed}: {formatTimestamp(action.timestamp)}</span>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {action.approvals.length}/5 {t.council.approvals}
                              </span>
                            </div>
                          </div>
                          {!isCheckingEligibility && isEligibleToPropose && !hasUserApproved(action) && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveAction(action.actionId)}
                              disabled={approveAction.isPending}
                            >
                              {approveAction.isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                              {t.council.approve}
                            </Button>
                          )}
                          {hasUserApproved(action) && (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {t.council.youApproved}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {t.council.approvedActions}
            </CardTitle>
            <CardDescription>{t.council.approvedActionsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingApproved ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !approvedActions || approvedActions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t.council.noApprovedActions}</p>
            ) : (
              <div className="space-y-4">
                {approvedActions.map((action) => (
                  <Card key={action.actionId} className="border-green-200 dark:border-green-900/30">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{action.actionId}</h4>
                              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                {t.council.approved}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{action.details}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{t.council.proposed}: {formatTimestamp(action.timestamp)}</span>
                              {action.completionTimestamp && (
                                <span>{t.council.completed}: {formatTimestamp(action.completionTimestamp)}</span>
                              )}
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                {action.approvals.length}/5 {t.council.approvals}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Council Responsibilities Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {councilDashboard.responsibilities.map((_, index) => {
          const IconComponent = panelIcons[index]?.icon || Users;
          const iconColor = panelIcons[index]?.color || 'text-primary';
          const iconBg = panelIcons[index]?.bg || 'bg-primary/10';
          const panelImage = panelImages[index];
          const title = responsibilityTitles[index];
          const description = responsibilityDescriptions[index];

          return (
            <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${iconBg}`}>
                    {panelImage ? (
                      <img
                        src={panelImage}
                        alt={title}
                        className="h-12 w-12"
                      />
                    ) : (
                      <IconComponent className={`h-12 w-12 ${iconColor}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription className="mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{t.council.status}: {t.council.comingSoon}</span>
                  <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">
                    {t.council.placeholder}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Information Card */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">{t.council.privilegesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.council.privilegeMultisig}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.council.privilegeVoting}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.council.privilegeMembership}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.council.privilegeRecalculate}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

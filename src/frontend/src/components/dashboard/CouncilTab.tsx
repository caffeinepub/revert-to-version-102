import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Crown, Users, Shield, CheckCircle2, Clock, TrendingUp, Award } from 'lucide-react';
import { useGetCouncilDashboard, useGetPendingCouncilActions, useProposeCouncilAction, useApproveCouncilAction, useIsCouncilMember, useIsCallerAdmin, useRecalculateCouncilByAverageREP, useGetCouncilMembers, useGetAverageREPForAllMembers } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CouncilTab() {
  const { t } = useLanguage();
  const { data: dashboard, isLoading: dashboardLoading } = useGetCouncilDashboard();
  const { data: pendingActions, isLoading: actionsLoading } = useGetPendingCouncilActions();
  const { data: isCouncilMember, isLoading: memberLoading } = useIsCouncilMember();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: councilMembers } = useGetCouncilMembers();
  const { data: averageREPData } = useGetAverageREPForAllMembers();
  const proposeAction = useProposeCouncilAction();
  const approveAction = useApproveCouncilAction();
  const recalculateCouncil = useRecalculateCouncilByAverageREP();

  const [actionId, setActionId] = useState('');
  const [actionDetails, setActionDetails] = useState('');

  const handleProposeAction = async () => {
    if (!actionId.trim() || !actionDetails.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await proposeAction.mutateAsync({ actionId, details: actionDetails });
      toast.success('Action proposed successfully');
      setActionId('');
      setActionDetails('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to propose action');
    }
  };

  const handleApproveAction = async (id: string) => {
    try {
      await approveAction.mutateAsync(id);
      toast.success(t.toast.actionApproved);
    } catch (error: any) {
      toast.error(error.message || t.toast.approveError);
    }
  };

  const handleRecalculateCouncil = async () => {
    try {
      await recalculateCouncil.mutateAsync();
      toast.success('Council recalculated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to recalculate council');
    }
  };

  const formatLastUpdate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString();
  };

  if (dashboardLoading || actionsLoading || memberLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isCouncilMember && !isAdmin) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-sm text-muted-foreground">
            Only council members and admins can access this section.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Council Dashboard Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <img
                src="/assets/generated/council-dashboard-icon-transparent.dim_64x64.png"
                alt={t.council.title}
                className="h-12 w-12"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">{t.council.title}</CardTitle>
              <CardDescription>{t.council.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        {dashboard && (
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t.council.lastUpdate}</p>
                <p className="font-semibold">{formatLastUpdate(dashboard.lastCouncilUpdate)}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Council Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t.council.currentMembers}</CardTitle>
              <CardDescription>{t.council.currentMembersDesc}</CardDescription>
            </div>
            <Badge variant="secondary">
              <Users className="h-4 w-4 mr-1" />
              {councilMembers?.length || 0}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {councilMembers && councilMembers.length > 0 ? (
              councilMembers.map((member, index) => {
                const memberREP = averageREPData?.find(([p]) => p.toString() === member.toString());
                return (
                  <div
                    key={member.toString()}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Crown className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Council Member {index + 1}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {member.toString().slice(0, 20)}...
                        </p>
                      </div>
                    </div>
                    {memberREP && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">{memberREP[1].toString()} Avg REP</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No council members yet
              </p>
            )}
          </div>
          {(isAdmin || isCouncilMember) && (
            <div className="mt-4">
              <Button
                onClick={handleRecalculateCouncil}
                disabled={recalculateCouncil.isPending}
                variant="outline"
                className="w-full"
              >
                {recalculateCouncil.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recalculating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {t.council.recalculateButton}
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsibilities */}
      {dashboard && (
        <Card>
          <CardHeader>
            <CardTitle>Council Responsibilities</CardTitle>
            <CardDescription>Key areas of oversight and governance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.responsibilities.map((responsibility, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                >
                  <img
                    src={`/assets/generated/${responsibility.toLowerCase().replace(/\s+/g, '-')}-icon-transparent.dim_48x48.png`}
                    alt={responsibility}
                    className="h-8 w-8 mt-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="font-semibold">{responsibility}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multi-Signature Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t.council.multiSigActions}</CardTitle>
          <CardDescription>Propose and approve council actions requiring multiple signatures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Propose New Action */}
          <div className="space-y-4 p-4 rounded-lg border">
            <h3 className="font-semibold">{t.council.proposeAction}</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="actionId">{t.council.actionId}</Label>
                <Input
                  id="actionId"
                  value={actionId}
                  onChange={(e) => setActionId(e.target.value)}
                  placeholder={t.council.actionIdPlaceholder}
                />
              </div>
              <div>
                <Label htmlFor="actionDetails">{t.council.actionDetails}</Label>
                <Textarea
                  id="actionDetails"
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  placeholder={t.council.actionDetailsPlaceholder}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleProposeAction}
                disabled={proposeAction.isPending}
                className="w-full"
              >
                {proposeAction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Proposing...
                  </>
                ) : (
                  'Propose Action'
                )}
              </Button>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold">{t.council.pendingActions}</h3>
            {pendingActions && pendingActions.length > 0 ? (
              pendingActions.map((action) => (
                <div
                  key={action.actionId}
                  className="p-4 rounded-lg border space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{action.actionId}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.details}
                      </p>
                    </div>
                    {action.isExecuted ? (
                      <Badge variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Executed
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {t.council.pending}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {t.council.approvals}: {action.approvals.length} / 3
                    </div>
                    {!action.isExecuted && (
                      <Button
                        onClick={() => handleApproveAction(action.actionId)}
                        disabled={approveAction.isPending}
                        size="sm"
                      >
                        {approveAction.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          t.council.approve
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {t.council.noPendingActions}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

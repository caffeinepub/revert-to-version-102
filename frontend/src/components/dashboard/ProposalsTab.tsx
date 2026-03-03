import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Plus, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useGetAllProposals, useCreateProposal, useApproveProposal, useRejectProposal, useGetCallerCategory, useIsCouncilMember, useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { UserCategory, ProposalStatus } from '../../backend';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProposalsTab() {
  const { t } = useLanguage();
  const { data: proposals, isLoading, error } = useGetAllProposals();
  const { data: userCategory, isLoading: loadingCategory } = useGetCallerCategory();
  const { data: isCouncilMember, isLoading: loadingCouncil } = useIsCouncilMember();
  const { data: isAdmin, isLoading: loadingAdmin } = useIsCallerAdmin();
  const { identity } = useInternetIdentity();

  const createProposal = useCreateProposal();
  const approveProposal = useApproveProposal();
  const rejectProposal = useRejectProposal();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Check if user is Active Member
  const isActiveMember = userCategory === UserCategory.activeMember;

  // Check if user can vote on proposals (Council Members or Admins who are also Active Members)
  const canVoteOnProposal = isActiveMember && (isCouncilMember || isAdmin);

  const isCheckingPermissions = loadingCategory || loadingCouncil || loadingAdmin;

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const hasUserApproved = (proposal: any) => {
    if (!identity) return false;
    const userPrincipal = identity.getPrincipal().toString();
    return proposal.approvals.some((p: any) => p.toString() === userPrincipal);
  };

  const hasUserRejected = (proposal: any) => {
    if (!identity) return false;
    const userPrincipal = identity.getPrincipal().toString();
    return proposal.rejections.some((p: any) => p.toString() === userPrincipal);
  };

  const handleCreateProposal = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error(t.proposals.titleAndDescriptionRequired);
      return;
    }

    try {
      await createProposal.mutateAsync({ title: title.trim(), description: description.trim() });
      toast.success(t.proposals.createSuccess);
      setTitle('');
      setDescription('');
      setShowCreateForm(false);
    } catch (error: any) {
      toast.error(error.message || t.proposals.createError);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveProposal.mutateAsync(id);
      toast.success(t.proposals.approveSuccess);
    } catch (error: any) {
      toast.error(error.message || t.proposals.approveError);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectProposal.mutateAsync(id);
      toast.success(t.proposals.rejectSuccess);
    } catch (error: any) {
      toast.error(error.message || t.proposals.rejectError);
    }
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.pending:
        return (
          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            {t.proposals.statusPending}
          </Badge>
        );
      case ProposalStatus.accepted:
        return (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {t.proposals.statusAccepted}
          </Badge>
        );
      case ProposalStatus.rejected:
        return (
          <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            {t.proposals.statusRejected}
          </Badge>
        );
    }
  };

  if (isLoading || isCheckingPermissions) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show access denied message for non-Active Members
  if (!isActiveMember) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <img
                  src="/assets/generated/proposal-icon-transparent.dim_64x64.png"
                  alt={t.proposals.title}
                  className="h-12 w-12"
                />
              </div>
              <div>
                <CardTitle className="text-3xl">{t.proposals.title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {t.proposals.subtitle}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Alert variant="destructive" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
            {t.proposals.accessDenied}
          </AlertDescription>
        </Alert>

        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-lg">{t.proposals.infoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <p className="text-sm text-muted-foreground">
                {t.proposals.infoCreate}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <p className="text-sm text-muted-foreground">
                {t.proposals.infoApprove}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <p className="text-sm text-muted-foreground">
                {t.proposals.infoMultisig}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
              <p className="text-sm text-muted-foreground">
                {t.proposals.infoNotifications}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t.proposals.errorLoading}</AlertDescription>
      </Alert>
    );
  }

  // Sort proposals: pending first, then by timestamp (newest first)
  const sortedProposals = [...(proposals || [])].sort((a, b) => {
    if (a.status === ProposalStatus.pending && b.status !== ProposalStatus.pending) return -1;
    if (a.status !== ProposalStatus.pending && b.status === ProposalStatus.pending) return 1;
    return Number(b.timestamp - a.timestamp);
  });

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <img
                  src="/assets/generated/proposal-icon-transparent.dim_64x64.png"
                  alt={t.proposals.title}
                  className="h-12 w-12"
                />
              </div>
              <div>
                <CardTitle className="text-3xl">{t.proposals.title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {t.proposals.subtitle}
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              {t.proposals.createButton}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Create Proposal Form */}
      {showCreateForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>{t.proposals.createTitle}</CardTitle>
            <CardDescription>{t.proposals.createDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t.proposals.titleLabel}</Label>
              <Input
                id="title"
                placeholder={t.proposals.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.proposals.descriptionLabel}</Label>
              <Textarea
                id="description"
                placeholder={t.proposals.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateProposal} 
                disabled={createProposal.isPending}
              >
                {createProposal.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t.proposals.submitButton}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                {t.common.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {!sortedProposals || sortedProposals.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">{t.proposals.noProposals}</p>
                <p className="text-sm text-muted-foreground">{t.proposals.noProposalsDesc}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          sortedProposals.map((proposal) => (
            <Card key={proposal.id} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{proposal.title}</h3>
                        {getStatusBadge(proposal.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">
                        {proposal.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{t.proposals.author}: {proposal.author.toString().slice(0, 20)}...</span>
                        <span>{t.proposals.submitted}: {formatDate(proposal.timestamp)}</span>
                        {proposal.status === ProposalStatus.pending && (
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {proposal.approvals.length}/3 {t.proposals.approvals}
                          </span>
                        )}
                        {proposal.status !== ProposalStatus.pending && proposal.completionTimestamp && (
                          <span>{t.proposals.completed}: {formatDate(proposal.completionTimestamp)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Council/Admin who are Active Members */}
                  {proposal.status === ProposalStatus.pending && canVoteOnProposal && (
                    <div className="flex gap-2 pt-2 border-t">
                      {!hasUserApproved(proposal) && !hasUserRejected(proposal) && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(proposal.id)}
                            disabled={approveProposal.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {approveProposal.isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {t.proposals.approveButton}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(proposal.id)}
                            disabled={rejectProposal.isPending}
                          >
                            {rejectProposal.isPending && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                            <XCircle className="h-3 w-3 mr-1" />
                            {t.proposals.rejectButton}
                          </Button>
                        </>
                      )}
                      {hasUserApproved(proposal) && (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {t.proposals.youApproved}
                        </Badge>
                      )}
                      {hasUserRejected(proposal) && (
                        <Badge variant="secondary" className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                          <XCircle className="h-3 w-3 mr-1" />
                          {t.proposals.youRejected}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Information Card */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">{t.proposals.infoTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.proposals.infoCreate}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.proposals.infoApprove}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.proposals.infoMultisig}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
            <p className="text-sm text-muted-foreground">
              {t.proposals.infoNotifications}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

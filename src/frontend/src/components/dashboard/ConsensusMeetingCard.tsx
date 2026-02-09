import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Clock, Users, CheckCircle2, AlertCircle, Zap, ShieldAlert } from 'lucide-react';
import { ConsensusPhase, type ConsensusMeetingView } from '../../types/backend-extensions';
import { UserCategory, type UserProfile } from '../../backend';
import {
  useJoinConsensusMeeting,
  useAdvancePhase,
  useForceAdvancePhase,
  useIsCallerAdmin,
  useGetCallerCategory,
} from '../../hooks/useQueries';
import { toast } from 'sonner';
import ContributionForm from './ContributionForm';
import RankingForm from './RankingForm';
import MeetingResults from './MeetingResults';
import { useLanguage } from '../../contexts/LanguageContext';

interface ConsensusMeetingCardProps {
  meeting: ConsensusMeetingView;
  userProfile: UserProfile | null | undefined;
}

export default function ConsensusMeetingCard({ meeting, userProfile }: ConsensusMeetingCardProps) {
  const { t } = useLanguage();
  const signUpMutation = useJoinConsensusMeeting();
  const nextPhaseMutation = useAdvancePhase();
  const forceNextPhaseMutation = useForceAdvancePhase();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: userCategory, isLoading: categoryLoading } = useGetCallerCategory();

  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const isParticipant = userProfile
    ? meeting.participants.some(p => p.toString() === userProfile.principal.toString())
    : false;

  const userGroup = meeting.groups.find(group =>
    group.members.some(m => m.toString() === userProfile?.principal.toString())
  );

  const hasSubmittedContribution = userGroup
    ? userGroup.contributions.some(([p]) => p.toString() === userProfile?.principal.toString())
    : false;

  const hasSubmittedRanking = userGroup
    ? userGroup.rankings.some(([p]) => p.toString() === userProfile?.principal.toString())
    : false;

  const isNonMember = userCategory === UserCategory.nonMember;
  const canSignUp = meeting.phase === ConsensusPhase.signup && !isParticipant && !isNonMember;

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const endTime = Number(meeting.phaseEndTime) / 1_000_000;
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining(t.consensus.phaseExpired || 'Phase time expired');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [meeting.phaseEndTime, t]);

  const handleSignUp = async () => {
    try {
      await signUpMutation.mutateAsync(meeting.id);
      toast.success(t.toast.signUpSuccess);
    } catch (error: any) {
      const errorMessage = error.message || t.toast.signUpError;
      toast.error(errorMessage);
    }
  };

  const handleNextPhase = async () => {
    try {
      await nextPhaseMutation.mutateAsync(meeting.id);
      toast.success(t.consensus.phaseAdvanced || 'Phase advanced successfully!');
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const handleForceNextPhase = async () => {
    try {
      await forceNextPhaseMutation.mutateAsync(meeting.id);
      toast.success(t.consensus.phaseForced || 'Phase forced to next stage!');
    } catch (error: any) {
      toast.error(error.message || t.common.error);
    }
  };

  const getPhaseLabel = (phase: ConsensusPhase) => {
    switch (phase) {
      case ConsensusPhase.signup:
        return t.consensus.signUp;
      case ConsensusPhase.contribution:
        return t.consensus.contribution;
      case ConsensusPhase.ranking:
        return t.consensus.ranking;
      case ConsensusPhase.finalize:
        return t.consensus.finalized;
      default:
        return 'Unknown Phase';
    }
  };

  const getPhaseProgress = () => {
    switch (meeting.phase) {
      case ConsensusPhase.signup:
        return 25;
      case ConsensusPhase.contribution:
        return 50;
      case ConsensusPhase.ranking:
        return 75;
      case ConsensusPhase.finalize:
        return 100;
      default:
        return 0;
    }
  };

  const canAdvancePhase = () => {
    const now = Date.now();
    const endTime = Number(meeting.phaseEndTime) / 1_000_000;
    return now >= endTime && isParticipant;
  };

  const canForcePhase = () => {
    return isAdmin && meeting.phase !== ConsensusPhase.finalize;
  };

  const getNextPhaseButtonText = () => {
    switch (meeting.phase) {
      case ConsensusPhase.signup:
        return t.consensus.advanceToContribution || 'Advance to Contribution Phase';
      case ConsensusPhase.contribution:
        return t.consensus.advanceToRanking || 'Advance to Ranking Phase';
      case ConsensusPhase.ranking:
        return t.consensus.finalizeMeeting || 'Finalize Meeting';
      default:
        return t.consensus.nextPhase;
    }
  };

  if (categoryLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Meeting Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{meeting.id}</CardTitle>
              <CardDescription className="mt-2">
                {getPhaseLabel(meeting.phase)}
              </CardDescription>
            </div>
            <Badge variant={meeting.phase === ConsensusPhase.finalize ? 'secondary' : 'default'}>
              {getPhaseLabel(meeting.phase)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t.consensus.progress || 'Progress'}</span>
              <span className="font-medium">{getPhaseProgress()}%</span>
            </div>
            <Progress value={getPhaseProgress()} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t.consensus.timeRemaining || 'Time Remaining'}</p>
                <p className="font-semibold">{timeRemaining}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">{t.consensus.participants}</p>
                <p className="font-semibold">{meeting.participants.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              {isParticipant ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">{t.consensus.status || 'Status'}</p>
                <p className="font-semibold">{isParticipant ? t.consensus.enrolled || 'Enrolled' : t.consensus.notEnrolled || 'Not Enrolled'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase-specific content */}
      {meeting.phase === ConsensusPhase.signup && (
        <Card>
          <CardHeader>
            <CardTitle>{t.consensus.signUpForMeeting || 'Sign Up for Meeting'}</CardTitle>
            <CardDescription>
              {t.consensus.joinMeetingDesc}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isNonMember ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900 dark:text-red-100">{t.consensus.membershipRequired}</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {t.consensus.membershipRequiredDesc}
                  </p>
                </div>
              </div>
            ) : canSignUp ? (
              <Button onClick={handleSignUp} disabled={signUpMutation.isPending} className="w-full">
                {signUpMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.consensus.signingUp}
                  </>
                ) : (
                  t.consensus.signUpButton
                )}
              </Button>
            ) : isParticipant ? (
              <div className="text-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">{t.consensus.signedUp}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.consensus.signedUpDesc}
                </p>
              </div>
            ) : null}

            <div className="flex gap-2">
              {canAdvancePhase() && meeting.participants.length >= 3 && (
                <Button
                  onClick={handleNextPhase}
                  disabled={nextPhaseMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  {nextPhaseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.consensus.advancing || 'Advancing...'}
                    </>
                  ) : (
                    getNextPhaseButtonText()
                  )}
                </Button>
              )}
              {canForcePhase() && (
                <Button
                  onClick={handleForceNextPhase}
                  disabled={forceNextPhaseMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {forceNextPhaseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.consensus.forcing || 'Forcing...'}
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      {t.consensus.forceNextPhase}
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {meeting.phase === ConsensusPhase.contribution && isParticipant && (
        <ContributionForm
          meeting={meeting}
          userProfile={userProfile}
          hasSubmitted={hasSubmittedContribution}
          userGroup={userGroup}
        />
      )}

      {meeting.phase === ConsensusPhase.ranking && isParticipant && (
        <RankingForm
          meeting={meeting}
          userProfile={userProfile}
          hasSubmitted={hasSubmittedRanking}
          userGroup={userGroup}
        />
      )}

      {meeting.phase === ConsensusPhase.finalize && (
        <MeetingResults meeting={meeting} userProfile={userProfile} />
      )}

      {/* Phase Transition Buttons for Contribution and Ranking phases */}
      {(meeting.phase === ConsensusPhase.contribution || meeting.phase === ConsensusPhase.ranking) &&
        isParticipant && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                {(meeting.phase === ConsensusPhase.ranking || canAdvancePhase()) && (
                  <Button
                    onClick={handleNextPhase}
                    disabled={nextPhaseMutation.isPending}
                    className="flex-1"
                  >
                    {nextPhaseMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.consensus.advancing || 'Advancing...'}
                      </>
                    ) : (
                      getNextPhaseButtonText()
                    )}
                  </Button>
                )}
                {canForcePhase() && (
                  <Button
                    onClick={handleForceNextPhase}
                    disabled={forceNextPhaseMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    {forceNextPhaseMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.consensus.forcing || 'Forcing...'}
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        {t.consensus.forceNextPhase}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

import { useState } from 'react';
import { useGetAllConsensusMeetings, useGetCallerUserProfile, useSignUpForConsensusMeeting, useIsCallerAdmin, useGetCallerCategory } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Users, TrendingUp, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { ConsensusPhase } from '../../types/backend-extensions';
import { UserCategory } from '../../backend';
import ConsensusMeetingCard from './ConsensusMeetingCard';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ConsensusMeetingsTab() {
  const { t } = useLanguage();
  const { data: meetings, isLoading } = useGetAllConsensusMeetings();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: userCategory, isLoading: categoryLoading } = useGetCallerCategory();
  const signUpMutation = useSignUpForConsensusMeeting();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const activeMeeting = meetings?.find(m => m.phase !== ConsensusPhase.finalize);
  const pastMeetings = meetings?.filter(m => m.phase === ConsensusPhase.finalize) || [];

  const isParticipant = activeMeeting && userProfile
    ? activeMeeting.participants.some(p => p.toString() === userProfile.principal.toString())
    : false;

  const isNonMember = userCategory === UserCategory.nonMember;
  const canSignUp = activeMeeting && activeMeeting.phase === ConsensusPhase.signup && !isParticipant && !isNonMember;

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
        return 'Unknown';
    }
  };

  const getPhaseVariant = (phase: ConsensusPhase): 'default' | 'secondary' | 'outline' => {
    switch (phase) {
      case ConsensusPhase.signup:
        return 'default';
      case ConsensusPhase.contribution:
        return 'default';
      case ConsensusPhase.ranking:
        return 'default';
      case ConsensusPhase.finalize:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleSignUp = async () => {
    if (!activeMeeting) return;
    try {
      await signUpMutation.mutateAsync(activeMeeting.id);
      toast.success(t.toast.signUpSuccess);
    } catch (error: any) {
      const errorMessage = error.message || t.toast.signUpError;
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = () => {
    if (!activeMeeting) return;
    if (isParticipant || isAdmin) {
      setSelectedMeetingId(activeMeeting.id);
    } else {
      toast.error(t.consensus.notParticipatingDesc);
    }
  };

  if (isLoading || categoryLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (selectedMeetingId) {
    const meeting = meetings?.find(m => m.id === selectedMeetingId);
    if (meeting) {
      return (
        <div>
          <Button variant="outline" onClick={() => setSelectedMeetingId(null)} className="mb-4">
            ← {t.common.back}
          </Button>
          <ConsensusMeetingCard meeting={meeting} userProfile={userProfile} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <img
                src="/assets/generated/consensus-meeting-icon-transparent.dim_64x64.png"
                alt={t.consensus.title}
                className="h-12 w-12"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">{t.consensus.title}</CardTitle>
              <CardDescription>{t.consensus.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t.consensus.subtitle}
          </p>
        </CardContent>
      </Card>

      {activeMeeting ? (
        <Card className="border-accent/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{t.consensus.activeMeeting}</CardTitle>
                <CardDescription className="mt-2">
                  {activeMeeting.id}
                </CardDescription>
              </div>
              <Badge variant={getPhaseVariant(activeMeeting.phase)}>
                {getPhaseLabel(activeMeeting.phase)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.phase}</p>
                  <p className="font-semibold">{getPhaseLabel(activeMeeting.phase)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.participants}</p>
                  <p className="font-semibold">{activeMeeting.participants.length}</p>
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
            ) : (
              <div className="flex gap-2">
                {canSignUp && (
                  <Button onClick={handleSignUp} disabled={signUpMutation.isPending} className="flex-1">
                    {signUpMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.consensus.signingUp}
                      </>
                    ) : (
                      t.consensus.signUpButton
                    )}
                  </Button>
                )}
                <Button onClick={handleViewDetails} variant="outline" className="flex-1">
                  View Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No Active Meeting</p>
            <p className="text-sm text-muted-foreground">
              There are currently no active consensus meetings. Check back later.
            </p>
          </CardContent>
        </Card>
      )}

      {pastMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.consensus.pastMeetings}</CardTitle>
            <CardDescription>
              {t.consensus.pastMeetingsDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMeetingId(meeting.id)}
                >
                  <div>
                    <p className="font-semibold">{meeting.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.participants.length} {t.consensus.participants}
                    </p>
                  </div>
                  <Badge variant="secondary">{t.consensus.finalized}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

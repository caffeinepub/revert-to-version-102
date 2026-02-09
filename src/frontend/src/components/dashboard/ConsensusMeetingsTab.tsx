import { useState } from 'react';
import { useGetAllConsensusMeetings, useGetCallerUserProfile, useJoinConsensusMeeting, useIsCallerAdmin, useGetCallerCategory } from '../../hooks/useQueries';
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
  const signUpMutation = useJoinConsensusMeeting();
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
            <div className="p-2 rounded-lg bg-primary/10">
              <img
                src="/assets/generated/consensus-meeting-icon-transparent.dim_64x64.png"
                alt={t.consensus.title}
                className="h-6 w-6"
              />
            </div>
            <div>
              <CardTitle>{t.consensus.title}</CardTitle>
              <CardDescription>
                {t.consensus.subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Meeting */}
      {activeMeeting && (
        <Card className="border-accent/30">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  {t.consensus.activeMeeting}: {activeMeeting.id}
                </CardTitle>
                <CardDescription className="mt-2">
                  {t.consensus.currentPhase}: <Badge variant={getPhaseVariant(activeMeeting.phase)}>{getPhaseLabel(activeMeeting.phase)}</Badge>
                </CardDescription>
              </div>
              {(isParticipant || isAdmin) && (
                <Button onClick={handleViewDetails}>
                  {t.common.viewDetails}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.participants}</p>
                  <p className="text-2xl font-bold">{activeMeeting.participants.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <TrendingUp className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.groups}</p>
                  <p className="text-2xl font-bold">{activeMeeting.groups.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.phase}</p>
                  <p className="text-lg font-semibold">{getPhaseLabel(activeMeeting.phase)}</p>
                </div>
              </div>
            </div>

            {/* Sign-up section for non-participants during signup phase */}
            {activeMeeting.phase === ConsensusPhase.signup && (
              <div className="pt-4 border-t">
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
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 dark:text-blue-100">{t.consensus.joinMeeting}</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          {t.consensus.joinMeetingDesc}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSignUp} 
                      disabled={signUpMutation.isPending} 
                      className="w-full"
                      size="lg"
                    >
                      {signUpMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.consensus.signingUp}
                        </>
                      ) : (
                        t.consensus.signUpButton
                      )}
                    </Button>
                  </div>
                ) : isParticipant ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">{t.consensus.signedUp}</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {t.consensus.signedUpDesc}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Status for other phases */}
            {activeMeeting.phase !== ConsensusPhase.signup && (
              <div className="pt-4 border-t">
                {isParticipant ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">{t.consensus.signedUp}</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {t.common.viewDetails} {getPhaseLabel(activeMeeting.phase).toLowerCase()}.
                      </p>
                    </div>
                  </div>
                ) : isAdmin ? (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">{t.consensus.adminView}</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {getPhaseLabel(activeMeeting.phase)} {t.consensus.adminViewDesc}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">{t.consensus.notParticipating}</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        {t.consensus.notParticipatingDesc}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.consensus.pastMeetings}</CardTitle>
            <CardDescription>{t.consensus.pastMeetingsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{meeting.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.participants.length} {t.consensus.participants} • {meeting.groups.length} {t.consensus.groups}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMeetingId(meeting.id)}>
                    {t.consensus.viewResults}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!activeMeeting && pastMeetings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <img
              src="/assets/generated/consensus-meeting-icon-transparent.dim_64x64.png"
              alt={t.consensus.noMeetings}
              className="h-16 w-16 mx-auto mb-4 opacity-50"
            />
            <p className="text-muted-foreground">{t.consensus.noMeetings}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t.consensus.noMeetingsDesc}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

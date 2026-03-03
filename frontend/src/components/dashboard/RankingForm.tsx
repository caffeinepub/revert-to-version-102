import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, GripVertical } from 'lucide-react';
import type { ConsensusMeetingView, GroupView, Ranking } from '../../types/backend-extensions';
import type { UserProfile } from '../../backend';
import { useSubmitRanking, useGetAllMembers } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Principal } from '@icp-sdk/core/principal';
import { useLanguage } from '../../contexts/LanguageContext';

interface RankingFormProps {
  meeting: ConsensusMeetingView;
  userProfile: UserProfile | null | undefined;
  hasSubmitted: boolean;
  userGroup: GroupView | undefined;
}

export default function RankingForm({
  meeting,
  userProfile,
  hasSubmitted,
  userGroup,
}: RankingFormProps) {
  const { t } = useLanguage();
  const submitMutation = useSubmitRanking();
  const { data: allProfiles } = useGetAllMembers();
  const [rankedMembers, setRankedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (userGroup) {
      setRankedMembers(userGroup.members.map(m => m.toString()));
    }
  }, [userGroup]);

  const getUsernameByPrincipal = (principal: string) => {
    const profile = allProfiles?.find(p => p.principal.toString() === principal);
    return profile?.username || t.consensus.unknownUser || 'Unknown User';
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRanked = [...rankedMembers];
    [newRanked[index - 1], newRanked[index]] = [newRanked[index], newRanked[index - 1]];
    setRankedMembers(newRanked);
  };

  const moveDown = (index: number) => {
    if (index === rankedMembers.length - 1) return;
    const newRanked = [...rankedMembers];
    [newRanked[index], newRanked[index + 1]] = [newRanked[index + 1], newRanked[index]];
    setRankedMembers(newRanked);
  };

  const handleSubmit = async () => {
    try {
      const rankings: Ranking[] = rankedMembers.map((principalStr, index) => ({
        participant: Principal.fromText(principalStr),
        rank: BigInt(index + 1),
      }));

      await submitMutation.mutateAsync({
        meetingId: meeting.id,
        rankings,
      });

      toast.success(t.toast.rankingSuccess);
    } catch (error: any) {
      toast.error(error.message || t.toast.rankingError);
    }
  };

  if (!userGroup) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t.consensus.noGroupAssigned || 'You are not assigned to a group yet.'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Contributions for Reference */}
      <Card>
        <CardHeader>
          <CardTitle>{t.consensus.groupContributions}</CardTitle>
          <CardDescription>{t.consensus.reviewContributions || 'Review contributions before ranking'}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {userGroup.contributions.map(([principal, contribution], index) => (
                <div key={principal.toString()}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="font-semibold">
                      {getUsernameByPrincipal(principal.toString())}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{contribution.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ranking Form */}
      {!hasSubmitted ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/ranking-icon-transparent.dim_64x64.png"
                alt={t.consensus.rankMembers}
                className="h-6 w-6"
              />
              <div>
                <CardTitle>{t.consensus.rankMembers}</CardTitle>
                <CardDescription>
                  {t.consensus.rankMembersDesc}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t.consensus.rankingOrder || 'Ranking Order (Drag to reorder)'}</Label>
              <div className="space-y-2">
                {rankedMembers.map((principalStr, index) => (
                  <div
                    key={principalStr}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ▲
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDown(index)}
                          disabled={index === rankedMembers.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ▼
                        </Button>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div className="font-medium">
                        {getUsernameByPrincipal(principalStr)}
                      </div>
                      {principalStr === userProfile?.principal.toString() && (
                        <span className="text-xs text-muted-foreground">({t.consensus.you || 'You'})</span>
                      )}
                    </div>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.consensus.submitting}
                </>
              ) : (
                t.consensus.submitRanking
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="font-semibold">{t.consensus.rankingsSubmitted || 'Rankings Submitted!'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.consensus.waitingForRankings || 'Waiting for other group members to submit their rankings.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Show submitted rankings count */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {userGroup.rankings.length} {t.consensus.of || 'of'} {userGroup.members.length} {t.consensus.membersSubmittedRankings || 'members have submitted rankings'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Coins, TrendingUp, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import type { ConsensusMeetingView } from '../../types/backend-extensions';
import type { UserProfile } from '../../backend';
import { useGetAllMembers, useGetTokenBalance } from '../../hooks/useQueries';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '../../contexts/LanguageContext';

interface MeetingResultsProps {
  meeting: ConsensusMeetingView;
  userProfile: UserProfile | null | undefined;
}

export default function MeetingResults({ meeting, userProfile }: MeetingResultsProps) {
  const { t } = useLanguage();
  const { data: allProfiles } = useGetAllMembers();
  const { data: tokenBalance } = useGetTokenBalance();

  const getUsernameByPrincipal = (principal: string) => {
    const profile = allProfiles?.find(p => p.principal.toString() === principal);
    return profile?.username || t.consensus.unknownUser || 'Unknown User';
  };

  const hasAnyConsensus = meeting.groups.some(group => group.consensusReached);
  const allGroupsHaveRankings = meeting.groups.every(group => group.rankings.length > 0);
  const someGroupsHaveRankings = meeting.groups.some(group => group.rankings.length > 0);

  const calculateExpectedRewards = () => {
    const REP_FIBONACCI_WEIGHTS = [144, 89, 55, 34, 21, 13];
    const PHIL_FIBONACCI_WEIGHTS = [987, 610, 377, 233, 144, 89];
    
    const rewards = new Map<string, { rep: number; phil: number }>();

    meeting.groups.forEach((group) => {
      if (group.consensusReached && group.rankings.length > 0) {
        const groupSize = group.members.length;
        
        const repWeighting = groupSize === 3 ? 144 :
                           groupSize === 4 ? 233 :
                           groupSize === 5 ? 377 :
                           groupSize === 6 ? 610 : 100;

        group.members.forEach(member => {
          const memberKey = member.toString();
          const current = rewards.get(memberKey) || { rep: 0, phil: 0 };
          rewards.set(memberKey, { ...current, rep: current.rep + repWeighting });
        });

        const allRankings = group.rankings.map(([_, rankings]) => rankings);
        if (allRankings.length > 0) {
          const consensusRanking = allRankings[0];
          
          consensusRanking.forEach((ranking, index) => {
            if (index < PHIL_FIBONACCI_WEIGHTS.length) {
              const memberKey = ranking.participant.toString();
              const philWeight = PHIL_FIBONACCI_WEIGHTS[index];
              const current = rewards.get(memberKey) || { rep: 0, phil: 0 };
              rewards.set(memberKey, { ...current, phil: current.phil + philWeight });
            }
          });
        }
      }
    });

    return rewards;
  };

  const expectedRewards = hasAnyConsensus ? calculateExpectedRewards() : new Map();
  const userRewards = userProfile ? expectedRewards.get(userProfile.principal.toString()) : null;

  const totalRep = Array.from(expectedRewards.values()).reduce((sum, r) => sum + r.rep, 0);
  const totalPhil = Array.from(expectedRewards.values()).reduce((sum, r) => sum + r.phil, 0);

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="border-accent/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/results-icon-transparent.dim_64x64.png"
              alt={t.consensus.results}
              className="h-8 w-8"
            />
            <div>
              <CardTitle>{t.consensus.results}</CardTitle>
              <CardDescription>
                {hasAnyConsensus
                  ? t.consensus.consensusReachedDesc || 'Consensus reached and tokens distributed'
                  : someGroupsHaveRankings
                  ? t.consensus.finalizationComplete || 'Finalization complete - consensus not reached'
                  : t.consensus.awaitingRankings || 'Finalization complete - awaiting rankings'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {hasAnyConsensus && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.totalREPDistributed || 'Total REP Distributed'}</p>
                  <p className="text-2xl font-bold">{totalRep}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10">
                <Coins className="h-6 w-6 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">{t.consensus.totalPHILDistributed || 'Total PHIL Distributed'}</p>
                  <p className="text-2xl font-bold">{totalPhil}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* User's Rewards */}
      {userRewards && (userRewards.rep > 0 || userRewards.phil > 0) && (
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              {t.consensus.yourRewards}
            </CardTitle>
            <CardDescription>
              {t.consensus.tokensAdded || 'Tokens have been added to your balance'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t.consensus.repEarned || 'REP Earned'}</p>
                <p className="text-3xl font-bold text-primary">{userRewards.rep}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t.consensus.philEarned || 'PHIL Earned'}</p>
                <p className="text-3xl font-bold text-accent">{userRewards.phil}</p>
              </div>
            </div>
            {tokenBalance && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">{t.consensus.currentBalance || 'Current Balance'}</p>
                <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">{Number(tokenBalance.rep)} REP</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-accent">{Number(tokenBalance.phil)} PHIL</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No consensus warning */}
      {!hasAnyConsensus && someGroupsHaveRankings && (
        <Alert variant="default" className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-900 dark:text-yellow-100">{t.consensus.consensusNotReached}</AlertTitle>
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            {t.consensus.noConsensusMessage || 'The meeting has been finalized, but no group reached consensus. Rankings were submitted but did not meet the consensus threshold. No REP or PHIL tokens were distributed.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Consensus success message */}
      {hasAnyConsensus && (
        <Alert variant="default" className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-900 dark:text-green-100">{t.consensus.consensusAchieved || 'Consensus Achieved!'}</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t.consensus.consensusSuccessMessage || 'One or more groups reached consensus. REP tokens have been distributed to all participants who reached consensus, and PHIL tokens have been distributed according to the agreed rankings.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Group Results */}
      {meeting.groups.map((group, groupIndex) => {
        const groupHasRankings = group.rankings.length > 0;
        const allMembersRanked = group.rankings.length === group.members.length;
        
        const groupRewards = new Map<string, { rep: number; phil: number }>();
        if (group.consensusReached && group.rankings.length > 0) {
          const REP_FIBONACCI_WEIGHTS = [144, 89, 55, 34, 21, 13];
          const PHIL_FIBONACCI_WEIGHTS = [987, 610, 377, 233, 144, 89];
          const groupSize = group.members.length;
          const repWeighting = groupSize === 3 ? 144 :
                             groupSize === 4 ? 233 :
                             groupSize === 5 ? 377 :
                             groupSize === 6 ? 610 : 100;

          group.members.forEach(member => {
            const memberKey = member.toString();
            groupRewards.set(memberKey, { rep: repWeighting, phil: 0 });
          });

          const consensusRanking = group.rankings[0][1];
          consensusRanking.forEach((ranking, index) => {
            if (index < PHIL_FIBONACCI_WEIGHTS.length) {
              const memberKey = ranking.participant.toString();
              const current = groupRewards.get(memberKey) || { rep: 0, phil: 0 };
              groupRewards.set(memberKey, { ...current, phil: PHIL_FIBONACCI_WEIGHTS[index] });
            }
          });
        }
        
        return (
          <Card key={groupIndex}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{t.consensus.group || 'Group'} {groupIndex + 1}</CardTitle>
                  <CardDescription>
                    {group.members.length} {t.consensus.members || 'members'} • {group.rankings.length} {t.consensus.rankingsSubmitted || 'rankings submitted'}
                    {allMembersRanked && ` • ${t.consensus.allParticipated || 'All members participated'}`}
                  </CardDescription>
                </div>
                <Badge variant={group.consensusReached ? 'default' : 'secondary'}>
                  {group.consensusReached ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t.consensus.consensusReached}
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      {t.consensus.noConsensus || 'No Consensus'}
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupHasRankings && !group.consensusReached && (
                  <Alert variant="default" className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {group.members.length === 3 && (
                        t.consensus.consensusRequirement3 || 'All 3 members must submit identical rankings for consensus.'
                      )}
                      {group.members.length >= 4 && group.members.length <= 5 && (
                        t.consensus.consensusRequirement45 || 'At least 3 members must submit identical rankings for consensus.'
                      )}
                      {group.members.length === 6 && (
                        t.consensus.consensusRequirement6 || 'At least 4 members must submit identical rankings for consensus.'
                      )}
                      {group.members.length > 6 && (
                        t.consensus.consensusRequirementAll || 'All members must submit identical rankings for consensus.'
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {group.consensusReached && (
                  <Alert variant="default" className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                      {t.consensus.groupConsensusSuccess || 'This group reached consensus! All members received REP tokens, and PHIL tokens were distributed according to the agreed rankings.'}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <h4 className="font-semibold mb-2">{t.consensus.membersAndRewards || 'Members & Rewards'}</h4>
                  <div className="space-y-2">
                    {group.members.map((member) => {
                      const memberRewards = groupRewards.get(member.toString());
                      const memberRanked = group.rankings.some(
                        ([p]) => p.toString() === member.toString()
                      );

                      return (
                        <div
                          key={member.toString()}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getUsernameByPrincipal(member.toString())}
                            </span>
                            {member.toString() === userProfile?.principal.toString() && (
                              <Badge variant="outline">{t.consensus.you || 'You'}</Badge>
                            )}
                            {!memberRanked && groupHasRankings && (
                              <Badge variant="secondary" className="text-xs">
                                {t.consensus.noRanking || 'No ranking'}
                              </Badge>
                            )}
                          </div>
                          {memberRewards && (memberRewards.rep > 0 || memberRewards.phil > 0) ? (
                            <div className="flex gap-4 text-sm">
                              <span className="text-primary font-semibold">
                                {memberRewards.rep} REP
                              </span>
                              <span className="text-accent font-semibold">
                                {memberRewards.phil} PHIL
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t.consensus.noRewards || 'No rewards'}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {group.rankings.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">{t.consensus.rankingsSubmitted}</h4>
                      <p className="text-sm text-muted-foreground">
                        {group.rankings.length} {t.consensus.of || 'of'} {group.members.length} {t.consensus.membersSubmittedRankings || 'members submitted rankings'}
                      </p>
                      {allMembersRanked && !group.consensusReached && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                          {t.consensus.allRankedNoConsensus || 'All members ranked, but rankings did not match sufficiently for consensus.'}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

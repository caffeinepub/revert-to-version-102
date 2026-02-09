import { useGetDailyRewardEligibility, useClaimDailyReward, useGetCallerCategory, useGetDailyRewardConfig } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Loader2, Clock, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { UserCategory } from '../../backend';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DailyRewardCard() {
  const { t } = useLanguage();
  const { data: eligibility, isLoading: eligibilityLoading } = useGetDailyRewardEligibility();
  const { data: userCategory } = useGetCallerCategory();
  const { data: config } = useGetDailyRewardConfig();
  const claimReward = useClaimDailyReward();

  const handleClaimReward = async () => {
    try {
      const amount = await claimReward.mutateAsync();
      toast.success(`${t.toast.genericError.replace('An error occurred', `Successfully claimed ${amount.toString()} PHIL tokens!`)}`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to claim daily reward';
      if (errorMessage.includes('insufficient funds') || errorMessage.includes('allocated pool')) {
        toast.error('Daily reward currently unavailable - insufficient funds in allocated pool');
      } else if (errorMessage.includes('cooldown')) {
        toast.error('Daily reward already claimed. Please wait for cooldown to expire.');
      } else {
        toast.error(errorMessage);
      }
      console.error('Error claiming daily reward:', error);
    }
  };

  const formatCooldown = (nanoseconds: bigint): string => {
    const seconds = Number(nanoseconds) / 1_000_000_000;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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

  if (eligibilityLoading) {
    return (
      <Card className="border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Loader2 className="h-6 w-6 text-accent animate-spin" />
            </div>
            <div>
              <CardTitle>{t.overview.dailyRewards}</CardTitle>
              <CardDescription>{t.common.loading}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!eligibility) {
    return null;
  }

  return (
    <Card className={eligibility.canClaim ? 'border-accent/30 bg-accent/5' : 'border-muted/30'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <img
                src="/assets/generated/daily-reward-icon-transparent.dim_64x64.png"
                alt={t.overview.dailyRewards}
                className="h-12 w-12"
              />
            </div>
            <div>
              <CardTitle className="text-xl">{t.overview.dailyRewards}</CardTitle>
              <CardDescription className="mt-1">
                {t.overview.dailyRewardsDesc}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-accent">
                {eligibility.amount.toString()}
              </span>
              <Badge variant="secondary" className="text-xs">PHIL</Badge>
            </div>
            {userCategory && (
              <p className="text-sm text-muted-foreground mt-1">
                {t.overview.philReward} {getCategoryLabel(userCategory)}
              </p>
            )}
          </div>
          
          {eligibility.canClaim ? (
            <Button 
              onClick={handleClaimReward} 
              disabled={claimReward.isPending}
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              {claimReward.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-5 w-5" />
                  {t.overview.dailyRewards}
                </>
              )}
            </Button>
          ) : (
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                <Clock className="mr-1 h-3 w-3" />
                {t.overview.dailyRewards}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {formatCooldown(eligibility.cooldown)}
              </p>
            </div>
          )}
        </div>

        {config && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <p className="text-muted-foreground">
              {config.allocationPercentage.toString()}%
            </p>
          </div>
        )}

        {!eligibility.canClaim && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              {formatCooldown(eligibility.cooldown)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

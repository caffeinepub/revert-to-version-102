import { useState } from 'react';
import { useGetDailyRewardConfig, useUpdateDailyRewardConfig } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Loader2, Save, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DailyRewardsConfigCard() {
  const { t } = useLanguage();
  const { data: config, isLoading } = useGetDailyRewardConfig();
  const updateConfig = useUpdateDailyRewardConfig();
  
  const [nonMemberReward, setNonMemberReward] = useState('');
  const [memberReward, setMemberReward] = useState('');
  const [activeMemberReward, setActiveMemberReward] = useState('');
  const [allocationPercentage, setAllocationPercentage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    if (config) {
      setNonMemberReward(config.nonMember.toString());
      setMemberReward(config.member.toString());
      setActiveMemberReward(config.activeMember.toString());
      setAllocationPercentage(config.allocationPercentage.toString());
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const percentage = BigInt(allocationPercentage);
      
      if (percentage < 0n || percentage > 100n) {
        toast.error(t.common.error);
        return;
      }

      const newConfig = {
        nonMember: BigInt(nonMemberReward),
        member: BigInt(memberReward),
        activeMember: BigInt(activeMemberReward),
        allocationPercentage: percentage,
      };
      
      await updateConfig.mutateAsync(newConfig);
      toast.success(t.common.success);
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error?.message || t.common.error;
      toast.error(errorMessage);
      console.error('Error updating config:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Loader2 className="h-5 w-5 text-accent animate-spin" />
            </div>
            <div>
              <CardTitle>{t.overview.philToken}</CardTitle>
              <CardDescription>{t.common.loading}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Gift className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>{t.overview.philToken}</CardTitle>
              <CardDescription>{t.overview.philReward}</CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="sm">
              {t.common.edit}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="allocationPercentage" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                {t.admin.marketingTreasury}
              </Label>
              <Input
                id="allocationPercentage"
                type="number"
                value={allocationPercentage}
                onChange={(e) => setAllocationPercentage(e.target.value)}
                placeholder="0-100"
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">
                {t.admin.marketingTreasury}
              </p>
            </div>

            <div className="h-px bg-border my-4" />
            
            <div className="space-y-2">
              <Label htmlFor="nonMemberReward">{t.categories.nonMember} (PHIL)</Label>
              <Input
                id="nonMemberReward"
                type="number"
                value={nonMemberReward}
                onChange={(e) => setNonMemberReward(e.target.value)}
                placeholder={t.blog.tipAmount}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memberReward">{t.categories.member} (PHIL)</Label>
              <Input
                id="memberReward"
                type="number"
                value={memberReward}
                onChange={(e) => setMemberReward(e.target.value)}
                placeholder={t.blog.tipAmount}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activeMemberReward">{t.categories.activeMember} (PHIL)</Label>
              <Input
                id="activeMemberReward"
                type="number"
                value={activeMemberReward}
                onChange={(e) => setActiveMemberReward(e.target.value)}
                placeholder={t.blog.tipAmount}
                min="0"
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={updateConfig.isPending}>
                {updateConfig.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.common.loading}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t.common.save}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                {t.common.cancel}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t.admin.marketingTreasury}</span>
              </div>
              <span className="text-xl font-bold text-primary">{config?.allocationPercentage.toString()}%</span>
            </div>

            <p className="text-xs text-muted-foreground px-3">
              {config?.allocationPercentage.toString()}%
            </p>

            <div className="h-px bg-border my-4" />
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">{t.categories.nonMember}</span>
              <span className="text-lg font-bold text-accent">{config?.nonMember.toString()} PHIL</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">{t.categories.member}</span>
              <span className="text-lg font-bold text-accent">{config?.member.toString()} PHIL</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">{t.categories.activeMember}</span>
              <span className="text-lg font-bold text-accent">{config?.activeMember.toString()} PHIL</span>
            </div>
            
            <p className="text-sm text-muted-foreground pt-2">
              {t.overview.philReward}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

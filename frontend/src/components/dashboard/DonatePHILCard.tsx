import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useGetTokenBalance, useGetAllMembers, useDonatePHIL } from '../../hooks/useQueries';
import { TreasuryTarget } from '../../types/backend-extensions';
import { Principal } from '@icp-sdk/core/principal';
import { Coins, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

type RecipientType = 'user' | 'treasury';

export default function DonatePHILCard() {
  const { t } = useLanguage();
  const { data: tokenBalance } = useGetTokenBalance();
  const { data: members = [] } = useGetAllMembers();
  const donatePHIL = useDonatePHIL();

  const [recipientType, setRecipientType] = useState<RecipientType>('user');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedTreasury, setSelectedTreasury] = useState<TreasuryTarget>(TreasuryTarget.rewards);
  const [amount, setAmount] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const philBalance = tokenBalance?.phil ? Number(tokenBalance.phil) : 0;

  const handleDonate = () => {
    const donationAmount = parseInt(amount);

    if (!amount || donationAmount <= 0) {
      toast.error(t.blog.tipAmountInvalid);
      return;
    }

    if (donationAmount > philBalance) {
      toast.error(t.blog.insufficientBalance);
      return;
    }

    if (recipientType === 'user' && !selectedUser) {
      toast.error(t.common.error);
      return;
    }

    setConfirmDialogOpen(true);
  };

  const confirmDonation = async () => {
    try {
      const donationAmount = BigInt(parseInt(amount));
      
      let target;
      if (recipientType === 'user') {
        target = { __kind__: 'user' as const, user: Principal.fromText(selectedUser) };
      } else {
        target = { __kind__: 'treasury' as const, treasury: selectedTreasury };
      }

      await donatePHIL.mutateAsync({ target, amount: donationAmount });
      
      toast.success(t.common.success);
      setAmount('');
      setSelectedUser('');
      setConfirmDialogOpen(false);
    } catch (error: any) {
      console.error('Donation error:', error);
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Insufficient PHIL balance')) {
        toast.error(t.blog.insufficientBalance);
      } else if (errorMessage.includes('Only approved members')) {
        toast.error(t.common.error);
      } else if (errorMessage.includes('Recipient user does not exist')) {
        toast.error(t.common.error);
      } else if (errorMessage.includes('Cannot donate to yourself')) {
        toast.error(t.common.error);
      } else if (errorMessage.includes('Donation amount must be greater than 0')) {
        toast.error(t.blog.tipAmountInvalid);
      } else {
        toast.error(`${t.common.error}: ${errorMessage}`);
      }
      setConfirmDialogOpen(false);
    }
  };

  const getRecipientDisplay = () => {
    if (recipientType === 'user') {
      const member = members.find(m => m.principal.toString() === selectedUser);
      return member ? member.username : t.members.username;
    } else {
      switch (selectedTreasury) {
        case TreasuryTarget.rewards:
          return t.admin.rewardsTreasury;
        case TreasuryTarget.marketing:
          return t.admin.marketingTreasury;
        case TreasuryTarget.council:
          return t.admin.councilTreasury;
        default:
          return 'Treasury';
      }
    }
  };

  return (
    <>
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <img
                  src="/assets/generated/donation-icon-transparent.dim_64x64.png"
                  alt={t.overview.sendToken}
                  className="h-12 w-12"
                />
              </div>
              <div>
                <CardTitle className="text-xl">{t.overview.sendToken}</CardTitle>
                <CardDescription className="mt-1">
                  {t.overview.sendTokenDesc}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Coins className="h-4 w-4" />
            <span>{t.blog.yourBalance}: <span className="font-semibold text-accent">{philBalance}</span></span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-type">{t.members.username}</Label>
            <Select value={recipientType} onValueChange={(value) => setRecipientType(value as RecipientType)}>
              <SelectTrigger id="recipient-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t.members.username}</SelectItem>
                <SelectItem value="treasury">Treasury</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType === 'user' ? (
            <div className="space-y-2">
              <Label htmlFor="user-select">{t.members.username}</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder={t.common.search} />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.principal.toString()} value={member.principal.toString()}>
                      {member.username} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="treasury-select">Treasury</Label>
              <Select value={selectedTreasury} onValueChange={(value) => setSelectedTreasury(value as TreasuryTarget)}>
                <SelectTrigger id="treasury-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TreasuryTarget.rewards}>{t.admin.rewardsTreasury}</SelectItem>
                  <SelectItem value={TreasuryTarget.marketing}>{t.admin.marketingTreasury}</SelectItem>
                  <SelectItem value={TreasuryTarget.council}>{t.admin.councilTreasury}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">{t.blog.tipAmount}</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max={philBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.blog.tipAmount}
            />
          </div>

          <Button 
            onClick={handleDonate}
            disabled={donatePHIL.isPending || !amount || parseInt(amount) <= 0 || (recipientType === 'user' && !selectedUser)}
            className="w-full"
            size="lg"
          >
            {donatePHIL.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {t.overview.sendToken}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.common.confirm}</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold text-accent">{amount} PHIL</span>{' '}
              <span className="font-semibold">{getRecipientDisplay()}</span>.
              <br /><br />
              {t.common.confirm}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDonation}
              disabled={donatePHIL.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {donatePHIL.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                t.common.confirm
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

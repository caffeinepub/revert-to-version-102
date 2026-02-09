import {
  useGetTokenomicsConfig,
  useGetTreasuryBalances,
  useGetCurrentSupply,
  useGetMintCycleStatus,
  useIsCallerAdmin,
  useManualMint,
} from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Percent, Info, Clock, DollarSign, Calendar, Edit, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState } from 'react';
import EditTokenomicsDialog from './EditTokenomicsDialog';
import { toast } from 'sonner';

export default function TokenomicsTab() {
  const { t, locale } = useLanguage();
  const { data: config, isLoading: configLoading } = useGetTokenomicsConfig();
  const { data: treasuryBalances, isLoading: treasuryLoading } = useGetTreasuryBalances();
  const { data: currentSupply, isLoading: supplyLoading } = useGetCurrentSupply();
  const { data: mintCycleStatus, isLoading: cycleLoading } = useGetMintCycleStatus();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const manualMint = useManualMint();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const formatNumber = (num: bigint) => {
    return Number(num).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR');
  };

  const formatTime = (nanoseconds: bigint) => {
    const seconds = Number(nanoseconds) / 1_000_000_000;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (locale === 'en') {
      if (days > 0) return `${days}d ${hours % 24}h`;
      if (hours > 0) return `${hours}h ${minutes % 60}m`;
      if (minutes > 0) return `${minutes}m ${Math.floor(seconds % 60)}s`;
      return `${Math.floor(seconds)}s`;
    } else {
      if (days > 0) return `${days}j ${hours % 24}h`;
      if (hours > 0) return `${hours}h ${minutes % 60}m`;
      if (minutes > 0) return `${minutes}m ${Math.floor(seconds % 60)}s`;
      return `${Math.floor(seconds)}s`;
    }
  };

  const formatDateTime = (nanoseconds: bigint) => {
    const milliseconds = Number(nanoseconds) / 1_000_000;
    return new Date(milliseconds).toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateSupplyProgress = () => {
    if (!config || !currentSupply) return 0;
    return (Number(currentSupply) / Number(config.maxSupply)) * 100;
  };

  const calculateNextHalving = () => {
    if (!config) return 'N/A';
    const halvingIntervalSeconds = Number(config.halvingInterval) / 1_000_000_000;
    const halvingIntervalMonths = halvingIntervalSeconds / (30 * 24 * 60 * 60);
    return locale === 'en' 
      ? `${halvingIntervalMonths.toFixed(1)} months`
      : `${halvingIntervalMonths.toFixed(1)} mois`;
  };

  const isInflationActive = () => {
    if (!config || !currentSupply) return false;
    return currentSupply >= config.maxSupply;
  };

  const isMintingActive = () => {
    if (!config) return false;
    const now = Date.now() * 1_000_000;
    return now >= Number(config.launchDate);
  };

  const handleManualMint = async () => {
    try {
      await manualMint.mutateAsync();
      toast.success(
        locale === 'en' 
          ? 'Tokens minted successfully! Treasury balances updated.'
          : 'Jetons frappés avec succès ! Soldes de trésorerie mis à jour.'
      );
    } catch (error) {
      console.error('Manual mint error:', error);
      toast.error(
        locale === 'en'
          ? 'Failed to mint tokens. Please try again.'
          : 'Échec du frappage des jetons. Veuillez réessayer.'
      );
    }
  };

  const canEdit = isAdmin && !adminLoading;

  const isLoading = configLoading || treasuryLoading || supplyLoading || cycleLoading;
  const rolesLoading = adminLoading;

  // Check if user has access (Admin only)
  const hasAccess = !rolesLoading && isAdmin;

  if (rolesLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Access denied screen for non-authorized users
  if (!hasAccess) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <ShieldAlert className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-destructive">
                {locale === 'en' ? 'Access Restricted' : 'Accès restreint'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Only Admins have access to this section'
                  : 'Seuls les administrateurs ont accès à cette section'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {locale === 'en'
                ? 'The Tokenomics dashboard contains sensitive financial information and configuration settings that are restricted to administrators only.'
                : 'Le tableau de bord Tokenomics contient des informations financières sensibles et des paramètres de configuration réservés uniquement aux administrateurs.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>
                {locale === 'en' ? 'Tokenomics Dashboard' : 'Tableau de bord Tokenomics'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Bitcoin-like supply management and treasury tracking'
                  : 'Gestion de l\'offre de type Bitcoin et suivi de la trésorerie'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Supply Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>
                {locale === 'en' ? 'PHIL Token Supply' : 'Offre de jetons PHIL'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' ? 'Current supply and maximum cap' : 'Offre actuelle et plafond maximum'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Current Supply' : 'Offre actuelle'}</Label>
              <div className="text-2xl font-bold text-primary">
                {formatNumber(currentSupply || BigInt(0))} PHIL
              </div>
            </div>
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Maximum Supply' : 'Offre maximale'}</Label>
              <div className="text-2xl font-bold text-muted-foreground">
                {formatNumber(config?.maxSupply || BigInt(21000000))} PHIL
              </div>
            </div>
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Supply Progress' : 'Progression de l\'offre'}</Label>
              <div className="text-2xl font-bold text-accent">
                {calculateSupplyProgress().toFixed(2)}%
              </div>
            </div>
          </div>
          <Progress value={calculateSupplyProgress()} className="h-2" />
        </CardContent>
      </Card>

      {/* Halving & Inflation */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>
                  {locale === 'en' ? 'Halving Mechanism' : 'Mécanisme de halving'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' ? 'Reward reduction schedule' : 'Calendrier de réduction des récompenses'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Halving Interval' : 'Intervalle de halving'}</Label>
              <div className="text-xl font-bold">{calculateNextHalving()}</div>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {locale === 'en'
                  ? `Rewards are halved every ${calculateNextHalving()} to ensure sustainable token distribution.`
                  : `Les récompenses sont réduites de moitié tous les ${calculateNextHalving()} pour assurer une distribution durable des jetons.`}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {locale === 'en' ? 'Inflation Status' : 'Statut de l\'inflation'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' ? 'Post-max supply inflation' : 'Inflation après l\'offre maximale'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Status' : 'Statut'}</Label>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isInflationActive() ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="font-medium">
                  {isInflationActive() 
                    ? (locale === 'en' ? 'Active' : 'Actif')
                    : (locale === 'en' ? 'Inactive' : 'Inactif')}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Annual Inflation Rate' : 'Taux d\'inflation annuel'}</Label>
              <div className="text-xl font-bold">{config ? Number(config.inflationRate) : 2}%</div>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isInflationActive()
                  ? (locale === 'en' 
                      ? 'Inflation is active as max supply has been reached.'
                      : 'L\'inflation est active car l\'offre maximale a été atteinte.')
                  : (locale === 'en'
                      ? 'Inflation will activate once max supply is reached.'
                      : 'L\'inflation s\'activera une fois l\'offre maximale atteinte.')}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Treasury Balances */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Coins className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>
                {locale === 'en' ? 'Treasury Balances' : 'Soldes de la trésorerie'}
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Distribution across three treasury accounts'
                  : 'Répartition entre trois comptes de trésorerie'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 p-4 rounded-lg border bg-card">
              <Label className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Rewards Treasury (70%)' : 'Trésorerie des récompenses (70%)'}
              </Label>
              <div className="text-2xl font-bold text-primary">
                {formatNumber(treasuryBalances?.rewards || BigInt(0))} PHIL
              </div>
            </div>
            <div className="space-y-2 p-4 rounded-lg border bg-card">
              <Label className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Marketing Treasury (20%)' : 'Trésorerie marketing (20%)'}
              </Label>
              <div className="text-2xl font-bold text-accent">
                {formatNumber(treasuryBalances?.marketing || BigInt(0))} PHIL
              </div>
            </div>
            <div className="space-y-2 p-4 rounded-lg border bg-card">
              <Label className="text-sm text-muted-foreground">
                {locale === 'en' ? 'Council Treasury (10%)' : 'Trésorerie du conseil (10%)'}
              </Label>
              <div className="text-2xl font-bold text-secondary">
                {formatNumber(treasuryBalances?.council || BigInt(0))} PHIL
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minting Cycle & Launch Date */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {locale === 'en' ? 'Minting Cycle' : 'Cycle de frappe'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en' 
                    ? 'Automated minting schedule and launch configuration'
                    : 'Calendrier de frappe automatisé et configuration de lancement'}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualMint}
                    disabled={manualMint.isPending}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    {manualMint.isPending 
                      ? (locale === 'en' ? 'Minting...' : 'Frappe...')
                      : (locale === 'en' ? 'Mint Tokens' : 'Frappage de jetons')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Edit' : 'Modifier'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Launch Date' : 'Date de lancement'}</Label>
              <div className="text-lg font-semibold text-primary">
                {config ? formatDateTime(config.launchDate) : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {locale === 'en'
                  ? 'Automatic minting starts on or after this date'
                  : 'La frappe automatique commence à cette date ou après'}
              </p>
            </div>
            <div className="space-y-2">
              <Label>{locale === 'en' ? 'Minting Status' : 'Statut de frappe'}</Label>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isMintingActive() ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="font-medium">
                  {isMintingActive() 
                    ? (locale === 'en' ? 'Active' : 'Actif')
                    : (locale === 'en' ? 'Scheduled' : 'Programmé')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isMintingActive() 
                  ? (locale === 'en'
                      ? 'Automatic minting is currently active'
                      : 'La frappe automatique est actuellement active')
                  : (locale === 'en'
                      ? 'Minting will begin on launch date'
                      : 'La frappe commencera à la date de lancement')}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>{locale === 'en' ? 'Next Mint In' : 'Prochaine frappe dans'}</Label>
            <div className="text-xl font-bold text-primary">
              {mintCycleStatus ? formatTime(mintCycleStatus) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en'
                ? 'Automatic minting occurs every 10 minutes'
                : 'La frappe automatique se produit toutes les 10 minutes'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Allocation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>
                {locale === 'en' ? 'Distribution Allocation' : 'Allocation de distribution'}
              </CardTitle>
              <CardDescription>
                {locale === 'en'
                  ? 'Treasury distribution percentages'
                  : 'Pourcentages de distribution de la trésorerie'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Rewards Treasury' : 'Trésorerie des récompenses'}
              </span>
              <span className="text-sm font-bold">70%</span>
            </div>
            <Progress value={70} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Marketing Treasury' : 'Trésorerie marketing'}
              </span>
              <span className="text-sm font-bold">20%</span>
            </div>
            <Progress value={20} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {locale === 'en' ? 'Council Treasury' : 'Trésorerie du conseil'}
              </span>
              <span className="text-sm font-bold">10%</span>
            </div>
            <Progress value={10} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {config && (
        <EditTokenomicsDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentConfig={config}
        />
      )}
    </div>
  );
}

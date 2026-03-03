import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Coins, TrendingUp, Calendar, Wallet, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGetTokenomicsConfig, useGetTreasuryBalances, useGetCurrentSupply, useGetMintCycleStatus, useIsCallerAdmin, useIsCouncilMember } from '../../hooks/useQueries';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

export default function TokenomicsInfoSection() {
  const { t, locale } = useLanguage();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: isCouncilMember, isLoading: councilLoading } = useIsCouncilMember();
  const { data: tokenomicsConfig, isLoading: configLoading } = useGetTokenomicsConfig();
  const { data: treasuryBalances, isLoading: treasuryLoading } = useGetTreasuryBalances();
  const { data: currentSupply, isLoading: supplyLoading } = useGetCurrentSupply();
  const { data: mintCycleStatus, isLoading: mintLoading } = useGetMintCycleStatus();

  const isAuthorized = isAdmin || isCouncilMember;
  const isLoading = adminLoading || councilLoading || configLoading || treasuryLoading || supplyLoading || mintLoading;

  // Don't show section if user is not authorized
  if (!adminLoading && !councilLoading && !isAuthorized) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const maxSupply = tokenomicsConfig?.maxSupply ? Number(tokenomicsConfig.maxSupply) : 21000000;
  const supply = currentSupply ? Number(currentSupply) : 0;
  const supplyPercentage = maxSupply > 0 ? (supply / maxSupply) * 100 : 0;

  const halvingInterval = tokenomicsConfig?.halvingInterval ? Number(tokenomicsConfig.halvingInterval) : 777600000000000;
  const halvingMonths = Math.floor(halvingInterval / (30 * 24 * 60 * 60 * 1000000000));

  const inflationRate = tokenomicsConfig?.inflationRate ? Number(tokenomicsConfig.inflationRate) : 2;
  const isInflationActive = supply >= maxSupply;

  const nextMintTime = mintCycleStatus ? Number(mintCycleStatus) : 0;
  const nextMintDate = nextMintTime > 0 ? new Date(Date.now() + nextMintTime / 1000000) : null;

  const dateLocale = locale === 'fr' ? fr : enUS;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Coins className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">
            {locale === 'en' ? 'Tokenomics Overview' : 'Aperçu des tokenomics'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === 'en' 
              ? 'Key metrics and treasury information' 
              : 'Métriques clés et informations sur la trésorerie'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Token Supply Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Token Supply' : 'Approvisionnement en jetons'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' ? 'Current vs Maximum' : 'Actuel vs Maximum'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Current Supply' : 'Approvisionnement actuel'}
                </span>
                <span className="text-lg font-bold text-primary">
                  {supply.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Maximum Supply' : 'Approvisionnement maximum'}
                </span>
                <span className="text-sm font-semibold">
                  {maxSupply.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Progress value={supplyPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {supplyPercentage.toFixed(2)}% {locale === 'en' ? 'of max supply' : 'de l\'offre max'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Halving Cycle Card */}
        <Card className="border-accent/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Halving Cycle' : 'Cycle de réduction de moitié'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' ? 'Reward reduction schedule' : 'Calendrier de réduction des récompenses'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Interval' : 'Intervalle'}
                </span>
                <span className="text-lg font-bold text-accent">
                  {halvingMonths} {locale === 'en' ? 'months' : 'mois'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Next Halving' : 'Prochaine réduction'}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {locale === 'en' ? 'Scheduled' : 'Programmé'}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' 
                ? 'Rewards halve every 3 months until max supply is reached' 
                : 'Les récompenses sont réduites de moitié tous les 3 mois jusqu\'à ce que l\'offre maximale soit atteinte'}
            </p>
          </CardContent>
        </Card>

        {/* Inflation Status Card */}
        <Card className="border-green-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <AlertCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Inflation Status' : 'Statut de l\'inflation'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' ? 'Post-max supply rate' : 'Taux après offre max'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Annual Rate' : 'Taux annuel'}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {inflationRate}%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Status' : 'Statut'}
                </span>
                <Badge variant={isInflationActive ? 'default' : 'secondary'} className="text-xs">
                  {isInflationActive 
                    ? (locale === 'en' ? 'Active' : 'Actif')
                    : (locale === 'en' ? 'Inactive' : 'Inactif')}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' 
                ? 'Inflation begins after maximum supply is reached' 
                : 'L\'inflation commence après que l\'offre maximale soit atteinte'}
            </p>
          </CardContent>
        </Card>

        {/* Treasury Balances Card */}
        <Card className="border-blue-500/20 md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Treasury Balances' : 'Soldes de la trésorerie'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' ? 'Distribution across treasuries' : 'Distribution entre les trésoreries'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {locale === 'en' ? 'Rewards' : 'Récompenses'}
                  </span>
                  <Badge variant="outline" className="text-xs">70%</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {treasuryBalances ? Number(treasuryBalances.rewards).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') : '0'}
                </p>
                <p className="text-xs text-muted-foreground">PHIL</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {locale === 'en' ? 'Marketing' : 'Marketing'}
                  </span>
                  <Badge variant="outline" className="text-xs">20%</Badge>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {treasuryBalances ? Number(treasuryBalances.marketing).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') : '0'}
                </p>
                <p className="text-xs text-muted-foreground">PHIL</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {locale === 'en' ? 'Council' : 'Conseil'}
                  </span>
                  <Badge variant="outline" className="text-xs">10%</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {treasuryBalances ? Number(treasuryBalances.council).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US') : '0'}
                </p>
                <p className="text-xs text-muted-foreground">PHIL</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Minting Cycle Card */}
        <Card className="border-orange-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {locale === 'en' ? 'Minting Cycle' : 'Cycle de frappe'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {locale === 'en' ? 'Next mint event' : 'Prochain événement de frappe'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Time Remaining' : 'Temps restant'}
                </span>
                {nextMintDate ? (
                  <span className="text-sm font-semibold text-orange-600">
                    {formatDistanceToNow(nextMintDate, { 
                      addSuffix: true,
                      locale: dateLocale 
                    })}
                  </span>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {locale === 'en' ? 'Pending' : 'En attente'}
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Frequency' : 'Fréquence'}
                </span>
                <span className="text-sm font-semibold">
                  {locale === 'en' ? 'Every 10 minutes' : 'Toutes les 10 minutes'}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === 'en' 
                ? 'Automatic minting distributes tokens to treasuries' 
                : 'La frappe automatique distribue les jetons aux trésoreries'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

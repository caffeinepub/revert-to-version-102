import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Users, Shield, MessageSquare, Crown, Megaphone, Loader2, FileText, Vote, Coins } from 'lucide-react';
import OverviewTab from '../components/dashboard/OverviewTab';
import MembersTab from '../components/dashboard/MembersTab';
import AdminTab from '../components/dashboard/AdminTab';
import ConsensusMeetingsTab from '../components/dashboard/ConsensusMeetingsTab';
import CouncilTab from '../components/dashboard/CouncilTab';
import AnnouncementsTab from '../components/dashboard/AnnouncementsTab';
import DocumentationTab from '../components/dashboard/DocumentationTab';
import ProposalsTab from '../components/dashboard/ProposalsTab';
import TokenomicsTab from '../components/dashboard/TokenomicsTab';
import { useIsCallerAdmin, useGetCallerCategory, useIsCouncilMember } from '../hooks/useQueries';
import { UserCategory } from '../backend';
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '../contexts/LanguageContext';

// Loading fallback for tab content
function TabLoadingFallback() {
  const { t } = useLanguage();
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { t, locale } = useLanguage();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: userCategory, isLoading: isCategoryLoading } = useGetCallerCategory();
  const { data: isCouncilMember, isLoading: isCouncilLoading } = useIsCouncilMember();

  // Only show tabs after role checks complete to prevent flashing
  const rolesLoaded = !isAdminLoading && !isCategoryLoading && !isCouncilLoading;
  
  // Admin tab is only visible to admins
  const showAdminTab = rolesLoaded && isAdmin;
  
  // Members tab is only visible to Active Members or Admins
  const showMembersTab = rolesLoaded && (isAdmin || userCategory === UserCategory.activeMember);

  // Consensus tab is only visible to Members (including Active Members) or Admins
  const showConsensusTab = rolesLoaded && (
    isAdmin || 
    userCategory === UserCategory.member || 
    userCategory === UserCategory.activeMember
  );

  // Council tab is only visible to Members (including Active Members) or Admins
  const showCouncilTab = rolesLoaded && (
    isAdmin || 
    userCategory === UserCategory.member || 
    userCategory === UserCategory.activeMember
  );

  // Proposals tab is only visible to Active Members
  const showProposalsTab = rolesLoaded && userCategory === UserCategory.activeMember;

  // Tokenomics tab is only visible to Admins
  const showTokenomicsTab = rolesLoaded && isAdmin;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t.dashboard.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t.dashboard.subtitle}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{t.dashboard.overview}</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">{t.announcements.title}</span>
          </TabsTrigger>
          {showMembersTab && (
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t.dashboard.members}</span>
            </TabsTrigger>
          )}
          {showConsensusTab && (
            <TabsTrigger value="consensus" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">{t.dashboard.consensus}</span>
            </TabsTrigger>
          )}
          {showCouncilTab && (
            <TabsTrigger value="council" className="gap-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">{t.dashboard.council}</span>
            </TabsTrigger>
          )}
          {showProposalsTab && (
            <TabsTrigger value="proposals" className="gap-2">
              <Vote className="h-4 w-4" />
              <span className="hidden sm:inline">{t.proposals.title}</span>
            </TabsTrigger>
          )}
          {showTokenomicsTab && (
            <TabsTrigger value="tokenomics" className="gap-2">
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">
                {locale === 'en' ? 'Tokenomics' : 'Tokenomics'}
              </span>
            </TabsTrigger>
          )}
          {showAdminTab && (
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t.dashboard.admin}</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="documentation" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">
              {locale === 'en' ? 'Docs' : 'Docs'}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <OverviewTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <AnnouncementsTab />
          </Suspense>
        </TabsContent>

        {showMembersTab && (
          <TabsContent value="members" className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <MembersTab />
            </Suspense>
          </TabsContent>
        )}

        {showConsensusTab && (
          <TabsContent value="consensus" className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <ConsensusMeetingsTab />
            </Suspense>
          </TabsContent>
        )}

        {showCouncilTab && (
          <TabsContent value="council" className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <CouncilTab />
            </Suspense>
          </TabsContent>
        )}

        {showProposalsTab && (
          <TabsContent value="proposals" className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <ProposalsTab />
            </Suspense>
          </TabsContent>
        )}

        {showTokenomicsTab && (
          <TabsContent value="tokenomics" className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <TokenomicsTab />
            </Suspense>
          </TabsContent>
        )}

        {showAdminTab && (
          <TabsContent value="admin" className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <AdminTab />
            </Suspense>
          </TabsContent>
        )}

        <TabsContent value="documentation" className="space-y-6">
          <Suspense fallback={<TabLoadingFallback />}>
            <DocumentationTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

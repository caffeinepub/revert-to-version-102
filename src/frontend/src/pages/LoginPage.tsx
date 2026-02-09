import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2, Users, Calendar, Coins, Globe, Award, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const { t } = useLanguage();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {t.homepage.headline}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
                {t.homepage.tagline}
              </p>
              <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                {t.homepage.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-20 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.login.connecting}
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    {t.login.loginButton}
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.homepage.valueProposition.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.homepage.valueProposition.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Structured Onboarding */}
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.homepage.valueProposition.onboarding}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t.homepage.valueProposition.onboardingDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Weekly Consensus Meetings */}
              <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{t.homepage.valueProposition.consensus}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t.homepage.valueProposition.consensusDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Governance Activities */}
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.homepage.valueProposition.governance}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t.homepage.valueProposition.governanceDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Bitcoin-type Tokenomics */}
              <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors">
                      <Coins className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{t.homepage.valueProposition.tokenomics}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t.homepage.valueProposition.tokenomicsDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Daily Rewards */}
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t.homepage.valueProposition.rewards}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t.homepage.valueProposition.rewardsDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Multilanguage Support */}
              <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors">
                      <Globe className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{t.homepage.valueProposition.multilang}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {t.homepage.valueProposition.multilangDesc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.homepage.features.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t.homepage.features.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Consensus Meetings */}
              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src="/assets/generated/consensus-icon-transparent.dim_64x64.png" 
                        alt="Consensus" 
                        className="h-16 w-16" 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{t.homepage.features.consensus}</CardTitle>
                  <CardDescription className="text-center">
                    {t.homepage.features.consensusDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Governance */}
              <Card className="border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 hover:shadow-xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src="/assets/generated/voting-icon-transparent.dim_64x64.png" 
                        alt="Governance" 
                        className="h-16 w-16" 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{t.homepage.features.governance}</CardTitle>
                  <CardDescription className="text-center">
                    {t.homepage.features.governanceDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Tokenomics */}
              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src="/assets/generated/token-distribution-icon-transparent.dim_48x48.png" 
                        alt="Tokenomics" 
                        className="h-16 w-16" 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{t.homepage.features.tokenomics}</CardTitle>
                  <CardDescription className="text-center">
                    {t.homepage.features.tokenomicsDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Council */}
              <Card className="border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 hover:shadow-xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src="/assets/generated/council-dashboard-icon-transparent.dim_64x64.png" 
                        alt="Council" 
                        className="h-16 w-16" 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{t.homepage.features.council}</CardTitle>
                  <CardDescription className="text-center">
                    {t.homepage.features.councilDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Blog */}
              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src="/assets/generated/blog-icon-transparent.dim_64x64.png" 
                        alt="Blog" 
                        className="h-16 w-16" 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{t.homepage.features.blog}</CardTitle>
                  <CardDescription className="text-center">
                    {t.homepage.features.blogDesc}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Community */}
              <Card className="border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 hover:shadow-xl group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src="/assets/generated/membership-approval-icon-transparent.dim_64x64.png" 
                        alt="Community" 
                        className="h-16 w-16" 
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center mb-2">{t.homepage.features.community}</CardTitle>
                  <CardDescription className="text-center">
                    {t.homepage.features.communityDesc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.homepage.cta.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.homepage.cta.subtitle}
            </p>
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="h-14 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.login.connecting}
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  {t.homepage.cta.button}
                </>
              )}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Global Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
          <Card className="max-w-lg w-full border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Something went wrong</CardTitle>
                  <CardDescription>The application encountered an unexpected error</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full"
              >
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Fallback Component
function LoadingFallback({ message = 'Loading Phil3...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
    error: profileError,
  } = useGetCallerUserProfile();

  // Show loading state while initializing identity
  if (isInitializing) {
    return <LoadingFallback message="Initializing..." />;
  }

  // Not authenticated - show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated - check profile status
  // Show loading while fetching profile
  if (profileLoading && !profileFetched) {
    return <LoadingFallback message="Loading your profile..." />;
  }

  // Handle profile fetch error
  if (profileError) {
    console.error('Profile fetch error:', profileError);
    // If error is due to no profile, treat as no profile
    // Otherwise show error
    if (profileError.message?.includes('not found') || profileError.message?.includes('Unauthorized')) {
      // Treat as no profile - show setup
      return <ProfileSetupPage />;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="max-w-lg w-full border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Profile Error</CardTitle>
            <CardDescription>Failed to load your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {profileError.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile fetched but null - show profile setup
  if (profileFetched && !userProfile) {
    return <ProfileSetupPage />;
  }

  // Profile exists - show main dashboard
  if (userProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Header />
        <main className="flex-1">
          <DashboardPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Fallback loading state
  return <LoadingFallback />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AppContent />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

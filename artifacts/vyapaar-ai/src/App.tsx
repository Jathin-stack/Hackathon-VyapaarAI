import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from 'wouter';
import { ClerkProvider } from '@clerk/react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { NavigationContext } from './context/NavigationContext';
import { LandingPage } from './components/LandingPage';
import { OnboardingView } from './components/OnboardingView';
import { AuthPage } from './components/AuthPage';
import { LoginApprovalView } from './components/LoginApprovalView';
import { Sidebar, type ViewKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { FinanceView } from './components/FinanceView';
import { MarketingView } from './components/MarketingView';
import { CustomerView } from './components/CustomerView';
import { SupplierView } from './components/SupplierView';
import { POSBillingView } from './components/POSBillingView';
import { WeatherView } from './components/WeatherView';
import { FestivalView } from './components/FestivalView';
import { PredictiveView } from './components/PredictiveView';
import { AdvisorView } from './components/AdvisorView';
import { WhatsappView } from './components/WhatsappView';
import { HealthView } from './components/HealthView';
import { GamificationView } from './components/GamificationView';
import { ReportsView } from './components/ReportsView';
import { NotificationsView } from './components/NotificationsView';
import { VoiceAssistantView } from './components/VoiceAssistantView';
import { ShopSettingsView } from './components/ShopSettingsView';
import { ProfileView } from './components/ProfileView';
import { AIRecommendationsView } from './components/AIRecommendationsView';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const queryClient = new QueryClient();
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

// ─── Dashboard shell ───────────────────────────────────────────────────────────
function AppDashboard() {
  const [view, setView] = useState<ViewKey>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const stored = window.localStorage.getItem('vyapaar-active-view');
    return (stored as ViewKey) || 'dashboard';
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('vyapaar-active-view', view);
  }, [view]);

  // Cmd+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <NavigationContext.Provider value={{ navigate: setView, active: view }}>
      <SidebarProvider>
        <DashboardLayout
          view={view}
          onNavigate={setView}
          mobileOpen={mobileOpen}
          onMobileMenuClick={() => setMobileOpen(true)}
          onCloseMobile={() => setMobileOpen(false)}
          searchOpen={searchOpen}
          onSearchOpen={() => setSearchOpen(true)}
          onSearchClose={() => setSearchOpen(false)}
        />
      </SidebarProvider>
    </NavigationContext.Provider>
  );
}

interface DashboardLayoutProps {
  view: ViewKey;
  onNavigate: (view: ViewKey) => void;
  mobileOpen: boolean;
  onMobileMenuClick: () => void;
  onCloseMobile: () => void;
  searchOpen: boolean;
  onSearchOpen: () => void;
  onSearchClose: () => void;
}

function DashboardLayout({
  view,
  onNavigate,
  mobileOpen,
  onMobileMenuClick,
  onCloseMobile,
  searchOpen,
  onSearchOpen,
  onSearchClose,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-paper kirana-bg">
      <div className="lg:flex lg:min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={onCloseMobile} />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top navbar */}
          <TopBar onMobileMenuClick={onMobileMenuClick} onSearchOpen={onSearchOpen} />

          <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 transition-all duration-300 ease-out">
            {view === 'dashboard'       && <DashboardView onNavigate={onNavigate} />}
            {view === 'inventory'       && <InventoryView />}
            {view === 'finance'         && <FinanceView />}
            {view === 'marketing'       && <MarketingView />}
            {view === 'customers'       && <CustomerView />}
            {view === 'suppliers'       && <SupplierView />}
            {view === 'pos'             && <POSBillingView />}
            {view === 'weather'         && <WeatherView />}
            {view === 'festivals'       && <FestivalView />}
            {view === 'predictive'      && <PredictiveView />}
            {view === 'advisor'         && <AdvisorView />}
            {view === 'whatsapp'        && <WhatsappView />}
            {view === 'health'          && <HealthView />}
            {view === 'gamification'    && <GamificationView />}
            {view === 'reports'         && <ReportsView />}
            {view === 'notifications'   && <NotificationsView onNavigate={onNavigate} />}
            {view === 'voice'           && <VoiceAssistantView />}
            {view === 'settings'        && <ShopSettingsView />}
            {view === 'profile'         && <ProfileView />}
            {view === 'recommendations' && <AIRecommendationsView />}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Global search modal */}
      <SearchModal open={searchOpen} onClose={onSearchClose} />
    </div>
  );
}

// ─── App route (auth + onboarding) ────────────────────────────────────────────
function SignInContent({
  mode,
  setMode,
  setLocation,
}: {
  mode: 'signin' | 'signup';
  setMode: React.Dispatch<React.SetStateAction<'signin' | 'signup'>>;
  setLocation: (loc: string) => void;
}) {
  const { user, signOut } = useAuth();
  const [approvedState, setApprovedState] = useState(false);

  // Check if session is already approved
  const isApproved = approvedState || (typeof window !== 'undefined' && sessionStorage.getItem('vyapaar-login-approved') === 'true');

  useEffect(() => {
    if (user && isApproved) {
      setLocation('/app');
    }
  }, [user, isApproved, setLocation]);

  if (user && !isApproved) {
    return (
      <LoginApprovalView
        email={user.email}
        onApprove={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('vyapaar-login-approved', 'true');
          }
          setApprovedState(true);
        }}
        onCancel={async () => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('vyapaar-login-approved');
          }
          await signOut();
        }}
      />
    );
  }

  return (
    <AuthPage
      mode={mode}
      onBack={() => setLocation('/')}
      onToggleMode={() => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
    />
  );
}

function SignInRoute() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <AuthProvider onSignOut={() => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('vyapaar-login-approved');
      }
      setLocation('/');
    }}>
      <SignInContent mode={mode} setMode={setMode} setLocation={setLocation} />
    </AuthProvider>
  );
}

function AppRouteContent() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [onboarded, setOnboarded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('vyapaar-onboarded') === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('vyapaar-onboarded', onboarded ? 'true' : 'false');
  }, [onboarded]);

  const isApproved = typeof window !== 'undefined' && sessionStorage.getItem('vyapaar-login-approved') === 'true';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/signin');
      } else if (!isApproved) {
        navigate('/signin');
      }
    }
  }, [user, loading, isApproved, navigate]);

  if (loading || !user || !isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return !onboarded
    ? <OnboardingView onComplete={() => setOnboarded(true)} />
    : <AppDashboard />;
}

function AppRoute() {
  const [, navigate] = useLocation();

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('vyapaar-login-approved');
    }
    navigate('/');
  };

  return (
    <AuthProvider onSignOut={handleSignOut}>
      <AppRouteContent />
    </AuthProvider>
  );
}

// ─── Router ────────────────────────────────────────────────────────────────────
function AppRouter() {
  return (
    <Switch>
      <Route path="/">
        {() => <LandingPage
          onGetStarted={() => { window.location.pathname = `${basePath}/app`; }}
          onSignIn={() => { window.location.pathname = `${basePath}/signin`; }}
        />}
      </Route>
      <Route path="/signin">
        {() => <SignInRoute />}
      </Route>
      <Route path="/app">
        {() => <AppRoute />}
      </Route>
      <Route>{() => <Redirect to="/" />}</Route>
    </Switch>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
function App() {
  const inner = (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={basePath}>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </WouterRouter>
    </QueryClientProvider>
  );

  if (clerkKey) {
    return <ClerkProvider publishableKey={clerkKey}>{inner}</ClerkProvider>;
  }

  return inner;
}

export default App;

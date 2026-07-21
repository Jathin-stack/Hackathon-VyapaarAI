import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { OnboardingView } from './components/OnboardingView';
import { Sidebar, type ViewKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { FinanceView } from './components/FinanceView';
import { MarketingView } from './components/MarketingView';
import { CustomerView } from './components/CustomerView';
import { SupplierView } from './components/SupplierView';
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
import { supabase } from './lib/supabase';

type Screen = 'landing' | 'signin' | 'signup' | 'onboarding' | 'app';

function AppContent() {
  const { session, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>('landing');
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [onboardingNeeded, setOnboardingNeeded] = useState(false);

  useEffect(() => {
    if (session?.user) {
      supabase.from('merchant_profiles').select('onboarding_complete').eq('id', session.user.id).maybeSingle().then(({ data }) => {
        if (!data || !data.onboarding_complete) {
          setOnboardingNeeded(true);
          setScreen('onboarding');
        } else {
          setOnboardingNeeded(false);
          setScreen('app');
        }
      });
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen kirana-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (session && screen !== 'app' && screen !== 'onboarding') {
    if (onboardingNeeded) {
      setScreen('onboarding');
    } else {
      setScreen('app');
    }
  }

  if (!session && (screen === 'app' || screen === 'onboarding')) {
    setScreen('landing');
    setOnboardingNeeded(false);
  }

  if (!session) {
    if (screen === 'signin') {
      return <AuthPage mode="signin" onBack={() => setScreen('landing')} onToggleMode={() => setScreen('signup')} />;
    }
    if (screen === 'signup') {
      return <AuthPage mode="signup" onBack={() => setScreen('landing')} onToggleMode={() => setScreen('signin')} />;
    }
    return <LandingPage onGetStarted={() => setScreen('signup')} onSignIn={() => setScreen('signin')} />;
  }

  if (screen === 'onboarding') {
    return <OnboardingView onComplete={() => { setOnboardingNeeded(false); setScreen('app'); }} />;
  }

  return (
    <div className="min-h-screen bg-paper kirana-bg">
      <Sidebar active={view} onSelect={setView} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6">
          {view === 'dashboard' && <DashboardView onNavigate={setView} />}
          {view === 'inventory' && <InventoryView />}
          {view === 'finance' && <FinanceView />}
          {view === 'marketing' && <MarketingView />}
          {view === 'customers' && <CustomerView />}
          {view === 'suppliers' && <SupplierView />}
          {view === 'weather' && <WeatherView />}
          {view === 'festivals' && <FestivalView />}
          {view === 'predictive' && <PredictiveView />}
          {view === 'advisor' && <AdvisorView />}
          {view === 'whatsapp' && <WhatsappView />}
          {view === 'health' && <HealthView />}
          {view === 'gamification' && <GamificationView />}
          {view === 'reports' && <ReportsView />}
          {view === 'notifications' && <NotificationsView />}
          {view === 'voice' && <VoiceAssistantView />}
          {view === 'settings' && <ShopSettingsView />}
          {view === 'profile' && <ProfileView />}
          {view === 'recommendations' && <AIRecommendationsView />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

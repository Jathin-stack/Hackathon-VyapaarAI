import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, Show } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { LandingPage } from './components/LandingPage';
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
import heroShopkeeper from '@/assets/hero-shopkeeper.jpg';
import { CheckCircle2, BarChart3, Users, TrendingUp, Mic } from 'lucide-react';

// ─── Clerk setup ──────────────────────────────────────────────────────────────
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// Empty in dev (Clerk hits dev FAPI directly), auto-set in prod — do NOT gate on NODE_ENV
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
  },
  variables: {
    colorPrimary: '#F5A623',
    colorForeground: '#2A1F14',
    colorMutedForeground: 'rgba(63,46,30,0.65)',
    colorDanger: '#C1440E',
    colorBackground: '#FDF9F1',
    colorInput: '#FFFCF5',
    colorInputForeground: '#2A1F14',
    colorNeutral: 'rgba(42,31,20,0.12)',
    fontFamily: "'Inter', system-ui, sans-serif",
    borderRadius: '10px',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox:
      'bg-[#FFFCF5] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-[0_8px_24px_-12px_rgba(42,31,20,0.18)] border border-[rgba(42,31,20,0.07)]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-serif text-2xl font-bold text-[#2A1F14]',
    headerSubtitle: 'text-[rgba(63,46,30,0.65)]',
    socialButtonsBlockButtonText: 'text-[#2A1F14] font-semibold',
    formFieldLabel:
      'text-[#2A1F14] font-semibold text-xs uppercase tracking-wider',
    footerActionLink: 'text-[#C1440E] font-semibold hover:text-[#9B2E00]',
    footerActionText: 'text-[rgba(63,46,30,0.65)]',
    dividerText: 'text-[rgba(63,46,30,0.65)]',
    identityPreviewEditButton: 'text-[#C1440E]',
    formFieldSuccessText: 'text-[#22683F]',
    alertText: 'text-[#9B2E00]',
    logoBox: 'mb-2',
    logoImage: 'h-10 w-auto',
    socialButtonsBlockButton:
      'border border-[rgba(42,31,20,0.12)] bg-[#FFFCF5] hover:bg-white rounded-xl transition-colors',
    formButtonPrimary:
      'bg-gradient-to-r from-[#F5A623] to-[#C1440E] hover:brightness-105 text-white rounded-xl font-semibold shadow-[0_6px_14px_-6px_rgba(193,68,14,0.45)]',
    formFieldInput:
      'rounded-xl border border-[rgba(42,31,20,0.12)] bg-[#FFFCF5] text-[#2A1F14]',
    footerAction:
      'bg-[rgba(245,166,35,0.05)] border-t border-[rgba(42,31,20,0.06)]',
    dividerLine: 'bg-[rgba(42,31,20,0.08)]',
    alert:
      'bg-[#FDE1DC] border border-[rgba(155,46,0,0.2)] rounded-xl',
    otpCodeFieldInput:
      'rounded-xl border border-[rgba(42,31,20,0.12)] bg-[#FFFCF5] text-[#2A1F14]',
    formFieldRow: 'gap-2',
    main: 'gap-4',
  },
};

// ─── Hero panel (shared by sign-in / sign-up pages) ──────────────────────────
const floatingStats = [
  { icon: BarChart3, label: 'Daily Revenue', value: '₹24,530', color: '#F5A623' },
  { icon: Users,    label: 'Customers',     value: '1,124',   color: '#22683F' },
  { icon: TrendingUp, label: 'Growth',      value: '+18%',    color: '#C1440E' },
  { icon: Mic,      label: 'Voice Entries', value: '340 today', color: '#5A3778' },
];

function AuthHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden">
      <img
        src={heroShopkeeper}
        alt="VyapaarAI Kirana shopkeeper"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0800]/80 via-[#2A1000]/50 to-[#F5A623]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0800]/90 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col h-full p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5A623] to-[#C1440E] flex items-center justify-center shadow-lg">
            <span className="font-serif text-white text-xl font-bold leading-none">v</span>
          </div>
          <span className="font-serif text-xl font-bold text-white">
            Vyapaar<span className="text-[#F5A623]">AI</span>
          </span>
        </div>

        {/* Middle */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/30 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
            <span className="text-xs font-semibold text-[#F5A623] tracking-wide">
              India's Kirana OS
            </span>
          </div>
          <h2 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-4">
            The{' '}
            <span className="bg-gradient-to-r from-[#F5A623] to-[#E8901A] bg-clip-text text-transparent">
              Bahi Khata
            </span>
            <br />of the Future
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Join 10,000+ kirana store owners who track sales, manage udhaar,
            and grow smarter — all by voice.
          </p>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {floatingStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${s.color}22` }}
                  >
                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium">
                    {s.label}
                  </span>
                </div>
                <div className="font-serif text-lg font-bold text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer trust line */}
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#22683F]" />
          Free to start · No credit card required · Works in 12 languages
        </div>
      </div>
    </div>
  );
}

// ─── Sign-in / Sign-up pages ──────────────────────────────────────────────────
function SignInPage() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <AuthHeroPanel />
      <div className="flex-1 flex items-center justify-center px-6 py-10 kirana-bg relative">
        <div className="marigold-blur marigold-tl lg:hidden" style={{ opacity: 0.4 }} />
        <div className="marigold-blur marigold-br lg:hidden" style={{ opacity: 0.4 }} />
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <AuthHeroPanel />
      <div className="flex-1 flex items-center justify-center px-6 py-10 kirana-bg relative">
        <div className="marigold-blur marigold-tl lg:hidden" style={{ opacity: 0.4 }} />
        <div className="marigold-blur marigold-br lg:hidden" style={{ opacity: 0.4 }} />
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
        />
      </div>
    </div>
  );
}

// ─── Protected dashboard ──────────────────────────────────────────────────────
function AppDashboard() {
  const { user } = useAuth();
  const [view, setView] = useState<ViewKey>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [onboardingNeeded, setOnboardingNeeded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('merchant_profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setOnboardingNeeded(!data || !data.onboarding_complete);
      });
  }, [user]);

  if (onboardingNeeded === null) {
    return (
      <div className="min-h-screen kirana-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[rgba(193,68,14,0.3)] border-t-[#C1440E] rounded-full animate-spin" />
      </div>
    );
  }

  if (onboardingNeeded) {
    return (
      <OnboardingView onComplete={() => setOnboardingNeeded(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-paper kirana-bg">
      <Sidebar
        active={view}
        onSelect={setView}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6">
          {view === 'dashboard'      && <DashboardView onNavigate={setView} />}
          {view === 'inventory'      && <InventoryView />}
          {view === 'finance'        && <FinanceView />}
          {view === 'marketing'      && <MarketingView />}
          {view === 'customers'      && <CustomerView />}
          {view === 'suppliers'      && <SupplierView />}
          {view === 'weather'        && <WeatherView />}
          {view === 'festivals'      && <FestivalView />}
          {view === 'predictive'     && <PredictiveView />}
          {view === 'advisor'        && <AdvisorView />}
          {view === 'whatsapp'       && <WhatsappView />}
          {view === 'health'         && <HealthView />}
          {view === 'gamification'   && <GamificationView />}
          {view === 'reports'        && <ReportsView />}
          {view === 'notifications'  && <NotificationsView />}
          {view === 'voice'          && <VoiceAssistantView />}
          {view === 'settings'       && <ShopSettingsView />}
          {view === 'profile'        && <ProfileView />}
          {view === 'recommendations' && <AIRecommendationsView />}
        </main>
      </div>
    </div>
  );
}

// ─── Route components ─────────────────────────────────────────────────────────
function HomeRoute() {
  const [, setLocation] = useLocation();
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/app" />
      </Show>
      <Show when="signed-out">
        <LandingPage
          onGetStarted={() => setLocation('/sign-up')}
          onSignIn={() => setLocation('/sign-in')}
        />
      </Show>
    </>
  );
}

function ProtectedRoute() {
  return (
    <>
      <Show when="signed-in">
        <AuthProvider>
          <AppDashboard />
        </AuthProvider>
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const queryClient = new QueryClient();

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'Welcome back',
            subtitle: 'Sign in to your VyapaarAI dashboard',
          },
        },
        signUp: {
          start: {
            title: 'Create your account',
            subtitle: 'Start running your kirana smarter today',
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Switch>
            <Route path="/" component={HomeRoute} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/app" component={ProtectedRoute} />
            <Route><Redirect to="/" /></Route>
          </Switch>
        </LanguageProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

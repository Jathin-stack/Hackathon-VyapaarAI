import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2, Smartphone, KeyRound, RefreshCw, Mic, BarChart3, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import heroShopkeeper from '@/assets/hero-shopkeeper.jpg';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onBack: () => void;
  onToggleMode: () => void;
}

type AuthMethod = 'password' | 'otp' | 'forgot';

const floatingStats = [
  { icon: BarChart3, label: 'Daily Revenue', value: '₹24,530', color: '#F5A623', delay: 0.2 },
  { icon: Users, label: 'Customers', value: '1,124', color: '#22683F', delay: 0.5 },
  { icon: TrendingUp, label: 'Growth', value: '+18%', color: '#C1440E', delay: 0.8 },
  { icon: Mic, label: 'Voice Entries', value: '340 today', color: '#5A3778', delay: 1.1 },
];

export function AuthPage({ mode, onBack, onToggleMode }: AuthPageProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [method, setMethod] = useState<AuthMethod>('password');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const isSignUp = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); } else if (isSignUp) { setSuccess(true); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) { setError(error.message); } else { setOtpSent(true); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    setLoading(false);
    if (error) { setError(error.message); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) { setError(error.message); } else { setSuccess(true); }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const { error } = await signInWithGoogle(email);
    setLoading(false);
    if (error) {
      setError(error);
    }
  };

  const titleMap: Record<AuthMethod, string> = {
    password: isSignUp ? 'Create your account' : 'Welcome back',
    otp: 'Login with OTP',
    forgot: 'Reset your password',
  };
  const subtitleMap: Record<AuthMethod, string> = {
    password: isSignUp ? 'Start running your kirana smarter today' : 'Sign in to your VyapaarAI dashboard',
    otp: 'Enter your email to receive a one-time password',
    forgot: "Enter your email and we'll send you a reset link",
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left panel — hero image */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex lg:w-[52%] relative flex-col overflow-hidden"
      >
        {/* Full bleed image */}
        <img
          src={heroShopkeeper}
          alt="VyapaarAI Kirana shopkeeper"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Rich gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0800]/80 via-[#2A1000]/50 to-[#F5A623]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0800]/90 via-transparent to-transparent" />

        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <span className="font-serif text-white text-xl font-bold leading-none">v</span>
            </div>
            <span className="font-serif text-xl font-bold text-white">
              Vyapaar<span className="text-primary">AI</span>
            </span>
          </motion.div>

          {/* Middle text */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-6">
                <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-semibold text-primary-100 tracking-wide">India's Kirana OS</span>
              </div>
              <h2 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-4">
                The{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bahi Khata
                </span>
                <br />of the Future
              </h2>
              <p className="text-white/70 text-base leading-relaxed max-w-sm">
                Join 10,000+ kirana store owners who track sales, manage udhaar, and grow smarter — all by voice.
              </p>
            </motion.div>

            {/* Floating stat cards */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {floatingStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.12, duration: 0.5 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}22` }}>
                      <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-[10px] text-white/60 font-medium">{stat.label}</span>
                  </div>
                  <div className="font-serif text-lg font-bold text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex items-center gap-2 text-white/50 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-sale" />
            Free to start · No credit card required · Works in 12 languages
          </motion.div>
        </div>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col min-h-screen kirana-bg">
        {/* Mobile: marigold blurs */}
        <div className="lg:hidden">
          <div className="marigold-blur marigold-tl" style={{ opacity: 0.4 }} />
          <div className="marigold-blur marigold-br" style={{ opacity: 0.4 }} />
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto w-full">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-secondary transition-colors mb-8 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </motion.button>

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-2.5 mb-8 lg:hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <span className="font-serif text-white text-lg font-bold leading-none">v</span>
            </div>
            <span className="font-serif text-lg font-bold text-ink">Vyapaar<span className="text-primary-deep">AI</span></span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-8"
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-7">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow mb-3"
              >
                <Store className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-2xl font-bold text-ink"
              >
                {titleMap[method]}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-ink-soft mt-1 text-center"
              >
                {subtitleMap[method]}
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-sale-light flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-sale-deep" />
                  </motion.div>
                  <h3 className="font-serif text-xl font-bold text-ink mb-2">
                    {method === 'forgot' ? 'Check your email' : 'Account created!'}
                  </h3>
                  <p className="text-sm text-ink-soft mb-6">
                    {method === 'forgot'
                      ? "We've sent you a password reset link."
                      : "We've sent you a confirmation link. Click it to activate your account, then sign in."}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSuccess(false); setMethod('password'); onToggleMode(); }}
                    className="btn-primary w-full"
                  >
                    Continue to Sign In <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ) : method === 'password' ? (
                <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 rounded-xl bg-overdue-light border border-overdue/30 text-overdue-deep text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
                      </motion.div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint group-focus-within:text-secondary transition-colors" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="shopowner@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint group-focus-within:text-secondary transition-colors" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {!isSignUp && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-ink-200 text-secondary focus:ring-secondary/20" />
                          Remember me
                        </label>
                        <button type="button" onClick={() => setMethod('forgot')} className="text-sm font-semibold text-secondary hover:text-secondary-deep transition-colors">
                          Forgot password?
                        </button>
                      </div>
                    )}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 20px -6px rgba(193,68,14,0.45)' } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <>{isSignUp ? 'Create Account' : 'Sign In'}<ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </form>

                  <div className="flex items-center gap-3 my-5">
                    <div className="h-px flex-1 bg-ink-100" />
                    <span className="text-xs text-ink-faint font-medium">or continue with</span>
                    <div className="h-px flex-1 bg-ink-100" />
                  </div>

                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#fff' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm font-semibold transition-colors disabled:opacity-60"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      Continue with Google
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#fff' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMethod('otp')}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm font-semibold transition-colors disabled:opacity-60"
                    >
                      <Smartphone className="w-5 h-5 text-secondary" />
                      Login with OTP
                    </motion.button>
                  </div>
                </motion.div>
              ) : method === 'otp' ? (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 rounded-xl bg-overdue-light border border-overdue/30 text-overdue-deep text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
                      </motion.div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={otpSent} placeholder="shopowner@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all disabled:opacity-60" />
                      </div>
                    </div>
                    <AnimatePresence>
                      {otpSent && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Enter OTP</label>
                          <div className="relative">
                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                            <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} placeholder="6-digit code"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all tracking-widest" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}} className="btn-primary w-full py-3 disabled:opacity-60">
                      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : otpSent ? <><CheckCircle2 className="w-4 h-4" /> Verify OTP</> : <><Smartphone className="w-4 h-4" /> Send OTP</>}
                    </motion.button>
                    {otpSent && (
                      <button type="button" onClick={() => setOtpSent(false)} className="w-full flex items-center justify-center gap-1.5 text-sm text-ink-soft hover:text-secondary transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                      </button>
                    )}
                  </form>
                  <button onClick={() => setMethod('password')} className="w-full text-center text-sm text-ink-soft hover:text-secondary mt-4 transition-colors">Back to password login</button>
                </motion.div>
              ) : (
                <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 p-3 rounded-xl bg-overdue-light border border-overdue/30 text-overdue-deep text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span>
                      </motion.div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="shopowner@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" />
                      </div>
                    </div>
                    <motion.button type="submit" disabled={loading} whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}} className="btn-primary w-full py-3 disabled:opacity-60">
                      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><RefreshCw className="w-4 h-4" /> Send Reset Link</>}
                    </motion.button>
                  </form>
                  <button onClick={() => setMethod('password')} className="w-full text-center text-sm text-ink-soft hover:text-secondary mt-4 transition-colors">Back to sign in</button>
                </motion.div>
              )}
            </AnimatePresence>

            {method === 'password' && !success && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center text-sm text-ink-soft mt-6">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={onToggleMode} className="font-semibold text-secondary hover:text-secondary-deep transition-colors">
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

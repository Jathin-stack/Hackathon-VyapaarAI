import { useState } from 'react';
import { Store, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle2, Smartphone, KeyRound, RefreshCw } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  mode: 'signin' | 'signup';
  onBack: () => void;
  onToggleMode: () => void;
}

type AuthMethod = 'password' | 'otp' | 'forgot';

export function AuthPage({ mode, onBack, onToggleMode }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
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

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error);
    } else if (isSignUp) {
      setSuccess(true);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    setLoading(false);
    if (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setError(error.message);
      setLoading(false);
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
    forgot: 'Enter your email and we\'ll send you a reset link',
  };

  return (
    <div className="min-h-screen kirana-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="marigold-blur marigold-tl" />
      <div className="marigold-blur marigold-br" />

      <div className="w-full max-w-md relative animate-slideUp">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow mb-3">
              <Store className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink">{titleMap[method]}</h1>
            <p className="text-sm text-ink-soft mt-1">{subtitleMap[method]}</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-sale-light flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-sale-deep" />
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2">
                {method === 'forgot' ? 'Check your email' : 'Account created!'}
              </h3>
              <p className="text-sm text-ink-soft mb-6">
                {method === 'forgot'
                  ? 'We\'ve sent you a password reset link. Click it to set a new password.'
                  : 'We\'ve sent you a confirmation link. Click it to activate your account, then sign in.'}
              </p>
              <button onClick={() => { setSuccess(false); setMethod('password'); onToggleMode(); }} className="btn-primary w-full">
                Continue to Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : method === 'password' ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-overdue-light border border-overdue/30 text-overdue-deep text-sm animate-fadeIn">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="shopowner@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder={isSignUp ? 'At least 6 characters' : 'Your password'} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-soft transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-ink-200 text-secondary focus:ring-secondary/20" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => setMethod('forgot')} className="text-sm font-semibold text-secondary hover:text-secondary-deep transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isSignUp ? 'Create Account' : 'Sign In'}<ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-ink-100" />
                <span className="text-xs text-ink-faint font-medium">or continue with</span>
                <div className="h-px flex-1 bg-ink-100" />
              </div>

              {/* Social + OTP */}
              <div className="space-y-2">
                <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm font-semibold hover:bg-white transition-colors disabled:opacity-60">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
                <button onClick={() => setMethod('otp')} disabled={loading} className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm font-semibold hover:bg-white transition-colors disabled:opacity-60">
                  <Smartphone className="w-5 h-5 text-secondary" />
                  Login with OTP
                </button>
              </div>
            </>
          ) : method === 'otp' ? (
            <>
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-overdue-light border border-overdue/30 text-overdue-deep text-sm animate-fadeIn">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={otpSent} placeholder="shopowner@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all disabled:opacity-60" />
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Enter OTP</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} placeholder="6-digit code" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all tracking-widest" />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{otpSent ? <><CheckCircle2 className="w-4 h-4" /> Verify OTP</> : <><Smartphone className="w-4 h-4" /> Send OTP</>}</>}
                </button>

                {otpSent && (
                  <button type="button" onClick={() => setOtpSent(false)} className="w-full flex items-center justify-center gap-1.5 text-sm text-ink-soft hover:text-secondary transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Resend OTP
                  </button>
                )}
              </form>
              <button onClick={() => setMethod('password')} className="w-full text-center text-sm text-ink-soft hover:text-secondary mt-4 transition-colors">
                Back to password login
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-overdue-light border border-overdue/30 text-overdue-deep text-sm animate-fadeIn">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="shopowner@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><RefreshCw className="w-4 h-4" /> Send Reset Link</>}
                </button>
              </form>
              <button onClick={() => setMethod('password')} className="w-full text-center text-sm text-ink-soft hover:text-secondary mt-4 transition-colors">
                Back to sign in
              </button>
            </>
          )}

          {method === 'password' && !success && (
            <p className="text-center text-sm text-ink-soft mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={onToggleMode} className="font-semibold text-secondary hover:text-secondary-deep transition-colors">
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

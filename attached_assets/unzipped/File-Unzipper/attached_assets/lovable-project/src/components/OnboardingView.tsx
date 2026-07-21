import { useState } from 'react';
import { Store, User, Phone, FileText, MapPin, Globe, Package, Users, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Brain, TrendingUp } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { LANGUAGES } from '../i18n/languages';

const SHOP_CATEGORIES = ['Kirana Store', 'Grocery Store', 'Super Market', 'Clothing Store', 'Restaurant', 'Medical Store', 'Bakery', 'Electronics Store', 'Retail Store', 'MSME', 'General Business'];

interface OnboardingViewProps {
  onComplete: () => void;
}

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const { t, setLang } = useLang();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    shop_name: '', merchant_name: '', phone: '', gst_number: '',
    shop_category: 'Kirana Store', business_type: 'Retail',
    language_preference: 'en', shop_address: '', city: '', state: '',
  });

  const totalSteps = 5;
  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('merchant_profiles').upsert({
      id: user.id, ...data, onboarding_complete: true, updated_at: new Date().toISOString(),
    });
    setLang(data.language_preference as any);
    setSaving(false);
    onComplete();
  };


  return (
    <div className="min-h-screen kirana-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="marigold-blur marigold-tl" />
      <div className="marigold-blur marigold-br" />

      <div className="w-full max-w-2xl relative animate-slideUp">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow mx-auto mb-3">
            <Store className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink">{t('welcomeOnboarding')}</h1>
          <p className="text-sm text-ink-soft mt-1">{t('setupYourShop')}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[Store, MapPin, Globe, Package, CheckCircle2].map((Icon, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${i + 1 <= step ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-ink-100 text-ink-faint'}`}>
                {i + 1 < step ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              {i < 5 - 1 && <div className={`w-8 h-0.5 mx-0.5 ${i + 1 < step ? 'bg-secondary' : 'bg-ink-100'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-ink">{t('basicInfo')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('businessName')}</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="text" value={data.shop_name} onChange={e => setData(d => ({ ...d, shop_name: e.target.value }))} placeholder="My Kirana Store" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('merchantName')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="text" value={data.merchant_name} onChange={e => setData(d => ({ ...d, merchant_name: e.target.value }))} placeholder="Your name" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('phoneNumber')}</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="tel" value={data.phone} onChange={e => setData(d => ({ ...d, phone: e.target.value }))} placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('gstNumber')} <span className="text-ink-faint normal-case">(optional)</span></label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <input type="text" value={data.gst_number} onChange={e => setData(d => ({ ...d, gst_number: e.target.value }))} placeholder="29ABCDE1234F1Z5" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shop Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-ink">{t('shopDetails')}</h2>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('shopCategory')}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SHOP_CATEGORIES.map(c => (
                    <button key={c} onClick={() => setData(d => ({ ...d, shop_category: c }))} className={`chip text-xs justify-center py-2.5 ${data.shop_category === c ? 'active' : ''}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('businessType')}</label>
                <select value={data.business_type} onChange={e => setData(d => ({ ...d, business_type: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary">
                  {['Retail', 'Wholesale', 'Service', 'Manufacturing', 'Hybrid'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('shopAddress')}</label>
                <textarea value={data.shop_address} onChange={e => setData(d => ({ ...d, shop_address: e.target.value }))} placeholder="Shop address" rows={2} className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('city')}</label>
                  <input type="text" value={data.city} onChange={e => setData(d => ({ ...d, city: e.target.value }))} placeholder="City" className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('state')}</label>
                  <input type="text" value={data.state} onChange={e => setData(d => ({ ...d, state: e.target.value }))} placeholder="State" className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Language */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-ink">{t('languageSetup')}</h2>
              <p className="text-sm text-ink-soft">Select your preferred language. Everything will be in this language.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setData(d => ({ ...d, language_preference: l.code }))} className={`chip text-sm justify-center py-3 ${data.language_preference === l.code ? 'active' : ''}`}>
                    <span className="font-semibold">{l.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: AI Auto-Setup */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-ink">AI Auto-Setup</h2>
              <p className="text-sm text-ink-soft">VyapaarAI will automatically configure these profiles for you:</p>
              <div className="space-y-2">
                {[
                  { icon: Package, label: 'Inventory Profile', desc: 'Stock levels, reorder points, categories' },
                  { icon: TrendingUp, label: 'Sales Profile', desc: 'Revenue tracking, profit analysis, trends' },
                  { icon: Brain, label: 'Business Intelligence', desc: 'AI insights, forecasts, recommendations' },
                  { icon: Sparkles, label: 'Marketing Profile', desc: 'Campaigns, offers, customer outreach' },
                  { icon: Users, label: 'Customer Profile', desc: 'Segments, loyalty, behavior analysis' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-primary-50/40 border border-primary-100 animate-slideUp" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <item.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">{item.label}</p>
                      <p className="text-xs text-ink-soft">{item.desc}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-sale" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-glow">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink">{t('allSet')}</h2>
              <p className="text-sm text-ink-soft mt-2 max-w-sm mx-auto">
                Your shop is ready. VyapaarAI is now running autonomously in the background, optimizing your business 24/7.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-sale-deep">
                  <Sparkles className="w-4 h-4" />
                  6 AI agents activated
                </div>
                <div className="flex items-center gap-2 text-sm text-sale-deep">
                  <Brain className="w-4 h-4" />
                  Business intelligence ready
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-ink-100">
            <button onClick={back} disabled={step === 1} className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-xs text-ink-faint">{t('step')} {step} {t('of')} {totalSteps}</span>
            {step < totalSteps ? (
              <button onClick={next} className="btn-primary">
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={finish} disabled={saving} className="btn-primary">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {t('getStarted')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


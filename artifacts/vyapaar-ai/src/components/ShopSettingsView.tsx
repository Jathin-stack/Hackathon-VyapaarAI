import { useState, useEffect } from 'react';
import { Store, User, Phone, MapPin, FileText, Save, CheckCircle2, Building2, Globe } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { LANGUAGES } from '../i18n/languages';

const SHOP_CATEGORIES = ['Kirana Store', 'Grocery Store', 'Super Market', 'Clothing Store', 'Restaurant', 'Medical Store', 'Bakery', 'Electronics Store', 'Retail Store', 'MSME', 'General Business'];

export function ShopSettingsView() {
  const { t } = useLang();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    shop_name: '', merchant_name: '', phone: '', gst_number: '', shop_category: 'Kirana Store',
    business_type: 'Retail', language_preference: 'en', shop_address: '', city: '', state: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('merchant_profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({
        shop_name: data.shop_name, merchant_name: data.merchant_name, phone: data.phone || '',
        gst_number: data.gst_number || '', shop_category: data.shop_category, business_type: data.business_type,
        language_preference: data.language_preference, shop_address: data.shop_address || '',
        city: data.city || '', state: data.state || '',
      });
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('merchant_profiles').upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" /></div>;
  }

  const fields = [
    { key: 'shop_name', label: t('businessName'), icon: Store, type: 'text' },
    { key: 'merchant_name', label: t('merchantName'), icon: User, type: 'text' },
    { key: 'phone', label: t('phoneNumber'), icon: Phone, type: 'tel' },
    { key: 'gst_number', label: t('gstNumber'), icon: FileText, type: 'text', optional: true },
    { key: 'shop_address', label: t('shopAddress'), icon: MapPin, type: 'text' },
    { key: 'city', label: t('city'), icon: Building2, type: 'text' },
    { key: 'state', label: t('state'), icon: MapPin, type: 'text' },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="animate-slideUp">
        <h1 className="font-serif text-2xl font-bold text-ink">{t('shopSettings')}</h1>
        <p className="text-sm text-ink-soft mt-1">{t('shopInformation')}</p>
      </div>

      <div className="card p-6 space-y-5 animate-slideUp">
        <div className="grid md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                {f.label} {f.optional && <span className="text-ink-faint normal-case">(optional)</span>}
              </label>
              <div className="relative">
                <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type={f.type}
                  value={(profile as any)[f.key]}
                  onChange={(e) => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('shopCategory')}</label>
            <select
              value={profile.shop_category}
              onChange={(e) => setProfile(p => ({ ...p, shop_category: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary"
            >
              {SHOP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('businessType')}</label>
            <select
              value={profile.business_type}
              onChange={(e) => setProfile(p => ({ ...p, business_type: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary"
            >
              {['Retail', 'Wholesale', 'Service', 'Manufacturing', 'Hybrid'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{t('preferredLanguage')}</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <select
                value={profile.language_preference}
                onChange={(e) => setProfile(p => ({ ...p, language_preference: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary"
              >
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {t('saveChanges')}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-sale-deep animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              {t('changesSaved')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

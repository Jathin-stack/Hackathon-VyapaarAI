import { useState, useEffect } from 'react';
import { User, Mail, Phone, Store, MapPin, Calendar, Edit3, Save, TrendingUp, Award, Package } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabase';
import { growthScore, achievements } from '../data/businessData';

export function ProfileView() {
  const { t } = useLang();
  const { user } = useAuth();
  const [profile, setProfile] = useState({ shop_name: '', merchant_name: '', phone: '', city: '', state: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('merchant_profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({
        shop_name: data.shop_name, merchant_name: data.merchant_name,
        phone: data.phone || '', city: data.city || '', state: data.state || '',
      });
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    await supabase.from('merchant_profiles').upsert({ id: user.id, ...profile, updated_at: new Date().toISOString() });
    setEditing(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" /></div>;
  }

  const earnedAchievements = achievements.filter(a => a.earned);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="animate-slideUp">
        <h1 className="font-serif text-2xl font-bold text-ink">{t('profile')}</h1>
        <p className="text-sm text-ink-soft mt-1">Your account and business profile</p>
      </div>

      {/* Profile header card */}
      <div className="hero-card p-6 text-white animate-slideUp">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
            <Store className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold">{profile.shop_name || 'My Shop'}</h2>
            <p className="text-white/80 text-sm mt-0.5">{profile.merchant_name || 'Merchant'} • {profile.city || 'City'}, {profile.state || 'State'}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">Level {growthScore.level}</span>
              <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">{growthScore.points} pts</span>
              <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">{growthScore.streak} day streak</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold transition-colors">
            <Edit3 className="w-4 h-4" />
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card p-6 animate-slideUp">
        <h3 className="font-serif text-lg font-bold text-ink mb-4">Account Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: user?.email || '' },
            { icon: User, label: t('merchantName'), value: profile.merchant_name, key: 'merchant_name' },
            { icon: Phone, label: t('phoneNumber'), value: profile.phone, key: 'phone' },
            { icon: Store, label: t('businessName'), value: profile.shop_name, key: 'shop_name' },
            { icon: MapPin, label: t('city'), value: profile.city, key: 'city' },
            { icon: MapPin, label: t('state'), value: profile.state, key: 'state' },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">{f.label}</label>
              {editing && f.key ? (
                <input
                  type="text"
                  value={(profile as any)[f.key] || ''}
                  onChange={(e) => setProfile(p => ({ ...p, [f.key!]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-paper-card text-ink text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                />
              ) : (
                <div className="flex items-center gap-2 text-sm text-ink">
                  <f.icon className="w-4 h-4 text-ink-faint" />
                  <span>{f.value || '—'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {editing && (
          <button onClick={handleSave} className="btn-primary mt-4">
            <Save className="w-4 h-4" />
            {t('saveChanges')}
          </button>
        )}
      </div>

      {/* Achievements */}
      <div className="card p-6 animate-slideUp">
        <h3 className="font-serif text-lg font-bold text-ink mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {earnedAchievements.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{a.name}</p>
                <p className="text-xs text-ink-soft">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Growth Score', value: `${growthScore.current}/100` },
          { icon: Award, label: 'Achievements', value: `${earnedAchievements.length}/${achievements.length}` },
          { icon: Package, label: 'Products', value: '16' },
          { icon: Calendar, label: 'Member Since', value: 'Jul 2025' },
        ].map((s, i) => (
          <div key={i} className="card p-4 animate-slideUp">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center mb-2">
              <s.icon className="w-4.5 h-4.5 text-secondary" />
            </div>
            <p className="font-serif text-lg font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

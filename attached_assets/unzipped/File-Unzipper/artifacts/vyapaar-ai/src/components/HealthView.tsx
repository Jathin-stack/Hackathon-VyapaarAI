import { Heart, Package, Wallet, TrendingUp, IndianRupee, Users, Megaphone, Target, Zap } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { ProgressBar } from './ui';
import { healthScores } from '../data/businessData';
import type { TranslationKey } from '../i18n/translations';

export function HealthView() {
  const { t } = useLang();

  const scores = [
    { key: 'inventoryScore' as TranslationKey, value: healthScores.inventory, icon: Package, color: '#1f9e6a' },
    { key: 'financeScore' as TranslationKey, value: healthScores.finance, icon: Wallet, color: '#45b985' },
    { key: 'salesScore' as TranslationKey, value: healthScores.sales, icon: TrendingUp, color: '#7ad1a8' },
    { key: 'profitScore' as TranslationKey, value: healthScores.profit, icon: IndianRupee, color: '#aee3c8' },
    { key: 'customerScore' as TranslationKey, value: healthScores.customer, icon: Users, color: '#1f9e6a' },
    { key: 'marketingScore' as TranslationKey, value: healthScores.marketing, icon: Megaphone, color: '#45b985' },
    { key: 'demandScore' as TranslationKey, value: healthScores.demand, icon: Target, color: '#7ad1a8' },
    { key: 'accuracyScore' as TranslationKey, value: healthScores.accuracy, icon: Zap, color: '#aee3c8' },
  ];

  const getLabel = (v: number) => v >= 90 ? t('excellent') : v >= 75 ? t('healthy') : v >= 60 ? t('needsAttention') : t('critical');
  const getVariant = (v: number) => v >= 90 ? 'text-brand-600' : v >= 75 ? 'text-brand-600' : v >= 60 ? 'text-amber-600' : 'text-rose-600';

  return (
    <div className="space-y-6">
      {/* Overall health hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-6 text-white shadow-lg animate-slideUp">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-6">
          <div className="relative h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="75%" outerRadius="100%" data={[{ value: healthScores.overall, fill: 'rgba(255,255,255,0.9)' }]} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: 'rgba(255,255,255,0.2)' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{healthScores.overall}</span>
              <span className="text-xs opacity-80">/100</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">{t('businessHealth')}</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold">{t('overall')}: {getLabel(healthScores.overall)}</h2>
            <p className="mt-1 text-sm opacity-90">{t('aiConfidence')}: {healthScores.accuracy}% • {t('workingAutomatically')}</p>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scores.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="card card-hover p-5 animate-slideUp">
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-2.5" style={{ background: `${s.color}20` }}>
                  <Icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <span className={`text-xs font-bold ${getVariant(s.value)}`}>{getLabel(s.value)}</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-ink-900">{s.value}<span className="text-sm text-ink-400">/100</span></p>
              <p className="stat-label mt-1">{t(s.key)}</p>
              <div className="mt-2"><ProgressBar value={s.value} color={s.value >= 75 ? 'brand' : s.value >= 60 ? 'amber' : 'rose'} /></div>
            </div>
          );
        })}
      </div>

      {/* Health trends */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('growthTrajectory')}</h3>
        <div className="space-y-3">
          {scores.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs font-medium text-ink-500">{t(s.key)}</span>
              <div className="flex-1"><ProgressBar value={s.value} color={s.value >= 75 ? 'brand' : s.value >= 60 ? 'amber' : 'rose'} /></div>
              <span className="w-10 text-right text-xs font-bold text-ink-700">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

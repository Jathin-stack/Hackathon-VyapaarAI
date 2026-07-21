import { Sparkles, Calendar, Gift, TrendingUp, ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { festivals, localEvents } from '../data/businessData';

export function FestivalView() {
  const { t } = useLang();

  const upcoming = [...festivals].sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Sparkles} label={t('festivals')} value={`${festivals.length}`} color="brand" />
        <StatCard icon={Calendar} label={t('festivalDate')} value={upcoming[0].name} sublabel={upcoming[0].date} color="amber" />
        <StatCard icon={TrendingUp} label={t('expectedDemand')} value={`${upcoming[0].demandMultiplier}x`} color="brand" trend="up" />
        <StatCard icon={Gift} label={t('festiveOffers')} value={`${upcoming[0].offerTypes.length}`} color="blue" />
      </div>

      {/* Upcoming festivals */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('festivalIntel')}</h3>
        <div className="space-y-3">
          {upcoming.map((f) => (
            <div key={f.id} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-200 hover:shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50">
                    <Sparkles className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{f.name}</p>
                    <p className="text-xs text-ink-400">{f.date} • {f.daysUntil} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand">{f.demandMultiplier}x {t('expectedDemand')}</Badge>
                  <Badge variant="warning">{f.daysUntil}d</Badge>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {f.products.map((p) => (
                  <span key={p} className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{p}</span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {f.offerTypes.map((o) => (
                  <span key={o} className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{o}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local events */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('localEvents')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {localEvents.map((e) => (
            <div key={e.id} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink-900">{e.name}</p>
                <Badge variant={e.impact === 'high' ? 'danger' : e.impact === 'medium' ? 'warning' : 'neutral'}>{e.impact}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-400">{e.date}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {e.products.map((p) => (
                  <span key={p} className="rounded bg-ink-50 px-2 py-0.5 text-xs text-ink-600">{p}</span>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-ink-500">{t('revenueForecast')}: <span className="font-bold text-brand-600">₹{e.expectedRevenue.toLocaleString()}</span></span>
                <button className="flex items-center gap-1 text-xs font-semibold text-brand-600">{t('stockRecommendation')} <ArrowRight className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

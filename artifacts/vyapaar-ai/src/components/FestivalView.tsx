import { Sparkles, Calendar, Gift, TrendingUp, ArrowRight, Send, Timer, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { festivals, localEvents, customers } from '../data/businessData';
import { generateFestivalCampaigns, getCountdownData, getFestivalStockRecommendations } from '../services/festivalEngine';
import { sendWhatsApp } from '../services/whatsappService';

export function FestivalView() {
  const { t } = useLang();
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0);

  // Live countdown tick every minute
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const campaigns = generateFestivalCampaigns();
  const countdown = getCountdownData();
  const stockRecs = getFestivalStockRecommendations();
  const upcoming = campaigns[0];

  const markSent = (id: string) => setSent((prev) => new Set([...prev, id]));

  const urgencyStyle = (u: string) => {
    if (u === 'now') return 'border-red-200 bg-red-50/30';
    if (u === 'soon') return 'border-amber-200 bg-amber-50/30';
    return 'border-ink-100';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Sparkles}    label={t('festivals')}       value={`${festivals.length}`}              color="brand" />
        <StatCard icon={Calendar}    label="Next Festival"         value={upcoming?.festival.name ?? '—'}     sublabel={upcoming ? `in ${upcoming.festival.daysUntil} days` : ''} color="amber" />
        <StatCard icon={TrendingUp}  label={t('expectedDemand')}  value={`${upcoming?.festival.demandMultiplier ?? 1}x`} color="brand" trend="up" />
        <StatCard icon={Gift}        label="Campaigns Ready"       value={`${campaigns.length}`}              color="blue" />
      </div>

      {/* Live countdown cards */}
      <div className="grid gap-4 sm:grid-cols-3 animate-slideUp">
        {countdown.map((cd) => (
          <div key={cd.festival.id} className={`rounded-2xl border p-4 transition-all ${cd.urgency === 'today' ? 'border-red-200 bg-red-50' : cd.urgency === 'this-week' ? 'border-amber-200 bg-amber-50' : 'border-ink-100 bg-paper-card'}`}>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-brand-600" />
              <p className="text-xs font-bold text-ink-500 uppercase tracking-wider">Countdown</p>
            </div>
            <p className="mt-2 text-lg font-bold text-ink-900">{cd.festival.name}</p>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-4xl font-black text-brand-600">{cd.daysLeft}</span>
              <span className="mb-1 text-sm text-ink-400">days left</span>
            </div>
            <p className="text-xs text-ink-400">{cd.festival.date}</p>
          </div>
        ))}
      </div>

      {/* Festival campaigns with WhatsApp send */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">AI Festival Campaign Messages</h3>
          <Badge variant="brand">Auto-Generated</Badge>
        </div>
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const id = `campaign-${campaign.festival.id}`;
            const isSent = sent.has(id);
            return (
              <div key={id} className={`rounded-xl border p-4 transition-all hover:shadow-sm ${urgencyStyle(campaign.urgency)}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 shrink-0">
                      <Sparkles className="h-5 w-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{campaign.festival.name}</p>
                      <p className="text-xs text-ink-400">{campaign.festival.date} · {campaign.festival.daysUntil} days · {campaign.festival.demandMultiplier}x demand</p>
                    </div>
                  </div>
                  <Badge variant={campaign.urgency === 'now' ? 'danger' : campaign.urgency === 'soon' ? 'warning' : 'neutral'}>
                    {campaign.urgency === 'now' ? '🔥 Send Now!' : campaign.urgency === 'soon' ? '⏰ Send Soon' : '📅 Upcoming'}
                  </Badge>
                </div>

                {/* Suggested products */}
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-bold text-ink-400 uppercase tracking-wider">Stock These Products</p>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.suggestedProducts.map((p) => (
                      <span key={p} className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">{p}</span>
                    ))}
                  </div>
                </div>

                {/* Offers */}
                <div className="mt-3">
                  <p className="mb-1.5 text-[10px] font-bold text-ink-400 uppercase tracking-wider">Suggested Offers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.offers.slice(0, 4).map((o) => (
                      <span key={o} className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{o}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => { sendWhatsApp(customers[0].phone, campaign.message); markSent(id); }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all min-w-[140px] ${isSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
                  >
                    <Send className="h-3 w-3" /> {isSent ? `Sent to ${campaign.targetCustomers} customers ✓` : `Send WhatsApp Campaign`}
                  </button>
                  <button
                    onClick={() => navigator.clipboard?.writeText(campaign.message)}
                    className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-600 hover:bg-ink-50"
                  >
                    Copy Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Festival stock recommendations */}
      {stockRecs.length > 0 && (
        <div className="card p-5 animate-slideUp">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-ink-900">Festival Stock Recommendations</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {stockRecs.map((rec, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{rec.product}</p>
                  <p className="text-xs text-ink-400">For {rec.festival} · in {rec.daysUntil} days</p>
                </div>
                <Badge variant={rec.multiplier >= 3 ? 'danger' : rec.multiplier >= 2 ? 'warning' : 'success'}>
                  {rec.multiplier}x demand
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <span className="text-xs text-ink-500">
                  {t('revenueForecast')}: <span className="font-bold text-brand-600">₹{e.expectedRevenue.toLocaleString()}</span>
                </span>
                <button
                  onClick={() => sendWhatsApp(customers[0].phone, `📢 ${e.name} Special!\n\nDon't miss our special offers for ${e.name}.\n\nVisit our store for great deals on ${e.products.join(', ')}!`)}
                  className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  {t('stockRecommendation')} <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { TrendingUp, Brain, Target, Zap, ShoppingCart, Send, Cloud, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge, ProgressBar } from './ui';
import { monthlyRevenueData, weeklySalesData, healthScores, weatherForecast } from '../data/businessData';
import { generateBuyRecommendations, getTopBuyList, getPredictedHighDemand, getBuyRecommendationReasons } from '../services/inventoryPrediction';
import { sendWhatsApp, predictiveBuyMessage } from '../services/whatsappService';

const STORE_PHONE = '+91 98765 00000';

export function PredictiveView() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  const buyRecs = generateBuyRecommendations().slice(0, 8);
  const topBuy = getTopBuyList(5);
  const highDemand = getPredictedHighDemand();
  const reasons = getBuyRecommendationReasons();
  const tomorrow = weatherForecast[1];

  const forecastData = [
    ...monthlyRevenueData.slice(-3),
    { month: 'Aug', revenue: 138000, expense: 82000, profit: 56000 },
    { month: 'Sep', revenue: 145000, expense: 85000, profit: 60000 },
    { month: 'Oct', revenue: 168000, expense: 95000, profit: 73000 },
    { month: 'Nov', revenue: 152000, expense: 88000, profit: 64000 },
  ];

  const demandData = buyRecs.map((r) => ({
    name: r.product.name.length > 8 ? r.product.name.slice(0, 8) : r.product.name,
    predicted: Math.round(r.product.soldWeek * r.predictedDemandMultiplier / 7),
    current: r.product.soldToday,
  }));

  const accuracyData = [{ name: 'Accuracy', value: healthScores.accuracy, fill: '#1f9e6a' }];

  const predictMsg = predictiveBuyMessage(
    topBuy.map((b) => ({ name: b.name, qty: b.qty })),
    reasons,
  );

  const weatherEmoji = { rainy: '🌧️', hot: '☀️', sunny: '🌤️', cloudy: '☁️', cold: '❄️', storm: '⛈️' }[tomorrow.condition] ?? '🌦️';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label={t('revenueForecast')} value="₹1,68,000" sublabel="Oct 2025" trend="up" color="brand" />
        <StatCard icon={Brain}      label={t('profitForecast')}  value="₹73,000"   sublabel="Oct 2025" trend="up" color="brand" />
        <StatCard icon={Target}     label={t('accuracyValue')}   value={`${healthScores.accuracy}%`} trend="up" color="blue" />
        <StatCard icon={Zap}        label={t('aiConfidence')}    value="92%"        color="brand" />
      </div>

      {/* AI Predictive Buying System */}
      <div className="card p-5 animate-slideUp border-l-4 border-l-brand-500">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
              <Brain className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">AI Predictive Buying System</h3>
              <p className="text-xs text-ink-500">Analyzing weather · festivals · trends · weekly sales</p>
            </div>
          </div>
          <Badge variant="brand"><Sparkles className="h-3 w-3" /> Auto-Generated</Badge>
        </div>

        {/* Reasons banner */}
        <div className="mb-4 rounded-xl bg-brand-50 p-3">
          <p className="mb-2 text-[10px] font-bold text-brand-700 uppercase tracking-wider">Why buy today?</p>
          <div className="flex flex-wrap gap-2">
            {reasons.map((r, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-sm border border-brand-100">
                {i === 0 ? <Cloud className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />} {r}
              </span>
            ))}
          </div>
        </div>

        {/* Buy recommendations */}
        <div className="grid gap-2 sm:grid-cols-2">
          {buyRecs.map((rec) => {
            const priorityColor = rec.priority === 'urgent' ? 'border-red-200 bg-red-50/40' : rec.priority === 'high' ? 'border-amber-200 bg-amber-50/30' : 'border-ink-100';
            const priorityBadge = rec.priority === 'urgent' ? 'danger' : rec.priority === 'high' ? 'warning' : 'neutral';
            return (
              <div key={rec.product.id} className={`rounded-xl border p-3 transition-all ${priorityColor}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{rec.product.name}</p>
                    <p className="text-xs text-ink-500">{rec.product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-brand-600">{rec.recommendedQty} units</p>
                    <Badge variant={priorityBadge as any}>{rec.priority}</Badge>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {rec.reason.slice(0, 2).map((r, i) => (
                    <span key={i} className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-ink-600 border border-ink-100">{r}</span>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-ink-400">
                  <span>Stock: {rec.product.stock} / Reorder: {rec.product.reorderLevel}</span>
                  <span className="font-bold text-ink-600">{rec.predictedDemandMultiplier.toFixed(1)}x demand</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send to WhatsApp */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => { sendWhatsApp(STORE_PHONE, predictMsg); setSent(true); }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all min-w-[180px] ${sent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
          >
            <Send className="h-4 w-4" /> {sent ? 'Sent to Your WhatsApp ✓' : 'Send Buy Plan to WhatsApp'}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-ink-400">
          {weatherEmoji} Tomorrow: {tomorrow.condition} · {tomorrow.temp}°C · {tomorrow.humidity}% humidity
        </p>
      </div>

      {/* Revenue forecast */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900">{t('revenueForecast')}</h3>
          <Badge variant="brand"><Brain className="h-3 w-3" /> {t('predictiveModel')}</Badge>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f9e6a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1f9e6a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#1f9e6a" strokeWidth={2.5} fill="url(#forecastGrad)" name={t('revenue')} />
            <Area type="monotone" dataKey="profit" stroke="#45b985" strokeWidth={2} fill="none" name={t('profit')} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Demand chart */}
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('demandPrediction')} — Tomorrow</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} cursor={{ fill: '#f6f7f9' }} />
              <Bar dataKey="predicted" fill="#1f9e6a" radius={[4, 4, 0, 0]} name="Predicted" />
              <Bar dataKey="current" fill="#aee3c8" radius={[4, 4, 0, 0]} name="Today" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI accuracy gauge */}
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('aiConfidence')}</h3>
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="75%" outerRadius="100%" data={accuracyData} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-ink-900">{healthScores.accuracy}%</span>
                <span className="text-xs text-ink-400">{t('accuracyValue')}</span>
              </div>
            </div>
            <div className="mt-4 w-full space-y-2">
              <div>
                <div className="flex justify-between text-xs"><span className="text-ink-500">{t('demandScore')}</span><span className="font-semibold">{healthScores.demand}/100</span></div>
                <ProgressBar value={healthScores.demand} />
              </div>
              <div>
                <div className="flex justify-between text-xs"><span className="text-ink-500">{t('accuracyScore')}</span><span className="font-semibold">{healthScores.accuracy}/100</span></div>
                <ProgressBar value={healthScores.accuracy} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal patterns */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('seasonalPatterns')}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            <Line type="monotone" dataKey="sales"  stroke="#1f9e6a" strokeWidth={2.5} dot={{ r: 4, fill: '#1f9e6a' }}  name={t('weeklySales')} />
            <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={2}   dot={{ r: 4, fill: '#f59e0b' }}  name={t('profit')} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { TrendingUp, IndianRupee, ShoppingBag, AlertTriangle, Users, Sparkles, Cloud, Brain, ArrowRight, Send, ShoppingCart, Bell, Timer, Flower2, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge, ProgressBar } from './ui';
import { businessMetrics, healthScores, weeklySalesData, categoryData, hourlySalesData, weatherForecast } from '../data/businessData';
import { allAgentInsights, getAgentName } from '../ai/agents';
import { getTopBuyList, getLowStockItems, getPredictedHighDemand, getBuyRecommendationReasons } from '../services/inventoryPrediction';
import { getCountdownData } from '../services/festivalEngine';
import { generateNotifications } from '../services/notificationService';
import { sendWhatsApp, morningReportMessage, predictiveBuyMessage } from '../services/whatsappService';
import type { ViewKey } from './Sidebar';

const STORE_PHONE = '+91 98765 00000';

export function DashboardView({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  const { t, lang } = useLang();
  const [reportSent, setReportSent] = useState(false);
  const [buySent, setBuySent] = useState(false);
  const [salesToday] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('vyapaar-today-sales');
    return saved ? parseFloat(saved) : 0;
  });
  const [totalDues] = useState(() => {
    if (typeof window === 'undefined') return 1850;
    const saved = localStorage.getItem('vyapaar-customers');
    if (saved) {
      const list = JSON.parse(saved);
      return list.reduce((sum: number, c: any) => sum + (c.pendingDue || 0), 0);
    }
    return 1850;
  });

  const insights = allAgentInsights(lang).slice(0, 6);
  const tomorrow = weatherForecast[1];
  const topBuy = getTopBuyList(5);
  const lowStock = getLowStockItems().slice(0, 3);
  const highDemand = getPredictedHighDemand().slice(0, 3);
  const reasons = getBuyRecommendationReasons();
  const countdowns = getCountdownData().slice(0, 2);
  const notifications = generateNotifications().filter((n) => !n.read).slice(0, 4);

  const healthData = [
    { name: t('inventoryScore'), value: healthScores.inventory, fill: '#1f9e6a' },
    { name: t('financeScore'),   value: healthScores.finance,   fill: '#45b985' },
    { name: t('salesScore'),     value: healthScores.sales,     fill: '#7ad1a8' },
    { name: t('profitScore'),    value: healthScores.profit,    fill: '#aee3c8' },
  ];

  const morningMsg = morningReportMessage({
    todayBuy: topBuy.map((b) => `${b.name} (${b.qty} units)`),
    lowStock: lowStock.map((p) => `${p.name} (${p.stock} left)`),
    highDemand: highDemand.map((p) => p.name),
    todayProfit: businessMetrics.todayProfit,
    estimatedRevenue: 14520,
  });

  const predictMsg = predictiveBuyMessage(
    topBuy.map((b) => ({ name: b.name, qty: b.qty })),
    reasons,
  );

  const weatherEmoji = { rainy: '🌧️', hot: '☀️', sunny: '🌤️', cloudy: '☁️', cold: '❄️', storm: '⛈️' }[tomorrow.condition] ?? '🌦️';

  return (
    <div className="space-y-6">
      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f09624] via-[#ac450b] to-[#461201] p-8 text-white shadow-xl animate-slideUp">
        {/* Flower SVG Background */}
        <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
          <Flower2 className="h-28 w-28 text-white" strokeWidth={1} />
        </div>

        {/* Top Section */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">TODAY · आज</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-medium text-white/95">₹</span>
              <span className="text-6xl font-black tracking-tight">{salesToday.toLocaleString('en-IN')}</span>
              <span className="text-sm font-medium text-white/80 ml-2">sales today</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="sm:self-center self-start flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white border border-white/20 shadow-sm transition-all hover:bg-white/20 active:scale-95 z-10"
          >
            <Sparkles className="h-4 w-4 text-white" />
            AI Recommendations
          </button>
        </div>

        {/* Bottom Translucent Cards Row */}
        <div className="mt-8 grid grid-cols-2 gap-3.5 lg:grid-cols-4 relative">
          {/* Card 1: MONTHLY REV */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 flex items-center gap-3">
            <div className="rounded-full bg-white/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">MONTHLY REV</p>
              <p className="text-lg font-black mt-0.5">₹{businessMetrics.monthlyRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Card 2: UDHAAR */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 flex items-center gap-3">
            <div className="rounded-full bg-white/10 p-2.5">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">UDHAAR</p>
              <p className="text-lg font-black mt-0.5">₹{totalDues.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Card 3: PROFIT */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 flex items-center gap-3">
            <div className="rounded-full bg-white/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">PROFIT</p>
              <p className="text-lg font-black mt-0.5">₹{businessMetrics.monthlyProfit.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Card 4: BUSINESS SCORE */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 flex items-center gap-3">
            <div className="rounded-full bg-white/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">BUSINESS SCORE</p>
              <p className="text-lg font-black mt-0.5">{Math.round((healthScores.overall ?? 0.82) * 100)}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Morning Report + AI Buy Plan */}
      <div className="grid gap-4 lg:grid-cols-2 animate-slideUp">
        {/* Morning Report Card */}
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <span className="text-lg">🌅</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">Today's AI Report</h3>
              <p className="text-xs text-ink-500">Auto-generated for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider mb-1.5">Buy Today</p>
              {topBuy.slice(0, 3).map((b) => (
                <p key={b.name} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-ink-700">• {b.name}</span>
                  <span className="font-bold text-brand-600">{b.qty} units</span>
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-red-50 p-2.5 flex flex-col justify-between">
                <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Low Stock</p>
                {lowStock.length > 0 ? (
                  lowStock.slice(0, 2).map((p) => (
                    <p key={p.name} className="text-[11px] text-ink-700 truncate">⚠️ {p.name}</p>
                  ))
                ) : (
                  <p className="text-[10px] text-green-600 font-semibold italic mt-1">✓ All items in stock</p>
                )}
              </div>
              <div className="rounded-xl bg-brand-50 p-2.5">
                <p className="text-[10px] font-bold text-brand-600 uppercase mb-1">High Demand</p>
                {highDemand.slice(0, 2).map((p) => (
                  <p key={p.name} className="text-[11px] text-ink-700 truncate">🔥 {p.name}</p>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => { sendWhatsApp(STORE_PHONE, morningMsg); setReportSent(true); }}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${reportSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
          >
            <Send className="h-3.5 w-3.5" /> {reportSent ? 'Report Sent to WhatsApp ✓' : 'Send Morning Report'}
          </button>
        </div>

        {/* AI Buy Recommendations */}
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
              <ShoppingCart className="h-4 w-4 text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-900">AI Buying Suggestions</h3>
              <p className="text-xs text-ink-500">Based on weather · festivals · trends</p>
            </div>
            <Badge variant="brand" ><Sparkles className="h-3 w-3" /> Live</Badge>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {reasons.slice(0, 2).map((r, i) => (
              <span key={i} className="rounded-full bg-brand-50 border border-brand-100 px-2.5 py-1 text-[10px] font-semibold text-brand-700">{r}</span>
            ))}
          </div>
          <div className="space-y-2">
            {topBuy.map((b, i) => (
              <div key={b.name} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-ink-400">#{i + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-ink-900">{b.name}</p>
                    <p className="text-[10px] text-ink-400 truncate max-w-[140px]">{b.reason}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-brand-600 shrink-0">{b.qty} units</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { sendWhatsApp(STORE_PHONE, predictMsg); setBuySent(true); }}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${buySent ? 'bg-brand-50 text-brand-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
          >
            <Send className="h-3.5 w-3.5" /> {buySent ? 'Buy Plan Sent ✓' : 'Send Buy Plan'}
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('weeklySales')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklySalesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1f9e6a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#1f9e6a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="day"  tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis               tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
              <Area type="monotone" dataKey="sales" stroke="#1f9e6a" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('categoryBreakdown')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-2">
            {categoryData.map((c) => (
              <span key={c.name} className="flex items-center gap-1 text-xs text-ink-500">
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} /> {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Festival Countdown + Alerts */}
      <div className="grid gap-4 lg:grid-cols-2 animate-slideUp">
        {/* Festival Countdown */}
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Timer className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-ink-900">Festival Countdown</h3>
          </div>
          <div className="space-y-3">
            {countdowns.map((cd) => (
              <div key={cd.festival.id} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${cd.urgency === 'this-week' ? 'border-amber-200 bg-amber-50' : 'border-ink-100 bg-ink-50'}`}>
                <div>
                  <p className="text-sm font-bold text-ink-900">🎉 {cd.festival.name}</p>
                  <p className="text-xs text-ink-400">{cd.festival.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-brand-600">{cd.daysLeft}</p>
                  <p className="text-xs text-ink-400">days left</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('festivals')} className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            View Festival Campaigns <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Smart Notifications preview */}
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-bold text-ink-900">AI Alerts</h3>
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">{notifications.length} new</span>
            </div>
            <button onClick={() => onNavigate('notifications')} className="text-xs font-semibold text-brand-600">View all</button>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className={`flex items-start gap-2 rounded-xl border p-2.5 ${n.priority === 'urgent' ? 'border-red-200 bg-red-50/40' : n.priority === 'high' ? 'border-amber-200 bg-amber-50/30' : 'border-ink-100'}`}>
                <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${n.priority === 'urgent' ? 'text-red-500' : 'text-amber-500'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-900 truncate">{n.title}</p>
                  <p className="text-[10px] text-ink-500 truncate">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Health + Hourly Sales */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('businessHealth')}</h3>
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: healthScores.overall, fill: '#1f9e6a' }]} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-ink-900">{healthScores.overall}</span>
                <span className="text-[10px] text-ink-400">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {healthData.map((h) => (
                <div key={h.name}>
                  <div className="flex justify-between text-xs">
                    <span className="text-ink-500">{h.name}</span>
                    <span className="font-semibold text-ink-700">{h.value}</span>
                  </div>
                  <ProgressBar value={h.value} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card p-5 lg:col-span-2 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('hourlySales')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis                tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} cursor={{ fill: '#f6f7f9' }} />
              <Bar dataKey="sales" fill="#1f9e6a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Feed */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
              <Brain className="h-4 w-4 text-brand-600" />
            </div>
            <h3 className="text-sm font-bold text-ink-900">{t('aiRecommendation')}</h3>
          </div>
          <Badge variant="brand"><Sparkles className="h-3 w-3" /> {t('workingAutomatically')}</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5 transition-all hover:border-brand-200 hover:bg-brand-50/30">
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${ins.priority === 'high' ? 'bg-rose-500' : ins.priority === 'medium' ? 'bg-amber-500' : 'bg-brand-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-ink-400">{getAgentName(ins.agent, lang)}</p>
                    {ins.value && <Badge variant="neutral">{ins.value}</Badge>}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{ins.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{ins.message}</p>
                  {ins.action && (
                    <button onClick={() => onNavigate('whatsapp')} className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                      {ins.action} <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 animate-slideUp">
          <div className="mb-4 flex items-center gap-2">
            <Cloud className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-ink-900">{t('weatherTomorrow')}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{weatherEmoji}</div>
            <div>
              <p className="text-2xl font-bold text-ink-900">{tomorrow.temp}°C</p>
              <p className="text-xs text-ink-400 capitalize">{tomorrow.condition} · {tomorrow.humidity}% {t('humidity')}</p>
              <p className="mt-1 text-xs text-brand-600 font-medium">{reasons[0]}</p>
            </div>
          </div>
          <button onClick={() => onNavigate('weather')} className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600">
            {t('viewAll')} <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('quickActions')}</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: t('inventory'),   icon: ShoppingBag,  view: 'inventory'   as ViewKey },
              { label: t('predictive'),  icon: TrendingUp,   view: 'predictive'  as ViewKey },
              { label: 'WhatsApp',       icon: Send,         view: 'whatsapp'    as ViewKey },
              { label: t('customers'),   icon: Users,        view: 'customers'   as ViewKey },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button key={a.view} onClick={() => onNavigate(a.view)} className="flex items-center gap-2 rounded-xl border border-ink-100 p-3 text-sm font-medium text-ink-700 transition-all hover:border-brand-200 hover:bg-brand-50/30">
                  <Icon className="h-4 w-4 text-brand-600" /> {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

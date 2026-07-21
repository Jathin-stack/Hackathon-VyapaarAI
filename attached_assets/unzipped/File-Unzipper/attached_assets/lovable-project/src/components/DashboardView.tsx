import { TrendingUp, IndianRupee, ShoppingBag, AlertTriangle, Users, Sparkles, Cloud, Brain, ArrowRight } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge, ProgressBar } from './ui';
import { businessMetrics, healthScores, weeklySalesData, categoryData, hourlySalesData, weatherForecast } from '../data/businessData';
import { allAgentInsights, getAgentName } from '../ai/agents';
import type { ViewKey } from './Sidebar';

export function DashboardView({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  const { t, lang } = useLang();
  const insights = allAgentInsights(lang).slice(0, 6);
  const tomorrow = weatherForecast[1];

  const healthData = [
    { name: t('inventoryScore'), value: healthScores.inventory, fill: '#1f9e6a' },
    { name: t('financeScore'), value: healthScores.finance, fill: '#45b985' },
    { name: t('salesScore'), value: healthScores.sales, fill: '#7ad1a8' },
    { name: t('profitScore'), value: healthScores.profit, fill: '#aee3c8' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-6 text-white shadow-lg animate-slideUp">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-4 top-4 h-24 w-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg hidden sm:block">
          <img src="/image.png" alt="Retailer" className="h-full w-full object-cover" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">{t('businessOS')}</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold">{t('welcomeBack')}!</h2>
          <p className="mt-1 text-sm opacity-90">{t('tagline')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => onNavigate('advisor')} className="btn bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
              <Brain className="h-4 w-4" /> {t('askAdvisor')}
            </button>
            <button onClick={() => onNavigate('weather')} className="btn bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              <Cloud className="h-4 w-4" /> {t('weatherTomorrow')}
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label={t('todayRevenue')} value={`₹${businessMetrics.todayRevenue.toLocaleString()}`} trend="up" color="brand" />
        <StatCard icon={TrendingUp} label={t('todayProfit')} value={`₹${businessMetrics.todayProfit.toLocaleString()}`} trend="up" color="brand" />
        <StatCard icon={ShoppingBag} label={t('todaySales')} value={`${businessMetrics.todaySales}`} sublabel={t('units')} trend="up" color="blue" />
        <StatCard icon={AlertTriangle} label={t('lowStock')} value={`${businessMetrics.lowStockCount}`} sublabel={`${businessMetrics.deadStockCount} ${t('deadStock')}`} trend="down" color="amber" />
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
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
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

      {/* Business Health + Hourly Sales */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('businessHealth')}</h3>
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-28">
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
              <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
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
                    <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                      {ins.action} <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Quick + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 animate-slideUp">
          <div className="mb-4 flex items-center gap-2">
            <Cloud className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-ink-900">{t('weatherTomorrow')}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{tomorrow.condition === 'rainy' ? '🌧️' : tomorrow.condition === 'hot' ? '☀️' : tomorrow.condition === 'sunny' ? '🌤️' : '☁️'}</div>
            <div>
              <p className="text-2xl font-bold text-ink-900">{tomorrow.temp}°C</p>
              <p className="text-xs text-ink-400">{t(`weather${tomorrow.condition.charAt(0).toUpperCase() + tomorrow.condition.slice(1)}` as any)} • {tomorrow.humidity}% {t('humidity')}</p>
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
              { label: t('inventory'), icon: ShoppingBag, view: 'inventory' as ViewKey },
              { label: t('finance'), icon: IndianRupee, view: 'finance' as ViewKey },
              { label: t('marketing'), icon: Sparkles, view: 'marketing' as ViewKey },
              { label: t('customers'), icon: Users, view: 'customers' as ViewKey },
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

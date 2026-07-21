import { IndianRupee, TrendingUp, TrendingDown, Wallet, ArrowRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { businessMetrics, monthlyRevenueData, paymentMethodData } from '../data/businessData';
import { financeAgentInsights } from '../ai/agents';

export function FinanceView() {
  const { t, lang } = useLang();
  const insights = financeAgentInsights(lang);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label={t('revenue')} value={`₹${businessMetrics.monthlyRevenue.toLocaleString()}`} trend="up" color="brand" />
        <StatCard icon={TrendingUp} label={t('profit')} value={`₹${businessMetrics.monthlyProfit.toLocaleString()}`} trend="up" color="brand" />
        <StatCard icon={Wallet} label={t('avgOrderValue')} value={`₹${businessMetrics.avgOrderValue}`} trend="up" color="blue" />
        <StatCard icon={TrendingDown} label={t('growthRate')} value={`+${businessMetrics.growthRate}%`} trend="up" color="brand" />
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('monthlySales')}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyRevenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f9e6a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1f9e6a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#1f9e6a" strokeWidth={2} fill="url(#revGrad)" name={t('revenue')} />
            <Area type="monotone" dataKey="expense" stroke="#f59e0b" strokeWidth={2} fill="url(#expGrad)" name={t('expenses')} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('profitAnalysis')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
              <Line type="monotone" dataKey="profit" stroke="#1f9e6a" strokeWidth={2.5} dot={{ r: 4, fill: '#1f9e6a' }} name={t('profit')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('paymentMethods')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={paymentMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {paymentMethodData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('financialForecast')}</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
              <Badge variant={ins.priority === 'high' ? 'danger' : ins.priority === 'medium' ? 'warning' : 'neutral'}>{ins.title}</Badge>
              <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
              {ins.value && <p className="mt-2 text-lg font-bold text-brand-600">{ins.value}</p>}
              {ins.action && <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600">{ins.action} <ArrowRight className="h-3 w-3" /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

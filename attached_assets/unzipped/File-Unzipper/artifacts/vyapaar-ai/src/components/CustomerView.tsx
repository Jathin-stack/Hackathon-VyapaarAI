import { Crown, Star, UserMinus, UserCheck, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { customers } from '../data/businessData';
import { customerAgentInsights } from '../ai/agents';

export function CustomerView() {
  const { t, lang } = useLang();
  const insights = customerAgentInsights(lang);

  const segmentCounts = {
    premium: customers.filter((c) => c.segment === 'premium').length,
    frequent: customers.filter((c) => c.segment === 'frequent').length,
    returning: customers.filter((c) => c.segment === 'returning').length,
    inactive: customers.filter((c) => c.segment === 'inactive').length,
  };

  const segData = [
    { name: t('premium'), value: segmentCounts.premium, color: '#1f9e6a' },
    { name: t('frequent'), value: segmentCounts.frequent, color: '#45b985' },
    { name: t('returning'), value: segmentCounts.returning, color: '#7ad1a8' },
    { name: t('inactive'), value: segmentCounts.inactive, color: '#f59e0b' },
  ];

  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  const topChart = topCustomers.map((c) => ({ name: c.name.split(' ')[0], spent: c.totalSpent / 1000 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Crown} label={t('premium')} value={`${segmentCounts.premium}`} color="brand" />
        <StatCard icon={Star} label={t('frequent')} value={`${segmentCounts.frequent}`} color="blue" />
        <StatCard icon={UserCheck} label={t('returning')} value={`${segmentCounts.returning}`} color="brand" />
        <StatCard icon={UserMinus} label={t('inactive')} value={`${segmentCounts.inactive}`} color="amber" trend="down" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('customerSegmentation')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={segData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {segData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('topCustomers')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topChart} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} cursor={{ fill: '#f6f7f9' }} />
              <Bar dataKey="spent" fill="#1f9e6a" radius={[0, 4, 4, 0]} name="₹000s" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('customerProfile')}</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs text-ink-400">
                <th className="pb-2 pr-4 font-semibold">Name</th>
                <th className="pb-2 pr-4 font-semibold">{t('segments')}</th>
                <th className="pb-2 pr-4 font-semibold">{t('totalSpent')}</th>
                <th className="pb-2 pr-4 font-semibold">{t('visitFrequency')}</th>
                <th className="pb-2 pr-4 font-semibold">{t('lastVisit')}</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 8).map((c) => (
                <tr key={c.id} className="border-b border-ink-50">
                  <td className="py-2.5 pr-4 font-medium text-ink-900">{c.name}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={c.segment === 'premium' ? 'brand' : c.segment === 'inactive' ? 'warning' : 'success'}>{t(c.segment as any)}</Badge>
                  </td>
                  <td className="py-2.5 pr-4 font-semibold text-ink-700">₹{c.totalSpent.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 text-ink-500">{c.visits}</td>
                  <td className="py-2.5 pr-4 text-ink-500">{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('aiRecommendation')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
              <Badge variant={ins.priority === 'high' ? 'danger' : 'warning'}>{ins.title}</Badge>
              <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
              {ins.action && <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600">{ins.action} <ArrowRight className="h-3 w-3" /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

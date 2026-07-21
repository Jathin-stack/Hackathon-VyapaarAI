import { Crown, Star, UserMinus, UserCheck, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { customers } from '../data/businessData';
import { customerAgentInsights } from '../ai/agents';
import { buildSegmentedOffers, sendSegmentMessage, getSegmentStats } from '../services/customerSegmentation';

export function CustomerView() {
  const { t, lang } = useLang();
  const insights = customerAgentInsights(lang);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const stats = getSegmentStats();
  const segmentedOffers = buildSegmentedOffers();

  const segData = [
    { name: t('premium'),   value: stats.premium,   color: '#1f9e6a' },
    { name: t('frequent'),  value: stats.frequent,  color: '#45b985' },
    { name: t('returning'), value: stats.returning, color: '#7ad1a8' },
    { name: t('inactive'),  value: stats.inactive,  color: '#f59e0b' },
  ];

  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  const topChart = topCustomers.map((c) => ({ name: c.name.split(' ')[0], spent: c.totalSpent / 1000 }));

  const markSent = (id: string) => setSent((prev) => new Set([...prev, id]));

  const segColor: Record<string, string> = {
    premium: 'bg-brand-50 text-brand-700',
    frequent: 'bg-blue-50 text-blue-700',
    returning: 'bg-amber-50 text-amber-700',
    inactive: 'bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Crown}     label={t('premium')}  value={`${stats.premium}`}  color="brand" />
        <StatCard icon={Star}      label={t('frequent')} value={`${stats.frequent}`} color="blue" />
        <StatCard icon={UserCheck} label={t('returning')}value={`${stats.returning}`}color="brand" />
        <StatCard icon={UserMinus} label={t('inactive')} value={`${stats.inactive}`} color="amber" trend="down" />
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

      {/* Customer table with WhatsApp buttons */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-3 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">Customer Marketing — AI Personalized Messages</h3>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs text-ink-400">
                <th className="pb-2 pr-4 font-semibold">Name</th>
                <th className="pb-2 pr-4 font-semibold">{t('segments')}</th>
                <th className="pb-2 pr-4 font-semibold">AI Offer</th>
                <th className="pb-2 pr-4 font-semibold">{t('totalSpent')}</th>
                <th className="pb-2 pr-4 font-semibold">{t('lastVisit')}</th>
                <th className="pb-2 font-semibold">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {segmentedOffers.slice(0, 10).map((offer) => {
                const c = offer.customer;
                const isSent = sent.has(c.id);
                return (
                  <tr key={c.id} className="border-b border-ink-50">
                    <td className="py-2.5 pr-4 font-medium text-ink-900">{c.name}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={c.segment === 'premium' ? 'brand' : c.segment === 'inactive' ? 'warning' : 'success'}>{t(c.segment as any)}</Badge>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${segColor[c.segment] ?? 'bg-ink-50 text-ink-600'}`}>
                        {offer.offerType}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-ink-700">₹{c.totalSpent.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-ink-500">{c.lastVisit}</td>
                    <td className="py-2.5">
                      <button
                        onClick={() => { sendSegmentMessage(c); markSent(c.id); }}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${isSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
                      >
                        {isSent ? '✓ Sent' : <><Send className="h-3 w-3" /> Send</>}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('aiRecommendation')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
              <Badge variant={ins.priority === 'high' ? 'danger' : 'warning'}>{ins.title}</Badge>
              <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
              {ins.action && (
                <button
                  onClick={() => {
                    const target = ins.id.includes('cust') ? customers.find((c) => c.segment === 'inactive') : customers[0];
                    if (target) sendSegmentMessage(target);
                  }}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600"
                >
                  {ins.action} <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

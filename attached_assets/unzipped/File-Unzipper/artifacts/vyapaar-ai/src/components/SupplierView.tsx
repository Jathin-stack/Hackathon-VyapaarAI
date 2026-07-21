import { Truck, Star, Clock, IndianRupee, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { suppliers } from '../data/businessData';
import { supplierAgentInsights } from '../ai/agents';

export function SupplierView() {
  const { t, lang } = useLang();
  const insights = supplierAgentInsights(lang);
  const chartData = suppliers.map((s) => ({ name: s.name.split(' ')[0], price: s.priceIndex, rating: s.rating * 20 }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Truck} label={t('suppliers')} value={`${suppliers.length}`} color="brand" />
        <StatCard icon={Star} label={t('bestSuppliers')} value={`${suppliers.filter((s) => s.rating >= 4.5).length}`} color="amber" />
        <StatCard icon={Clock} label={t('deliveryTime')} value="1-3 days" color="blue" />
        <StatCard icon={IndianRupee} label={t('cheapest')} value={suppliers[3].name.split(' ')[0]} color="brand" />
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('priceComparisons')}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} cursor={{ fill: '#f6f7f9' }} />
            <Bar dataKey="price" radius={[4, 4, 0, 0]} name={t('costOptimization')}>
              {chartData.map((d, i) => <Cell key={i} fill={d.price <= 90 ? '#1f9e6a' : d.price <= 95 ? '#45b985' : '#aee3c8'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('supplierRecommendations')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {suppliers.map((s) => (
            <div key={s.id} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-200">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink-900">{s.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-ink-700">{s.rating}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {s.categories.map((c) => <Badge key={c} variant="neutral">{c}</Badge>)}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-ink-500">
                <span>{t('deliveryTime')}: {s.deliveryDays}d</span>
                <span>{t('minOrder')}: ₹{s.minOrder}</span>
                <span>{t('costOptimization')}: {s.priceIndex}</span>
              </div>
              <button className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600">{t('contactSupplier')} <ArrowRight className="h-3 w-3" /></button>
            </div>
          ))}
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

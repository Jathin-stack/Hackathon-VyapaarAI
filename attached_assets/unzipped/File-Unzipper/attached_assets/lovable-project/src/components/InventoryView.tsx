import { Package, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge, ProgressBar } from './ui';
import { products } from '../data/businessData';
import { inventoryAgentInsights } from '../ai/agents';

export function InventoryView() {
  const { t, lang } = useLang();
  const insights = inventoryAgentInsights(lang);
  const lowStock = products.filter((p) => p.stock <= p.reorderLevel);
  const trending = products.filter((p) => p.trend === 'up');
  const deadStock = products.filter((p) => p.soldWeek < 30);

  const chartData = products.slice(0, 8).map((p) => ({ name: p.name, stock: p.stock, sold: p.soldToday }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label={t('topProducts')} value={`${products.length}`} color="brand" />
        <StatCard icon={AlertTriangle} label={t('lowStockAlerts')} value={`${lowStock.length}`} color="amber" trend="down" />
        <StatCard icon={TrendingUp} label={t('trending')} value={`${trending.length}`} color="brand" trend="up" />
        <StatCard icon={TrendingDown} label={t('deadStock')} value={`${deadStock.length}`} color="rose" trend="down" />
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('stockMovement')}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} cursor={{ fill: '#f6f7f9' }} />
            <Bar dataKey="stock" fill="#aee3c8" radius={[4, 4, 0, 0]} name={t('inStock')} />
            <Bar dataKey="sold" fill="#1f9e6a" radius={[4, 4, 0, 0]} name={t('today')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-3 text-sm font-bold text-ink-900">{t('reorderSuggestions')}</h3>
          <div className="space-y-2.5">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.stock}/{p.reorderLevel} {t('units')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20"><ProgressBar value={p.stock} max={p.reorderLevel * 2} color={p.stock === 0 ? 'rose' : 'amber'} /></div>
                  <Badge variant={p.stock === 0 ? 'danger' : 'warning'}>{p.stock === 0 ? t('outOfStock') : t('restockUrgent')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-3 text-sm font-bold text-ink-900">{t('productTrends')}</h3>
          <div className="space-y-2.5">
            {trending.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.soldToday} {t('today')} • {p.soldWeek}/week</p>
                </div>
                <Badge variant="success"><TrendingUp className="h-3 w-3" /> {t('trending')}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('aiRecommendation')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
              <div className="flex items-center justify-between">
                <Badge variant={ins.priority === 'high' ? 'danger' : ins.priority === 'medium' ? 'warning' : 'neutral'}>{ins.title}</Badge>
                {ins.value && <span className="text-xs font-semibold text-ink-500">{ins.value}</span>}
              </div>
              <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
              {ins.action && <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600">{ins.action} <ArrowRight className="h-3 w-3" /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Truck, Star, Clock, IndianRupee, ArrowRight, Send, MessageCircle, Trophy } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { suppliers } from '../data/businessData';
import { supplierAgentInsights } from '../ai/agents';
import { sendWhatsApp } from '../services/whatsappService';
import { generateSupplierOrders, rankSuppliers } from '../services/supplierRecommendation';
import { getLowStockItems } from '../services/inventoryPrediction';

export function SupplierView() {
  const { t, lang } = useLang();
  const insights = supplierAgentInsights(lang);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const supplierOrders = generateSupplierOrders();
  const rankedSuppliers = rankSuppliers();
  const lowStock = getLowStockItems();

  const chartData = suppliers.map((s) => ({
    name: s.name.split(' ')[0],
    price: s.priceIndex,
    rating: s.rating * 20,
  }));

  const markSent = (id: string) => setSent((prev) => new Set([...prev, id]));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Truck}       label={t('suppliers')}     value={`${suppliers.length}`}                       color="brand" />
        <StatCard icon={Star}        label={t('bestSuppliers')} value={`${suppliers.filter((s) => s.rating >= 4.5).length}`} color="amber" />
        <StatCard icon={Clock}       label={t('deliveryTime')}  value="1-3 days"                                    color="blue" />
        <StatCard icon={IndianRupee} label="Pending Orders"     value={`${supplierOrders.length}`}                  color={supplierOrders.length > 0 ? 'amber' : 'brand'} />
      </div>

      {/* AI Ranked suppliers */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold text-ink-900">AI Supplier Rankings</h3>
          <Badge variant="brand">Auto-scored by price · rating · delivery</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {rankedSuppliers.map((ranked, index) => {
            const s = ranked.supplier;
            const id = `supplier-${s.id}`;
            const isSent = sent.has(id);
            return (
              <div key={id} className={`rounded-xl border p-4 transition-all hover:shadow-sm ${index === 0 ? 'border-amber-200 bg-amber-50/30' : 'border-ink-100 hover:border-brand-200'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {index === 0 && <span className="text-lg">🏆</span>}
                    {index === 1 && <span className="text-lg">🥈</span>}
                    {index === 2 && <span className="text-lg">🥉</span>}
                    {index > 2 && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">#{index + 1}</span>}
                    <div>
                      <p className="text-sm font-bold text-ink-900">{s.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-xs font-bold text-ink-700">{s.rating}</span>
                        <span className="text-xs text-ink-400">· {s.deliveryDays}d delivery · ₹{s.minOrder} min</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={index === 0 ? 'warning' : 'neutral'}>{Math.round(ranked.score)}pts</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ranked.reasons.map((r) => (
                    <span key={r} className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">{r}</span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.categories.map((c) => <Badge key={c} variant="neutral">{c}</Badge>)}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { sendWhatsApp(s.contact, `Hello ${s.name},\n\nI would like to discuss placing an order.\n\nPlease share your latest price list and availability.\n\nRegards,\nVyapaar AI Store`); markSent(id); }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${isSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
                  >
                    {isSent ? '✓ Contacted' : <><MessageCircle className="h-3 w-3" /> Contact on WhatsApp</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgent Orders */}
      {supplierOrders.length > 0 && (
        <div className="card p-5 animate-slideUp border-l-4 border-l-red-500">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-bold text-ink-900">Urgent Orders — Low Stock</h3>
            <Badge variant="danger">{supplierOrders.length} orders pending</Badge>
          </div>
          <div className="space-y-3">
            {supplierOrders.map((order) => {
              const id = `order-${order.supplier.id}`;
              const isSent = sent.has(id);
              return (
                <div key={id} className="rounded-xl border border-red-100 bg-red-50/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-ink-900">{order.supplier.name}</p>
                      <p className="text-xs text-ink-500">{order.items.length} items · Est. ₹{order.estimatedCost.toLocaleString()} · Deliver by {order.deliveryDate}</p>
                    </div>
                    <Badge variant="danger">Urgent</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {order.items.map((item) => (
                      <span key={item.name} className="rounded bg-white border border-ink-200 px-2 py-0.5 text-xs font-medium text-ink-700">
                        {item.name}: {item.recommendedQty} units
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { sendWhatsApp(order.supplier.contact, order.message); markSent(id); }}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${isSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
                    >
                      <Send className="h-3 w-3" /> {isSent ? 'Order Sent ✓' : `Send WhatsApp Order to ${order.supplier.name}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price comparison chart */}
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

      {/* AI insights */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('aiRecommendation')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => {
            const bestSupplier = suppliers.find((s) => ins.title.includes(s.name.split(' ')[0])) || suppliers[0];
            return (
              <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
                <Badge variant={ins.priority === 'high' ? 'danger' : 'warning'}>{ins.title}</Badge>
                <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
                {ins.action && (
                  <button
                    onClick={() => sendWhatsApp(bestSupplier.contact, `Hello ${bestSupplier.name},\n\nWe would like to place an order.\n\nRegards,\nVyapaar AI Store`)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600"
                  >
                    {ins.action} <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

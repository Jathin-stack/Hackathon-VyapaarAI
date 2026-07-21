import { MessageCircle, Send, Users, Gift, Bell, Sparkles, Copy, Phone, Zap, TrendingUp, ShoppingCart, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { customers, suppliers } from '../data/businessData';
import { sendWhatsApp, morningReportMessage, predictiveBuyMessage, festivalOfferMessage, lowStockSupplierMessage } from '../services/whatsappService';
import { getTopBuyList, getLowStockItems, getPredictedHighDemand, getBuyRecommendationReasons } from '../services/inventoryPrediction';
import { generateFestivalCampaigns } from '../services/festivalEngine';
import { buildSegmentedOffers, sendSegmentMessage } from '../services/customerSegmentation';
import { generateSupplierOrders } from '../services/supplierRecommendation';

const STORE_PHONE = '+91 98765 00000'; // owner's number

export function WhatsappView() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const segmentedOffers = buildSegmentedOffers();
  const supplierOrders = generateSupplierOrders();
  const festivalCampaigns = generateFestivalCampaigns().slice(0, 3);
  const buyList = getTopBuyList(5);
  const highDemand = getPredictedHighDemand().slice(0, 3);
  const reasons = getBuyRecommendationReasons();
  const lowStock = getLowStockItems().slice(0, 3);

  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const markSent = (id: string) => setSent((prev) => new Set([...prev, id]));

  // Morning report message
  const morningMsg = morningReportMessage({
    todayBuy: buyList.map((b) => `${b.name} (${b.qty} units)`),
    lowStock: lowStock.map((p) => `${p.name} (${p.stock} left)`),
    highDemand: highDemand.map((p) => p.name),
    todayProfit: 12450,
    estimatedRevenue: 14520,
  });

  // Predictive buy message
  const predictiveMsg = predictiveBuyMessage(
    buyList.map((b) => ({ name: b.name, qty: b.qty })),
    reasons,
  );

  const quickTemplates = [
    {
      id: 'morning-report',
      label: 'Daily Owner Report',
      variant: 'brand' as const,
      icon: TrendingUp,
      message: morningMsg,
      phone: STORE_PHONE,
      description: 'Send today\'s AI report to yourself',
    },
    {
      id: 'predictive-buy',
      label: 'AI Buy Recommendations',
      variant: 'success' as const,
      icon: ShoppingCart,
      message: predictiveMsg,
      phone: STORE_PHONE,
      description: 'What to buy today based on AI analysis',
    },
    {
      id: 'festival-offer',
      label: 'Festival Campaign',
      variant: 'warning' as const,
      icon: Gift,
      message: festivalOfferMessage(festivalCampaigns[0]?.festival.name ?? 'Festival', festivalCampaigns[0]?.offers ?? []),
      phone: STORE_PHONE,
      description: `Send ${festivalCampaigns[0]?.festival.name ?? 'festival'} offers to customers`,
    },
    {
      id: 'supplier-order',
      label: 'Low Stock Alert to Supplier',
      variant: 'danger' as const,
      icon: Building2,
      message: supplierOrders[0]?.message ?? 'No urgent orders needed',
      phone: supplierOrders[0]?.supplier.contact ?? STORE_PHONE,
      description: 'Auto-generated order for low-stock items',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MessageCircle} label="Messages Ready" value={`${quickTemplates.length + segmentedOffers.length}`} color="brand" />
        <StatCard icon={Users} label={t('customers')} value={`${customers.length}`} color="blue" />
        <StatCard icon={Gift} label="Festival Campaigns" value={`${festivalCampaigns.length}`} color="amber" />
        <StatCard icon={Building2} label="Supplier Orders" value={`${supplierOrders.length}`} color="brand" />
      </div>

      {/* Quick Templates — owner self-reports & broadcast */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">AI WhatsApp Automation</h3>
          <Badge variant="brand"><Sparkles className="h-3 w-3" /> Auto-Generated</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {quickTemplates.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSent = sent.has(tmpl.id);
            return (
              <div key={tmpl.id} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-200 hover:shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                      <Icon className="h-4 w-4 text-brand-600" />
                    </div>
                    <div>
                      <Badge variant={tmpl.variant}>{tmpl.label}</Badge>
                      <p className="mt-0.5 text-xs text-ink-500">{tmpl.description}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-xs text-ink-600 font-mono bg-ink-50 rounded-lg p-2">
                  {tmpl.message.slice(0, 150)}…
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { sendWhatsApp(tmpl.phone, tmpl.message); markSent(tmpl.id); }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#128C7E]"
                  >
                    <Send className="h-3 w-3" />
                    {isSent ? 'Sent! ✓' : 'Send via WhatsApp'}
                  </button>
                  <button
                    onClick={() => copy(tmpl.id, tmpl.message)}
                    className="flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50"
                  >
                    {copied === tmpl.id ? <><Sparkles className="h-3 w-3 text-brand-600" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Festival Campaigns */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-bold text-ink-900">Festival Campaign Messages</h3>
        </div>
        <div className="space-y-3">
          {festivalCampaigns.map((campaign) => {
            const msg = festivalOfferMessage(campaign.festival.name, campaign.offers);
            const id = `festival-${campaign.festival.id}`;
            const isSent = sent.has(id);
            return (
              <div key={id} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-amber-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{campaign.festival.name}</p>
                    <p className="text-xs text-ink-400">{campaign.festival.date} · {campaign.festival.daysUntil} days away</p>
                  </div>
                  <Badge variant={campaign.urgency === 'now' ? 'danger' : campaign.urgency === 'soon' ? 'warning' : 'neutral'}>
                    {campaign.urgency === 'now' ? '🔥 Send Now' : campaign.urgency === 'soon' ? '⏰ Soon' : '📅 Upcoming'}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {campaign.offers.slice(0, 3).map((o) => (
                    <span key={o} className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">{o}</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      // Broadcast to all customers — opens first customer's chat (click-to-chat limitation)
                      const firstCustomer = customers[0];
                      sendWhatsApp(firstCustomer.phone, msg);
                      markSent(id);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#128C7E]"
                  >
                    <Send className="h-3 w-3" /> {isSent ? `Sent to ${campaign.targetCustomers} customers ✓` : `Send to All Customers`}
                  </button>
                  <button onClick={() => copy(id, msg)} className="flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50">
                    {copied === id ? <><Sparkles className="h-3 w-3 text-brand-600" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplier Orders */}
      {supplierOrders.length > 0 && (
        <div className="card p-5 animate-slideUp">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-ink-900">Auto Low-Stock Orders to Suppliers</h3>
            <Badge variant="danger">Urgent</Badge>
          </div>
          <div className="space-y-3">
            {supplierOrders.map((order) => {
              const id = `order-${order.supplier.id}`;
              const isSent = sent.has(id);
              return (
                <div key={id} className="rounded-xl border border-red-100 bg-red-50/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink-900">{order.supplier.name}</p>
                      <p className="text-xs text-ink-500">{order.items.length} items · Est. ₹{order.estimatedCost.toLocaleString()} · Deliver by {order.deliveryDate}</p>
                    </div>
                    <Phone className="h-4 w-4 text-ink-400" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {order.items.map((item) => (
                      <span key={item.name} className="rounded bg-white px-2 py-0.5 text-xs font-medium text-ink-700 border border-ink-200">
                        {item.name}: {item.recommendedQty} units
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { sendWhatsApp(order.supplier.contact, order.message); markSent(id); }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#128C7E]"
                    >
                      <Send className="h-3 w-3" /> {isSent ? 'Order Sent ✓' : `Send Order to ${order.supplier.name}`}
                    </button>
                    <button onClick={() => copy(id, order.message)} className="flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50">
                      {copied === id ? <Sparkles className="h-3 w-3 text-brand-600" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Engagement — per-segment WhatsApp send */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">Customer Marketing Automation</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {segmentedOffers.slice(0, 8).map((offer) => {
            const id = `cust-${offer.customer.id}`;
            const isSent = sent.has(id);
            const segColor: Record<string, string> = {
              premium: 'text-brand-700 bg-brand-50',
              frequent: 'text-blue-700 bg-blue-50',
              returning: 'text-amber-700 bg-amber-50',
              inactive: 'text-red-700 bg-red-50',
            };
            return (
              <div key={id} className="flex items-center justify-between gap-2 rounded-xl border border-ink-100 p-3 transition-all hover:border-brand-200">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{offer.customer.name}</p>
                  <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold ${segColor[offer.customer.segment] ?? 'text-ink-600 bg-ink-50'}`}>
                    {offer.offerType}
                  </span>
                </div>
                <button
                  onClick={() => { sendSegmentMessage(offer.customer); markSent(id); }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${isSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
                >
                  {isSent ? <>✓ Sent</> : <><MessageCircle className="h-3 w-3" /> Send</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI WhatsApp Commands reference */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">AI WhatsApp Commands</h3>
          <Badge variant="neutral">Send to yourself</Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { cmd: 'Show today\'s stock', msg: `Today's Stock Report — Vyapaar AI\n${getLowStockItems().map((p) => `⚠️ ${p.name}: ${p.stock} units (need ${p.reorderLevel * 2})`).join('\n')}`, label: 'Stock Report' },
            { cmd: 'What should I buy tomorrow?', msg: predictiveMsg, label: 'Buy Plan' },
            { cmd: 'Show profit report', msg: `Profit Report — Vyapaar AI\n\nToday: ₹3,120\nThis week: ₹14,400\nThis month: ₹46,000\nGrowth: +14.8%`, label: 'Profit' },
            { cmd: 'Show supplier message', msg: supplierOrders[0]?.message ?? 'No urgent orders', label: 'Supplier Order' },
          ].map((item, i) => {
            const id = `cmd-${i}`;
            const isSent = sent.has(id);
            return (
              <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 p-3">
                <div>
                  <p className="text-xs font-bold text-ink-900">"{item.cmd}"</p>
                  <Badge variant="neutral">{item.label}</Badge>
                </div>
                <button
                  onClick={() => { sendWhatsApp(STORE_PHONE, item.msg); markSent(id); }}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${isSent ? 'bg-brand-50 text-brand-700' : 'bg-[#25D366] text-white hover:bg-[#128C7E]'}`}
                >
                  {isSent ? '✓' : <><Send className="h-3 w-3" /> Send</>}
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-400 text-center">
          Messages open WhatsApp with pre-filled text. API integration (Twilio / Meta) can enable full automation.
        </p>
      </div>
    </div>
  );
}

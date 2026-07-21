/**
 * WhatsApp Service
 *
 * Current: Click-to-Chat via wa.me
 * Future-ready: swap `sendMessage` to use WhatsApp Business API / Twilio / Meta Cloud API
 * without changing any call sites.
 */

export type WaProvider = 'click-to-chat' | 'twilio' | 'meta' | 'whatsapp-business';

const ACTIVE_PROVIDER: WaProvider = 'click-to-chat';

/** Strip everything except digits; prepend 91 if needed */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/** URL-encode a message (handles all Unicode / Indian scripts) */
export function encodeWaMessage(text: string): string {
  return encodeURIComponent(text);
}

/** Build a wa.me click-to-chat URL */
export function buildWaUrl(phone: string, message: string): string {
  const cleaned = normalizePhone(phone);
  return `https://wa.me/${cleaned}?text=${encodeWaMessage(message)}`;
}

/** Open WhatsApp (click-to-chat). Replace this block to switch provider. */
export function sendWhatsApp(phone: string, message: string): void {
  if (ACTIVE_PROVIDER === 'click-to-chat') {
    const url = buildWaUrl(phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  // Future: POST to /api/whatsapp/send for Twilio / Meta
  console.warn('WhatsApp provider not configured:', ACTIVE_PROVIDER);
}

/** Broadcast the same message to multiple contacts */
export function broadcastWhatsApp(contacts: { phone: string; name: string }[], messageTemplate: string): void {
  if (contacts.length === 0) return;
  // For click-to-chat we open the first contact; real broadcast requires API
  const first = contacts[0];
  const msg = messageTemplate.replace('{name}', first.name);
  sendWhatsApp(first.phone, msg);
}

/** --- Pre-built message templates --- */

export function lowStockSupplierMessage(
  supplierName: string,
  items: { name: string; currentStock: number; recommendedQty: number }[],
  deliveryDate: string,
  storeName = 'Vyapaar AI Store',
): string {
  const itemLines = items.map((i) => `• ${i.name}: ${i.recommendedQty} units (current: ${i.currentStock})`).join('\n');
  return `Hello ${supplierName},

The following items are running low at ${storeName}:

${itemLines}

Please deliver before: ${deliveryDate}

Regards,
${storeName} (Powered by Vyapaar AI)`;
}

export function festivalOfferMessage(
  festivalName: string,
  offers: string[],
  storeName = 'Vyapaar AI Store',
): string {
  const offerLines = offers.map((o, i) => `${i + 1}. ${o}`).join('\n');
  return `🎉 Happy ${festivalName}! 🎉

Special Festival Offers at ${storeName}:

${offerLines}

Visit our store today — offer valid for limited time!

Regards,
${storeName}`;
}

export function customerReactivationMessage(customerName: string, discountPct: number, storeName = 'Vyapaar AI Store'): string {
  return `Dear ${customerName},

We miss you! 😊

Enjoy ${discountPct}% OFF on your next purchase at ${storeName}.

Offer valid for the next 48 hours only!

Come visit us — we have exciting new products for you.

Regards,
${storeName} (Powered by Vyapaar AI)`;
}

export function loyaltyRewardMessage(customerName: string, points: number, storeName = 'Vyapaar AI Store'): string {
  return `Dear ${customerName},

Great news! 🎁

You have earned ${points} loyalty points at ${storeName}.

Redeem them on your next purchase for amazing discounts!

Thank you for being a valued customer.

Regards,
${storeName}`;
}

export function premiumOfferMessage(customerName: string, offerDetail: string, storeName = 'Vyapaar AI Store'): string {
  return `Dear ${customerName},

As a Premium Member of ${storeName}, you get:

✨ ${offerDetail}

This exclusive offer is only for our top customers.

Visit us today!

Regards,
${storeName}`;
}

export function morningReportMessage(data: {
  todayBuy: string[];
  lowStock: string[];
  highDemand: string[];
  festival?: string;
  todayProfit: number;
  estimatedRevenue: number;
  storeName?: string;
}): string {
  const { todayBuy, lowStock, highDemand, festival, todayProfit, estimatedRevenue, storeName = 'Vyapaar AI Store' } = data;
  return `🌅 Good Morning! Here is your Daily Report from Vyapaar AI

📦 Today's Recommended Purchases:
${todayBuy.map((i, n) => `${n + 1}. ${i}`).join('\n')}

⚠️ Low Stock Alert:
${lowStock.map((i) => `• ${i}`).join('\n')}

🔥 High Demand Today:
${highDemand.map((i) => `• ${i}`).join('\n')}

${festival ? `🎉 Festival: ${festival} approaching — stock up!\n` : ''}
💰 Today's Estimated Profit: ₹${todayProfit.toLocaleString()}
📈 Estimated Revenue: ₹${estimatedRevenue.toLocaleString()}

Have a great day!
${storeName}`;
}

export function predictiveBuyMessage(recommendations: { name: string; qty: number }[], reasons: string[], storeName = 'Vyapaar AI Store'): string {
  const itemLines = recommendations.map((r, i) => `${i + 1}. ${r.name} = ${r.qty} units`).join('\n');
  const reasonLines = reasons.map((r) => `• ${r}`).join('\n');
  return `Good Morning! 🌟

Today's Recommended Purchases — Vyapaar AI:

${itemLines}

Reasons:
${reasonLines}

Please keep the stock ready.

Regards,
${storeName}`;
}

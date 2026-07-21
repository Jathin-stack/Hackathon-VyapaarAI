/**
 * AI Supplier Recommendation Engine
 *
 * Scores suppliers by: rating, delivery speed, price index, category match
 * Generates order messages ready for WhatsApp
 */

import { suppliers, products, type Supplier, type Product } from '../data/businessData';
import { getLowStockItems } from './inventoryPrediction';
import { lowStockSupplierMessage } from './whatsappService';

export interface SupplierScore {
  supplier: Supplier;
  score: number;
  reasons: string[];
  matchedCategories: string[];
}

export interface SupplierOrder {
  supplier: Supplier;
  items: { name: string; currentStock: number; recommendedQty: number }[];
  estimatedCost: number;
  deliveryDate: string;
  message: string;
}

function scoreSupplier(s: Supplier, categories: string[]): number {
  let score = 0;
  score += s.rating * 20;                          // max 100
  score += (5 - s.deliveryDays) * 10;              // faster = better, max 40
  score += (100 - s.priceIndex) * 2;               // cheaper = better, max ~24
  const catMatch = categories.filter((c) => s.categories.includes(c)).length;
  score += catMatch * 15;
  return score;
}

export function rankSuppliers(categories: string[] = []): SupplierScore[] {
  return suppliers
    .map((s) => {
      const score = scoreSupplier(s, categories);
      const matchedCategories = categories.filter((c) => s.categories.includes(c));
      const reasons: string[] = [];
      if (s.rating >= 4.8) reasons.push(`Top rated: ${s.rating}★`);
      else if (s.rating >= 4.5) reasons.push(`Highly rated: ${s.rating}★`);
      if (s.deliveryDays === 1) reasons.push('Same-day / next-day delivery');
      else if (s.deliveryDays <= 2) reasons.push(`Fast delivery: ${s.deliveryDays} days`);
      if (s.priceIndex <= 90) reasons.push('Best price in market');
      else if (s.priceIndex <= 95) reasons.push('Competitive pricing');
      if (matchedCategories.length > 0) reasons.push(`Supplies: ${matchedCategories.join(', ')}`);
      return { supplier: s, score, reasons, matchedCategories };
    })
    .sort((a, b) => b.score - a.score);
}

export function getBestSupplierForCategory(category: string): SupplierScore | null {
  const ranked = rankSuppliers([category]);
  return ranked.find((r) => r.matchedCategories.length > 0) || ranked[0] || null;
}

/** Generate a WhatsApp-ready order for low-stock items, grouped by best supplier */
export function generateSupplierOrders(): SupplierOrder[] {
  const lowStock = getLowStockItems();
  if (lowStock.length === 0) return [];

  // Group low-stock items by best matching supplier
  const supplierMap = new Map<string, { supplier: Supplier; items: Product[] }>();

  for (const product of lowStock) {
    const ranked = rankSuppliers([product.category]);
    const best = ranked[0];
    if (!best) continue;

    const key = best.supplier.id;
    if (!supplierMap.has(key)) {
      supplierMap.set(key, { supplier: best.supplier, items: [] });
    }
    supplierMap.get(key)!.items.push(product);
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const orders: SupplierOrder[] = [];

  supplierMap.forEach(({ supplier, items }) => {
    const orderItems = items.map((p) => ({
      name: p.name,
      currentStock: p.stock,
      recommendedQty: Math.max(p.reorderLevel * 3, p.soldWeek),
    }));

    const estimatedCost = orderItems.reduce((sum, item) => {
      const product = products.find((p) => p.name === item.name);
      return sum + (product ? product.cost * item.recommendedQty : 0);
    }, 0);

    const message = lowStockSupplierMessage(supplier.name, orderItems, deliveryStr);

    orders.push({ supplier, items: orderItems, estimatedCost, deliveryDate: deliveryStr, message });
  });

  return orders;
}

export function getTopSupplier(): SupplierScore {
  return rankSuppliers()[0];
}

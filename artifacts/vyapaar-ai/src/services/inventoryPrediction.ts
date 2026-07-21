/**
 * AI Inventory Prediction Engine
 *
 * Analyzes: inventory data, weather, festivals, weekly sales, trends
 * Outputs: buy recommendations, low-stock alerts, predicted demand
 */

import { products, weatherForecast, festivals, weeklySalesData, type Product } from '../data/businessData';

export interface BuyRecommendation {
  product: Product;
  recommendedQty: number;
  reason: string[];
  priority: 'urgent' | 'high' | 'normal';
  predictedDemandMultiplier: number;
}

const weatherDemandBoost: Record<string, string[]> = {
  rainy: ['Tea', 'Coffee', 'Milk', 'Bread', 'Biscuits', 'Instant Noodles', 'Umbrellas'],
  hot:   ['Ice Cream', 'Cold Drinks', 'Water Bottles'],
  cold:  ['Tea', 'Coffee', 'Milk', 'Instant Noodles'],
  storm: ['Umbrellas', 'Bread', 'Milk'],
  sunny: ['Cold Drinks', 'Water Bottles', 'Ice Cream'],
  cloudy:['Tea', 'Coffee', 'Biscuits'],
};

function avgWeeklySales(): number {
  return weeklySalesData.reduce((sum, d) => sum + d.sales, 0) / weeklySalesData.length;
}

export function generateBuyRecommendations(): BuyRecommendation[] {
  const tomorrow = weatherForecast[1];
  const boosted = weatherDemandBoost[tomorrow.condition] || [];
  const nearFestival = festivals.find((f) => f.daysUntil <= 14);
  const avgSales = avgWeeklySales();
  const recommendations: BuyRecommendation[] = [];

  for (const p of products) {
    const reasons: string[] = [];
    let multiplier = 1;
    let priority: BuyRecommendation['priority'] = 'normal';

    // Low stock check
    if (p.stock <= p.reorderLevel) {
      reasons.push(`Stock (${p.stock}) at or below reorder level (${p.reorderLevel})`);
      priority = p.stock === 0 ? 'urgent' : 'high';
      multiplier += 0.5;
    }

    // Weather boost
    if (boosted.includes(p.name)) {
      reasons.push(`${tomorrow.condition === 'rainy' ? 'Rain' : tomorrow.condition} forecast boosts ${p.name} demand`);
      multiplier += 0.4;
      if (priority === 'normal') priority = 'high';
    }

    // Festival boost
    if (nearFestival && nearFestival.products.includes(p.name)) {
      reasons.push(`${nearFestival.name} in ${nearFestival.daysUntil} days — stock up early`);
      multiplier += nearFestival.demandMultiplier - 1;
      priority = 'high';
    }

    // Trending
    if (p.trend === 'up') {
      reasons.push(`${p.name} sales are trending up this week`);
      multiplier += 0.2;
    }

    // Only recommend if there's a real reason or low stock
    if (reasons.length === 0 && p.stock > p.reorderLevel * 1.5) continue;
    if (reasons.length === 0) reasons.push('Routine restocking based on weekly sales velocity');

    const baseQty = Math.max(p.soldWeek * 0.5, p.reorderLevel * 2);
    const recommendedQty = Math.round(baseQty * multiplier / 10) * 10;

    recommendations.push({ product: p, recommendedQty, reason: reasons, priority, predictedDemandMultiplier: multiplier });
  }

  // Sort: urgent > high > normal, then by multiplier
  return recommendations.sort((a, b) => {
    const order = { urgent: 0, high: 1, normal: 2 };
    if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
    return b.predictedDemandMultiplier - a.predictedDemandMultiplier;
  });
}

export function getLowStockItems(): Product[] {
  return products.filter((p) => p.stock <= p.reorderLevel).sort((a, b) => (a.stock / a.reorderLevel) - (b.stock / b.reorderLevel));
}

export function getTopBuyList(limit = 5): { name: string; qty: number; reason: string }[] {
  return generateBuyRecommendations()
    .slice(0, limit)
    .map((r) => ({ name: r.product.name, qty: r.recommendedQty, reason: r.reason[0] }));
}

export function getPredictedHighDemand(): Product[] {
  const tomorrow = weatherForecast[1];
  const boosted = weatherDemandBoost[tomorrow.condition] || [];
  return products.filter((p) => boosted.includes(p.name) || p.trend === 'up').slice(0, 5);
}

export function getBuyRecommendationReasons(): string[] {
  const tomorrow = weatherForecast[1];
  const nearFestival = festivals.find((f) => f.daysUntil <= 30);
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const reasons: string[] = [];

  if (tomorrow.condition === 'rainy') reasons.push('Rain expected tomorrow — hot beverage & comfort food demand spikes');
  if (tomorrow.condition === 'hot') reasons.push('Hot weather forecast — cold drinks & ice cream demand will surge');
  if (tomorrow.condition === 'sunny') reasons.push('Sunny day expected — outdoor refreshments in high demand');
  if (nearFestival) reasons.push(`${nearFestival.name} approaching in ${nearFestival.daysUntil} days — stock festival items`);
  if (isWeekend) reasons.push('Weekend demand is typically 40% higher than weekdays');
  if (reasons.length < 2) reasons.push('Based on weekly sales velocity and trend analysis');

  return reasons;
}

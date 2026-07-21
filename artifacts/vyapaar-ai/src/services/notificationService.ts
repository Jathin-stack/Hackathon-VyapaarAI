/**
 * Notification Service
 *
 * Generates smart notifications from: inventory, weather, festivals, customers, AI insights
 * Provides a unified feed for the Notifications view
 */

import { getLowStockItems, getPredictedHighDemand, getBuyRecommendationReasons } from './inventoryPrediction';
import { getNextFestival } from './festivalEngine';
import { getTopSupplier } from './supplierRecommendation';
import { getSegmentStats } from './customerSegmentation';
import { weatherForecast } from '../data/businessData';

export type NotifCategory = 'inventory' | 'weather' | 'festival' | 'customer' | 'supplier' | 'finance' | 'ai';
export type NotifPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface SmartNotification {
  id: string;
  category: NotifCategory;
  priority: NotifPriority;
  title: string;
  body: string;
  action?: string;
  actionTarget?: string;
  time: string;
  read: boolean;
}

function nowTime(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function generateNotifications(): SmartNotification[] {
  const notifications: SmartNotification[] = [];
  const lowStock = getLowStockItems();
  const highDemand = getPredictedHighDemand();
  const tomorrow = weatherForecast[1];
  const nextFestival = getNextFestival();
  const topSupplier = getTopSupplier();
  const segStats = getSegmentStats();
  const reasons = getBuyRecommendationReasons();

  // Urgent inventory alerts
  lowStock.slice(0, 3).forEach((p, i) => {
    notifications.push({
      id: `inv-${p.id}`,
      category: 'inventory',
      priority: p.stock === 0 ? 'urgent' : 'high',
      title: `${p.name} stock critical`,
      body: `Only ${p.stock} units left (reorder at ${p.reorderLevel}). Restock immediately to avoid stockout.`,
      action: 'Order Now',
      actionTarget: 'suppliers',
      time: nowTime(),
      read: false,
    });
  });

  // Weather alert
  if (tomorrow.condition === 'rainy' || tomorrow.condition === 'storm' || tomorrow.condition === 'hot') {
    const emoji = { rainy: '🌧️', storm: '⛈️', hot: '☀️', sunny: '🌤️', cloudy: '☁️', cold: '❄️' }[tomorrow.condition] ?? '🌦️';
    notifications.push({
      id: 'weather-tomorrow',
      category: 'weather',
      priority: tomorrow.condition === 'storm' ? 'urgent' : 'high',
      title: `${emoji} ${tomorrow.condition.charAt(0).toUpperCase() + tomorrow.condition.slice(1)} forecast tomorrow`,
      body: `${tomorrow.temp}°C, ${tomorrow.humidity}% humidity. ${reasons[0] || 'Adjust stock accordingly.'}`,
      action: 'Adjust Stock',
      actionTarget: 'inventory',
      time: nowTime(),
      read: false,
    });
  }

  // Festival alert
  if (nextFestival && nextFestival.festival.daysUntil <= 30) {
    notifications.push({
      id: `festival-${nextFestival.festival.id}`,
      category: 'festival',
      priority: nextFestival.festival.daysUntil <= 7 ? 'high' : 'medium',
      title: `🎉 ${nextFestival.festival.name} in ${nextFestival.festival.daysUntil} days`,
      body: `Stock up on ${nextFestival.festival.products.slice(0, 3).join(', ')}. Expected ${nextFestival.festival.demandMultiplier}x demand spike.`,
      action: 'View Offers',
      actionTarget: 'festivals',
      time: nowTime(),
      read: false,
    });
  }

  // Inactive customers alert
  if (segStats.inactive > 0) {
    notifications.push({
      id: 'customers-inactive',
      category: 'customer',
      priority: 'medium',
      title: `${segStats.inactive} customers inactive 28+ days`,
      body: `Send a reactivation offer via WhatsApp. A 15% discount can bring them back.`,
      action: 'Send WhatsApp',
      actionTarget: 'whatsapp',
      time: nowTime(),
      read: false,
    });
  }

  // High demand prediction
  if (highDemand.length > 0) {
    notifications.push({
      id: 'demand-high',
      category: 'ai',
      priority: 'medium',
      title: `📈 High demand predicted: ${highDemand[0].name}`,
      body: `AI predicts ${highDemand.slice(0, 3).map((p) => p.name).join(', ')} will see increased demand. Stock up now.`,
      action: 'View Predictions',
      actionTarget: 'predictive',
      time: nowTime(),
      read: false,
    });
  }

  // Supplier recommendation
  notifications.push({
    id: `supplier-best`,
    category: 'supplier',
    priority: 'low',
    title: `🏆 Best supplier: ${topSupplier.supplier.name}`,
    body: `Rated ${topSupplier.supplier.rating}★ · ${topSupplier.supplier.deliveryDays}-day delivery · ${topSupplier.reasons[0]}`,
    action: 'Contact',
    actionTarget: 'suppliers',
    time: nowTime(),
    read: false,
  });

  // Morning AI report
  notifications.push({
    id: 'morning-report',
    category: 'ai',
    priority: 'high',
    title: '🌅 Your daily AI business report is ready',
    body: `Today's revenue target: ₹14,520 | Recommended buys: ${highDemand.slice(0, 2).map((p) => p.name).join(', ')} | ${lowStock.length} low-stock alerts`,
    action: 'View Dashboard',
    actionTarget: 'dashboard',
    time: '06:00 AM',
    read: false,
  });

  return notifications.sort((a, b) => {
    const order: Record<NotifPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });
}

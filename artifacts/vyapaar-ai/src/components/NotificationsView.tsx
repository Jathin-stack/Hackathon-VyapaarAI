import { useState } from 'react';
import { Bell, CheckCircle2, Info, TrendingUp, Package, Cloud, Users, MessageCircle, Sparkles, BellOff, ArrowRight, AlertTriangle, Store } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { generateNotifications, type SmartNotification, type NotifCategory } from '../services/notificationService';
import type { ViewKey } from './Sidebar';

const categoryIcon: Record<NotifCategory, typeof Bell> = {
  inventory: Package,
  weather:   Cloud,
  festival:  Sparkles,
  customer:  Users,
  supplier:  Store,
  finance:   TrendingUp,
  ai:        Bell,
};

const categoryColor: Record<NotifCategory, string> = {
  inventory: 'bg-amber-100 text-amber-600',
  weather:   'bg-blue-100 text-blue-600',
  festival:  'bg-purple-100 text-purple-600',
  customer:  'bg-emerald-100 text-emerald-600',
  supplier:  'bg-orange-100 text-orange-600',
  finance:   'bg-green-100 text-green-600',
  ai:        'bg-brand-100 text-brand-600',
};

const priorityBorder: Record<string, string> = {
  urgent: 'border-l-red-500 bg-red-50/30',
  high:   'border-l-amber-500 bg-amber-50/20',
  medium: 'border-l-brand-500 bg-brand-50/20',
  low:    'border-l-ink-300 bg-paper-card',
};

export function NotificationsView({ onNavigate }: { onNavigate?: (v: ViewKey) => void } = {}) {
  const { t } = useLang();
  const [allNotifications, setAllNotifications] = useState<SmartNotification[]>(() => generateNotifications());
  const [filter, setFilter] = useState<'all' | NotifCategory>('all');

  const unread = allNotifications.filter((n) => !n.read).length;

  const markAllRead = () => setAllNotifications((n) => n.map((item) => ({ ...item, read: true })));
  const markRead = (id: string) => setAllNotifications((n) => n.map((item) => item.id === id ? { ...item, read: true } : item));
  const dismiss = (id: string) => setAllNotifications((n) => n.filter((item) => item.id !== id));

  const visible = filter === 'all' ? allNotifications : allNotifications.filter((n) => n.category === filter);
  const categories: (NotifCategory | 'all')[] = ['all', 'inventory', 'weather', 'festival', 'customer', 'supplier', 'ai'];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 animate-slideUp">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">{t('notifications')}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            <span className="font-semibold text-brand-600">{unread} unread</span> · {allNotifications.length} total · AI-generated alerts
          </p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50">
          <CheckCircle2 className="h-4 w-4" /> Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 animate-slideUp">
        {categories.map((cat) => {
          const count = cat === 'all' ? allNotifications.filter((n) => !n.read).length : allNotifications.filter((n) => n.category === cat && !n.read).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all capitalize ${filter === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-paper-card border border-ink-200 text-ink-600 hover:border-brand-300'}`}
            >
              {cat === 'all' ? <Bell className="h-3 w-3" /> : (() => { const Icon = categoryIcon[cat]; return <Icon className="h-3 w-3" />; })()}
              {cat}
              {count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === cat ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Notification cards */}
      {visible.length === 0 ? (
        <div className="card p-12 text-center">
          <BellOff className="mx-auto mb-3 h-12 w-12 text-ink-faint" />
          <p className="text-ink-soft">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((n) => {
            const Icon = categoryIcon[n.category] || Bell;
            const iconStyle = categoryColor[n.category];
            return (
              <div
                key={n.id}
                className={`card border-l-4 p-4 transition-all hover:shadow-sm ${priorityBorder[n.priority]} ${!n.read ? 'ring-1 ring-brand-200' : 'opacity-80'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${!n.read ? iconStyle : 'bg-ink-100 text-ink-500'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-ink">{n.title}</p>
                          {!n.read && <span className="h-2 w-2 animate-pulseSoft rounded-full bg-brand-500" />}
                        </div>
                        <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                          n.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          n.priority === 'high'   ? 'bg-amber-100 text-amber-700' :
                          n.priority === 'medium' ? 'bg-brand-100 text-brand-700' :
                          'bg-ink-100 text-ink-500'
                        }`}>
                          {n.priority === 'urgent' && '🔴 '}{n.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-ink-400">{n.time}</span>
                        <button onClick={() => dismiss(n.id)} className="text-xs text-ink-300 hover:text-ink-500">✕</button>
                      </div>
                    </div>

                    <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{n.body}</p>

                    {(n.action || !n.read) && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        {n.action && (
                          <button
                            onClick={() => {
                              markRead(n.id);
                              if (n.actionTarget && onNavigate) onNavigate(n.actionTarget as ViewKey);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                          >
                            {n.action} <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                        {!n.read && (
                          <button onClick={() => markRead(n.id)} className="text-xs text-ink-400 hover:text-ink-600">
                            Mark read
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info footer */}
      <div className="rounded-xl border border-ink-100 bg-brand-50/30 p-4 text-center animate-slideUp">
        <Info className="mx-auto mb-1.5 h-4 w-4 text-brand-500" />
        <p className="text-xs text-ink-500">
          Notifications are generated by Vyapaar AI from your inventory, weather forecast, festivals, and customer data.
          Enable push notifications to receive these on your phone.
        </p>
      </div>
    </div>
  );
}

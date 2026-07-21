import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Info, TrendingUp, Package, Cloud, Users, MessageCircle, Sparkles, BellOff } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { allAgentInsights, type AIInsight } from '../ai/agents';

interface NotificationItem extends AIInsight {
  read: boolean;
  timestamp: string;
}

export function NotificationsView() {
  const { t, lang } = useLang();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const insights = allAgentInsights(lang);
    setNotifications(
      insights.map((ins, i) => ({
        ...ins,
        read: i > 3,
        timestamp: `${i * 7 + 3} min ago`,
      }))
    );
  }, [lang]);

  const markAllRead = () => setNotifications(n => n.map(item => ({ ...item, read: true })));
  const markRead = (id: string) => setNotifications(n => n.map(item => item.id === id ? { ...item, read: true } : item));

  const iconMap: Record<string, typeof Bell> = {
    inventory: Package, finance: TrendingUp, weather: Cloud, marketing: Sparkles,
    customer: Users, supplier: MessageCircle, advisor: Info,
  };

  const priorityColor: Record<string, string> = {
    high: 'border-l-overdue bg-overdue-light/30',
    medium: 'border-l-credit bg-primary-50/40',
    low: 'border-l-inventory bg-inventory-light/30',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between animate-slideUp">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">{t('notifications')}</h1>
          <p className="text-sm text-ink-soft mt-1">
            {notifications.filter(n => !n.read).length} unread of {notifications.length} total
          </p>
        </div>
        <button onClick={markAllRead} className="btn-ghost text-xs">
          <CheckCircle2 className="w-4 h-4" />
          {t('markAllRead')}
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <BellOff className="w-12 h-12 text-ink-faint mx-auto mb-3" />
          <p className="text-ink-soft">{t('noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = iconMap[n.agent] || Bell;
            return (
              <div
                key={n.id}
                className={`card border-l-4 p-4 transition-all ${priorityColor[n.priority]} ${!n.read ? 'ring-1 ring-secondary/20' : 'opacity-75'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-secondary text-white' : 'bg-ink-100 text-ink-600'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-ink">{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-secondary animate-pulseSoft" />}
                    </div>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-ink-faint">{n.timestamp}</span>
                      {n.value && <span className="text-xs font-semibold text-secondary">{n.value}</span>}
                      {n.action && !n.read && (
                        <button onClick={() => markRead(n.id)} className="text-xs font-semibold text-secondary hover:text-secondary-deep transition-colors">
                          {n.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

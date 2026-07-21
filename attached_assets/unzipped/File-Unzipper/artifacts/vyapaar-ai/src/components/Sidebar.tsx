import { LayoutDashboard, Package, Wallet, Megaphone, Users, Truck, Cloud, Sparkles, Brain, MessageCircle, Heart, Trophy, TrendingUp, Store, FileText, Bell, Mic, Settings, User, Lightbulb } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/translations';

export type ViewKey =
  | 'dashboard' | 'inventory' | 'finance' | 'marketing' | 'customers' | 'suppliers'
  | 'weather' | 'festivals' | 'predictive' | 'advisor' | 'whatsapp' | 'health' | 'gamification'
  | 'reports' | 'notifications' | 'voice' | 'settings' | 'profile' | 'recommendations';

const navItems: { key: ViewKey; icon: typeof LayoutDashboard; labelKey: TranslationKey }[] = [
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { key: 'advisor', icon: Brain, labelKey: 'advisor' },
  { key: 'voice', icon: Mic, labelKey: 'voiceAssistant' },
  { key: 'inventory', icon: Package, labelKey: 'inventory' },
  { key: 'finance', icon: Wallet, labelKey: 'finance' },
  { key: 'suppliers', icon: Truck, labelKey: 'suppliers' },
  { key: 'marketing', icon: Megaphone, labelKey: 'marketing' },
  { key: 'customers', icon: Users, labelKey: 'customers' },
  { key: 'predictive', icon: TrendingUp, labelKey: 'predictive' },
  { key: 'weather', icon: Cloud, labelKey: 'weather' },
  { key: 'festivals', icon: Sparkles, labelKey: 'festivals' },
  { key: 'whatsapp', icon: MessageCircle, labelKey: 'whatsapp' },
  { key: 'health', icon: Heart, labelKey: 'health' },
  { key: 'recommendations', icon: Lightbulb, labelKey: 'aiRecommendation' },
  { key: 'reports', icon: FileText, labelKey: 'reports' },
  { key: 'notifications', icon: Bell, labelKey: 'notifications' },
  { key: 'gamification', icon: Trophy, labelKey: 'gamification' },
  { key: 'settings', icon: Settings, labelKey: 'settings' },
  { key: 'profile', icon: User, labelKey: 'profile' },
];

export function Sidebar({ active, onSelect, mobileOpen, onClose }: { active: ViewKey; onSelect: (v: ViewKey) => void; mobileOpen: boolean; onClose: () => void }) {
  const { t } = useLang();

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-200/40 bg-paper-card transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-200/40 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
            <Store className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-serif font-bold text-ink">{t('appName')}</p>
            <p className="text-[10px] font-medium text-secondary">AI Business OS</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { onSelect(item.key); onClose(); }}
                  className={`nav-item w-full ${isActive ? 'nav-item-active' : ''}`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: 18, height: 18 }} />
                  <span className="truncate">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </nav>
        <div className="border-t border-ink-200/40 p-4">
          <div className="rounded-xl bg-primary-50 p-3 border border-primary-100">
            <p className="text-xs font-bold text-secondary">{t('autonomousMode')}</p>
            <p className="mt-1 text-[11px] text-secondary-deep">{t('workingAutomatically')}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulseSoft rounded-full bg-secondary" />
              <span className="text-[11px] font-semibold text-secondary">{t('yourAiEmployee')}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

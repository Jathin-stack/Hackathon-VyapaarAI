import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Wallet, Megaphone, Users, Truck, Cloud,
  Sparkles, Brain, MessageCircle, Heart, Trophy, TrendingUp, Store,
  FileText, Bell, Mic, Settings, User, Lightbulb, X, ShoppingCart,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigation } from '../context/NavigationContext';
import { businessMetrics, healthScores } from '../data/businessData';
import type { TranslationKey } from '../i18n/translations';

export type ViewKey =
  | 'dashboard' | 'inventory' | 'finance' | 'marketing' | 'customers' | 'suppliers'
  | 'weather' | 'festivals' | 'predictive' | 'advisor' | 'whatsapp' | 'health' | 'gamification'
  | 'reports' | 'notifications' | 'voice' | 'settings' | 'profile' | 'recommendations' | 'pos';

const navSections: { heading?: string; items: { key: ViewKey; icon: typeof LayoutDashboard; labelKey: TranslationKey }[] }[] = [
  {
    items: [
      { key: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
      { key: 'advisor', icon: Brain, labelKey: 'advisor' },
      { key: 'voice', icon: Mic, labelKey: 'voiceAssistant' },
    ],
  },
  {
    heading: 'Business',
    items: [
      { key: 'finance', icon: Wallet, labelKey: 'finance' },
      { key: 'inventory', icon: Package, labelKey: 'inventory' },
      { key: 'customers', icon: Users, labelKey: 'customers' },
      { key: 'suppliers', icon: Truck, labelKey: 'suppliers' },
      { key: 'pos', icon: ShoppingCart, labelKey: 'posBilling' },
    ],
  },
  {
    heading: 'AI Tools',
    items: [
      { key: 'predictive', icon: TrendingUp, labelKey: 'predictive' },
      { key: 'festivals', icon: Sparkles, labelKey: 'festivals' },
      { key: 'marketing', icon: Megaphone, labelKey: 'marketing' },
      { key: 'whatsapp', icon: MessageCircle, labelKey: 'whatsapp' },
      { key: 'recommendations', icon: Lightbulb, labelKey: 'aiRecommendation' },
    ],
  },
  {
    heading: 'Reports',
    items: [
      { key: 'health', icon: Heart, labelKey: 'health' },
      { key: 'reports', icon: FileText, labelKey: 'reports' },
      { key: 'gamification', icon: Trophy, labelKey: 'gamification' },
      { key: 'weather', icon: Cloud, labelKey: 'weather' },
      { key: 'notifications', icon: Bell, labelKey: 'notifications' },
    ],
  },
  {
    heading: 'Account',
    items: [
      { key: 'settings', icon: Settings, labelKey: 'settings' },
      { key: 'profile', icon: User, labelKey: 'profile' },
    ],
  },
];

// All items flattened (for collapsed icon strip)
const allItems = navSections.flatMap(s => s.items);

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { t } = useLang();
  const { isPinned, isDesktopOpen, openDesktop, scheduleClose, cancelClose, togglePin } = useSidebar();
  const { navigate, active } = useNavigation();
  const isOpen = isDesktopOpen || isPinned;

  const handleSelect = (key: ViewKey) => {
    navigate(key);
    onClose(); // close mobile drawer
  };

  const score = Math.round((healthScores.overall ?? 0.82) * 100);
  const totalSales = businessMetrics?.todaySales ?? 14520;

  return (
    <>
      {/* ── Mobile backdrop ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[48] bg-ink-900/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ───────────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 72 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onMouseEnter={() => { cancelClose(); openDesktop(); }}
        onMouseLeave={scheduleClose}
        className="hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300 ease-out overflow-hidden border-r border-ink-200/30 shadow-[4px_0_32px_rgba(42,31,20,0.14)]"
        style={{
          minWidth: isOpen ? 280 : 72,
          background: 'rgba(253,249,241,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex h-16 items-center gap-3 px-4 border-b border-ink-200/30 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow flex-shrink-0">
            <Store className="h-5 w-5" strokeWidth={2.5} />
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-serif font-bold text-ink leading-tight">{t('appName')}</p>
              <p className="text-[10px] font-semibold text-secondary tracking-wide">AI Business OS</p>
            </div>
          )}
          {isPinned && isOpen && (
            <button
              onClick={togglePin}
              className="p-1.5 rounded-lg text-ink-soft hover:bg-primary-50 hover:text-secondary transition-colors"
              title="Unpin sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className={`px-4 pt-4 pb-2 flex gap-2 flex-shrink-0 ${!isOpen ? 'hidden' : ''}`}>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/60 px-3 py-2 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-primary-700 opacity-70">Score</p>
            <p className="text-base font-serif font-bold text-secondary leading-tight">{score}%</p>
          </div>
          <div className="flex-1 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200/60 px-3 py-2 text-center">
            <p className="text-[9px] font-bold uppercase tracking-wider text-secondary-600 opacity-70">Today</p>
            <p className="text-base font-serif font-bold text-secondary leading-tight">₹{(totalSales/1000).toFixed(1)}k</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
          {navSections.map((section, si) => (
            <div key={si} className="mb-1">
              {section.heading && isOpen && (
                <p className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                  {section.heading}
                </p>
              )}
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <motion.button
                    key={item.key}
                    whileHover={{ x: isOpen ? 3 : 0 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={() => handleSelect(item.key)}
                    className={`nav-item w-full mb-0.5 ${isActive ? 'nav-item-active' : ''} ${!isOpen ? 'justify-center px-2' : ''}`}
                  >
                    <Icon className="shrink-0" style={{ width: 17, height: 17 }} />
                    <span className={isOpen ? 'truncate' : 'sr-only'}>{t(item.labelKey)}</span>
                    {item.key === 'notifications' && isOpen && (
                      <span className="ml-auto flex h-4.5 w-4.5 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white" style={{ minWidth: 18, height: 18 }}>3</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </nav>

        {isOpen && (
          <div className="flex-shrink-0 border-t border-ink-200/30 p-4">
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 p-3 border border-primary-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2 w-2 animate-pulseSoft rounded-full bg-secondary flex-shrink-0" />
                <p className="text-xs font-bold text-secondary">{t('autonomousMode')}</p>
              </div>
              <p className="text-[11px] text-secondary-deep leading-tight">{t('workingAutomatically')}</p>
            </div>
          </div>
        )}
      </motion.aside>

      {/* ── Mobile Sidebar drawer ─────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        className="fixed left-0 top-0 bottom-0 z-[50] w-72 flex flex-col lg:hidden
          border-r border-ink-200/30 shadow-[4px_0_32px_rgba(42,31,20,0.2)]"
        style={{
          background: 'rgba(253,249,241,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Mobile header */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-ink-200/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
            <Store className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-serif font-bold text-ink">{t('appName')}</p>
            <p className="text-[10px] font-semibold text-secondary">AI Business OS</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-soft hover:bg-primary-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          {navSections.map((section, si) => (
            <div key={si} className="mb-1">
              {section.heading && (
                <p className="px-3 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                  {section.heading}
                </p>
              )}
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className={`nav-item w-full mb-0.5 ${isActive ? 'nav-item-active' : ''}`}
                  >
                    <Icon className="shrink-0" style={{ width: 17, height: 17 }} />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-ink-200/30 p-4">
          <div className="rounded-xl bg-primary-50 p-3 border border-primary-100">
            <p className="text-xs font-bold text-secondary">{t('autonomousMode')}</p>
            <p className="mt-1 text-[11px] text-secondary-deep">{t('workingAutomatically')}</p>
          </div>
        </div>
      </motion.aside>

    </>
  );
}

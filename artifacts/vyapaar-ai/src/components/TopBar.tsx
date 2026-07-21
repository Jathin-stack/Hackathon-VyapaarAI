import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Mic, Bell, Brain, LogOut,
  ChevronDown, Sparkles, X, Check, Pin, PinOff,
  TrendingUp, Package, Zap, MessageCircle,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../auth/AuthContext';
import { useSidebar } from '../context/SidebarContext';

import { useNavigation } from '../context/NavigationContext';
import { generateNotifications, type NotifCategory } from '../services/notificationService';
import { healthScores } from '../data/businessData';
import type { ViewKey } from './Sidebar';

const QUICK_ACTIONS: { icon: typeof Zap; label: string; view: ViewKey; color: string }[] = [
  { icon: Package, label: 'Inventory', view: 'inventory', color: 'text-inventory-deep' },
  { icon: TrendingUp, label: 'Predict', view: 'predictive', color: 'text-sale-deep' },
  { icon: MessageCircle, label: 'WhatsApp', view: 'whatsapp', color: 'text-whatsapp-deep' },
  { icon: Brain, label: 'AI Advisor', view: 'advisor', color: 'text-secondary' },
];

const categoryEmoji: Record<NotifCategory, string> = {
  inventory: '📦',
  weather:   '🌤️',
  festival:  '🎉',
  customer:  '👥',
  supplier:  '🏬',
  finance:   '📈',
  ai:        '🤖',
};

interface Props {
  onMobileMenuClick: () => void;
  onSearchOpen: () => void;
}

export function TopBar({ onMobileMenuClick, onSearchOpen }: Props) {
  const { t } = useLang();
  const { signOut } = useAuth();
  const { isPinned, togglePin } = useSidebar();
  const { navigate } = useNavigation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = generateNotifications().slice(0, 6);
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;
  const score = Math.round((healthScores.overall ?? 0.82) * 100);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const priorityColor = (p: string) => {
    if (p === 'urgent') return 'bg-overdue text-white';
    if (p === 'high') return 'bg-secondary text-white';
    if (p === 'medium') return 'bg-primary text-white';
    return 'bg-ink-100 text-ink-soft';
  };

  return (
    <header
      className="sticky top-0 z-[40] flex h-14 items-center gap-2 px-3 lg:px-4 border-b border-ink-200/30"
      style={{
        background: 'rgba(253,249,241,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Logo + Menu ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile: opens mobile drawer */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-xl text-ink-soft hover:bg-primary-50 hover:text-secondary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop: pin/unpin sidebar */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePin}
          className={`hidden lg:flex p-2 rounded-xl transition-colors ${isPinned ? 'bg-secondary text-white shadow-glow' : 'text-ink-soft hover:bg-primary-50 hover:text-secondary'}`}
          title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
        >
          {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </motion.button>

        {/* Logo mark */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-serif font-bold text-ink hidden xl:block">{t('appName')}</span>
        </div>
      </div>

      {/* ── Search bar ──────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        onClick={onSearchOpen}
        className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 rounded-xl border border-ink-200/50 bg-paper-card/60 text-left transition-all hover:border-secondary/30 hover:bg-paper-card"
      >
        <Search className="h-3.5 w-3.5 text-ink-faint shrink-0" />
        <span className="text-xs text-ink-faint flex-1 truncate hidden sm:block">{t('search')}… products, customers, pages</span>
        <span className="text-xs text-ink-faint flex-1 truncate sm:hidden">Search…</span>
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <kbd className="px-1 py-0.5 text-[9px] font-mono rounded bg-ink-100 border border-ink-200/50 text-ink-faint">⌘K</kbd>
        </div>
      </motion.button>

      {/* ── Right controls ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Voice search */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate('voice')}
          className="p-2 rounded-xl text-ink-soft hover:bg-primary-50 hover:text-secondary transition-colors"
          title="Voice Entry"
        >
          <Mic className="h-4 w-4" />
        </motion.button>

        {/* Quick actions (desktop only) */}
        <div className="hidden xl:flex items-center gap-1 mr-1">
          {QUICK_ACTIONS.map(qa => {
            const Icon = qa.icon;
            return (
              <motion.button
                key={qa.view}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(qa.view)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors hover:bg-primary-50 ${qa.color}`}
                title={qa.label}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden 2xl:block">{qa.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Business health score */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sale-light border border-sale-light">
          <span className="h-1.5 w-1.5 rounded-full bg-sale animate-pulseSoft" />
          <span className="text-xs font-bold text-sale-deep">{score}%</span>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
            className="relative p-2 rounded-xl text-ink-soft hover:bg-primary-50 hover:text-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-secondary text-white text-[8px] font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                key="notif-panel"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-ink-200/30 shadow-[0_16px_40px_rgba(42,31,20,0.18)] overflow-hidden z-50"
                style={{ background: 'rgba(253,249,241,0.98)', backdropFilter: 'blur(20px)' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink-200/20">
                  <div>
                    <p className="text-sm font-bold text-ink">Notifications</p>
                    <p className="text-[10px] text-ink-faint">{unreadCount} unread</p>
                  </div>
                  <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg text-ink-faint hover:text-ink transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-ink-200/10">
                  {notifications.map(n => {
                    const isRead = readIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-primary-50/50 transition-colors ${isRead ? 'opacity-60' : ''}`}
                        onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                      >
                        <span className="text-lg shrink-0">{categoryEmoji[n.category] || '🔔'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-ink truncate">{n.title}</p>
                          <p className="text-[11px] text-ink-soft mt-0.5 line-clamp-2">{n.body}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${priorityColor(n.priority)}`}>
                            {n.priority}
                          </span>
                          {isRead && <Check className="h-3 w-3 text-sale" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 py-2.5 border-t border-ink-200/20">
                  <button
                    onClick={() => { navigate('notifications'); setNotifOpen(false); }}
                    className="w-full text-xs font-semibold text-secondary hover:text-secondary-deep transition-colors py-1"
                  >
                    View all notifications →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Language switcher */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>

        {/* Profile avatar + dropdown */}
        <div ref={profileRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            className="flex items-center gap-1.5 p-1 pr-2 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold shadow-glow">
              K
            </div>
            <ChevronDown className={`h-3 w-3 text-ink-faint transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                key="profile-menu"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-ink-200/30 shadow-[0_16px_40px_rgba(42,31,20,0.18)] overflow-hidden z-50"
                style={{ background: 'rgba(253,249,241,0.98)', backdropFilter: 'blur(20px)' }}
              >
                <div className="px-4 py-3 border-b border-ink-200/20">
                  <p className="text-sm font-bold text-ink">My Shop</p>
                  <p className="text-[11px] text-ink-faint">demo@vyapaarai.com</p>
                </div>
                <div className="p-1.5">
                  {[
                    { label: 'Profile', view: 'profile' as ViewKey },
                    { label: 'Settings', view: 'settings' as ViewKey },
                  ].map(item => (
                    <button
                      key={item.view}
                      onClick={() => { navigate(item.view); setProfileOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-ink-700 hover:bg-primary-50 hover:text-secondary transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-ink-200/20 mt-1 pt-1">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-overdue-deep hover:bg-overdue-light transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

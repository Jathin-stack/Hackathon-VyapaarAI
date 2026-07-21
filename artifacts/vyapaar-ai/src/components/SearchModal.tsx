import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, Users, Truck, TrendingUp, Sparkles, MessageCircle, LayoutDashboard, Wallet, Brain, Mic, Bell, FileText, Settings, ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import type { ViewKey } from './Sidebar';
import { products, customers, suppliers } from '../data/businessData';

const QUICK_LINKS: { label: string; view: ViewKey; icon: typeof Search; hint: string }[] = [
  { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard, hint: 'Overview & AI insights' },
  { label: 'Inventory', view: 'inventory', icon: Package, hint: 'Stock & products' },
  { label: 'Customers', view: 'customers', icon: Users, hint: 'Udhaar & CRM' },
  { label: 'Suppliers', view: 'suppliers', icon: Truck, hint: 'Orders & contacts' },
  { label: 'Predictive AI', view: 'predictive', icon: TrendingUp, hint: 'Buy recommendations' },
  { label: 'Festival Campaigns', view: 'festivals', icon: Sparkles, hint: 'Offers & marketing' },
  { label: 'WhatsApp', view: 'whatsapp', icon: MessageCircle, hint: 'Messages & automation' },
  { label: 'Finance', view: 'finance', icon: Wallet, hint: 'Sales & expenses' },
  { label: 'AI Advisor', view: 'advisor', icon: Brain, hint: 'Business recommendations' },
  { label: 'Voice Entry', view: 'voice', icon: Mic, hint: 'Speak to record' },
  { label: 'Notifications', view: 'notifications', icon: Bell, hint: 'Alerts & updates' },
  { label: 'Reports', view: 'reports', icon: FileText, hint: 'Analytics & exports' },
  { label: 'Settings', view: 'settings', icon: Settings, hint: 'Shop configuration' },
];

// keyword → view routing
const KEYWORD_MAP: { keywords: string[]; view: ViewKey }[] = [
  { keywords: ['stock', 'inventory', 'product', 'item', 'milk', 'rice', 'tea', 'oil', 'dal', 'sugar', 'atta', 'salt', 'biscuit', 'snack', 'low stock'], view: 'inventory' },
  { keywords: ['sale', 'profit', 'revenue', 'finance', 'cash', 'expense', 'income', 'money', 'earn', 'payment', 'today profit', 'daily'], view: 'finance' },
  { keywords: ['customer', 'udhaar', 'credit', 'client', 'buyer', 'return', 'loyal'], view: 'customers' },
  { keywords: ['supplier', 'vendor', 'wholesaler', 'order', 'purchase', 'restock'], view: 'suppliers' },
  { keywords: ['festival', 'diwali', 'holi', 'eid', 'navratri', 'puja', 'offer', 'discount', 'campaign', 'marketing'], view: 'festivals' },
  { keywords: ['whatsapp', 'message', 'broadcast', 'send', 'wa'], view: 'whatsapp' },
  { keywords: ['weather', 'rain', 'monsoon', 'temperature', 'forecast'], view: 'weather' },
  { keywords: ['predict', 'buy', 'demand', 'trend', 'forecast', 'recommend buy'], view: 'predictive' },
  { keywords: ['advisor', 'advice', 'suggest', 'recommendation', 'insight', 'ai'], view: 'advisor' },
  { keywords: ['voice', 'speak', 'mic', 'record', 'audio', 'listen'], view: 'voice' },
  { keywords: ['notification', 'alert', 'update', 'reminder'], view: 'notifications' },
  { keywords: ['report', 'analytics', 'export', 'chart', 'graph', 'summary'], view: 'reports' },
  { keywords: ['health', 'score', 'business score', 'performance'], view: 'health' },
  { keywords: ['gamification', 'badge', 'achievement', 'reward', 'trophy'], view: 'gamification' },
  { keywords: ['settings', 'config', 'setup', 'shop'], view: 'settings' },
  { keywords: ['profile', 'account', 'me', 'my shop'], view: 'profile' },
  { keywords: ['marketing', 'promo', 'ad', 'banner', 'promotion'], view: 'marketing' },
];

function findView(query: string): ViewKey | null {
  const q = query.toLowerCase().trim();
  for (const { keywords, view } of KEYWORD_MAP) {
    if (keywords.some(k => q.includes(k))) return view;
  }
  return null;
}

interface SearchResult {
  type: 'page' | 'product' | 'customer' | 'supplier';
  label: string;
  sub: string;
  view: ViewKey;
  icon: typeof Search;
}

function getResults(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Page matches
  QUICK_LINKS.filter(l => l.label.toLowerCase().includes(q) || l.hint.toLowerCase().includes(q))
    .slice(0, 3).forEach(l => results.push({ type: 'page', label: l.label, sub: l.hint, view: l.view, icon: l.icon }));

  // Product matches
  if (products) {
    (products as { name: string; category: string }[])
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 3).forEach(p => results.push({ type: 'product', label: p.name, sub: p.category, view: 'inventory', icon: Package }));
  }

  // Customer matches
  if (customers) {
    (customers as { name: string; phone?: string }[])
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 2).forEach(c => results.push({ type: 'customer', label: c.name, sub: c.phone ?? 'Customer', view: 'customers', icon: Users }));
  }

  // Supplier matches
  if (suppliers) {
    (suppliers as { name: string; category?: string }[])
      .filter(s => s.name.toLowerCase().includes(q))
      .slice(0, 2).forEach(s => results.push({ type: 'supplier', label: s.name, sub: s.category ?? 'Supplier', view: 'suppliers', icon: Truck }));
  }

  return results.slice(0, 8);
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigate } = useNavigation();

  const results = query ? getResults(query) : [];
  const showQuick = !query;

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Cmd+K to open/close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) return; // parent handles open
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Arrow navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      const total = showQuick ? QUICK_LINKS.length : results.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, total - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (showQuick) {
          goTo(QUICK_LINKS[selected].view);
        } else if (results[selected]) {
          goTo(results[selected].view);
        } else {
          const mapped = findView(query);
          if (mapped) goTo(mapped);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, showQuick, results, selected, query]);

  const goTo = (view: ViewKey) => {
    navigate(view);
    onClose();
  };

  const typeBadgeColor = (type: string) => {
    if (type === 'product') return 'bg-inventory-light text-inventory-deep';
    if (type === 'customer') return 'bg-sale-light text-sale-deep';
    if (type === 'supplier') return 'bg-purchase-light text-purchase-deep';
    return 'bg-primary-50 text-secondary';
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-ink-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="search-modal"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed left-1/2 top-[12%] -translate-x-1/2 z-[201] w-full max-w-xl px-4"
          >
            <div className="rounded-2xl border border-ink-200/30 shadow-[0_24px_60px_rgba(42,31,20,0.25)] overflow-hidden"
              style={{ background: 'rgba(253,249,241,0.97)', backdropFilter: 'blur(24px)' }}>
              
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-ink-200/20">
                <Search className="h-5 w-5 text-ink-faint shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0); }}
                  placeholder="Search products, customers, pages… (⌘K)"
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-ink-faint hover:text-ink transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-ink-100 text-ink-faint border border-ink-200/50">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[380px] overflow-y-auto scrollbar-thin">
                {showQuick ? (
                  <div className="p-3">
                    <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-ink-faint">Quick Navigate</p>
                    <div className="grid grid-cols-2 gap-1">
                      {QUICK_LINKS.map((link, i) => {
                        const Icon = link.icon;
                        return (
                          <motion.button
                            key={link.view}
                            whileHover={{ x: 2 }}
                            onClick={() => goTo(link.view)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${selected === i ? 'bg-primary-50 text-secondary' : 'hover:bg-ink-50 text-ink-700'}`}
                          >
                            <Icon className="shrink-0 h-4 w-4 text-secondary" />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{link.label}</p>
                              <p className="text-[10px] text-ink-faint truncate">{link.hint}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((r, i) => {
                      const Icon = r.icon;
                      return (
                        <motion.button
                          key={`${r.type}-${r.label}`}
                          whileHover={{ x: 3 }}
                          onClick={() => goTo(r.view)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${selected === i ? 'bg-primary-50' : 'hover:bg-ink-50'}`}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 shrink-0">
                            <Icon className="h-4 w-4 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{r.label}</p>
                            <p className="text-xs text-ink-faint truncate">{r.sub}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadgeColor(r.type)}`}>
                            {r.type}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 text-ink-faint shrink-0" />
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-ink-faint">No results for "{query}"</p>
                    <p className="text-xs text-ink-faint mt-1">Try: milk, festival, customers, profit…</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-ink-200/20 bg-ink-50/50">
                <span className="flex items-center gap-1 text-[10px] text-ink-faint">
                  <kbd className="px-1.5 py-0.5 rounded bg-ink-100 border border-ink-200/50 font-mono">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1 text-[10px] text-ink-faint">
                  <kbd className="px-1.5 py-0.5 rounded bg-ink-100 border border-ink-200/50 font-mono">↵</kbd> go
                </span>
                <span className="flex items-center gap-1 text-[10px] text-ink-faint ml-auto">
                  Vyapaar AI Search
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

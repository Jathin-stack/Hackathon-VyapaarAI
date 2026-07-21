import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Mic, Brain, Bell } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import type { ViewKey } from './Sidebar';

const ITEMS: { key: ViewKey; icon: typeof LayoutDashboard; label: string }[] = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { key: 'inventory', icon: Package, label: 'Stock' },
  { key: 'voice', icon: Mic, label: 'Voice' },
  { key: 'advisor', icon: Brain, label: 'AI' },
  { key: 'notifications', icon: Bell, label: 'Alerts' },
];

export function BottomNav() {
  const { navigate, active } = useNavigation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden"
      style={{
        background: 'rgba(253,249,241,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(42,31,20,0.08)',
        boxShadow: '0 -4px 20px rgba(42,31,20,0.08)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(item.key)}
              className="relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl min-w-[56px]"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div className="relative">
                <Icon
                  style={{ width: 20, height: 20 }}
                  className={isActive ? 'text-secondary' : 'text-ink-soft'}
                />
                {item.key === 'notifications' && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-secondary text-white text-[8px] font-bold">3</span>
                )}
              </div>
              <span className={`text-[10px] font-semibold relative ${isActive ? 'text-secondary' : 'text-ink-faint'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

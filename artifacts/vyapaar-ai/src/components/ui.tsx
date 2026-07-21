import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function StatCard({
  icon: Icon, label, value, sublabel, trend, color = 'brand',
}: {
  icon: LucideIcon; label: string; value: string; sublabel?: string; trend?: 'up' | 'down' | 'stable'; color?: 'brand' | 'blue' | 'amber' | 'rose' | 'violet';
}) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    violet: 'bg-violet-50 text-violet-700',
  };
  return (
    <div className="card card-hover p-5 animate-slideUp">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-brand-600' : trend === 'down' ? 'text-rose-500' : 'text-ink-400'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-ink-900">{value}</p>
      <p className="stat-label mt-1">{label}</p>
      {sublabel && <p className="mt-0.5 text-xs text-ink-400">{sublabel}</p>}
    </div>
  );
}

export function SectionCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="card p-5 animate-slideUp">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink-900">{title}</h3>
      {action}
      </div>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'brand' }) {
  const map = {
    success: 'bg-brand-50 text-brand-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    neutral: 'bg-ink-100 text-ink-600',
    brand: 'bg-brand-600 text-white',
  };
  return <span className={`chip ${map[variant]}`}>{children}</span>;
}

export function ProgressBar({ value, max = 100, color = 'brand' }: { value: number; max?: number; color?: 'brand' | 'amber' | 'rose' }) {
  const pct = Math.min(100, (value / max) * 100);
  const colorMap = { brand: 'bg-brand-500', amber: 'bg-amber-500', rose: 'bg-rose-500' };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
      <div className={`h-full rounded-full transition-all duration-500 ${colorMap[color]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

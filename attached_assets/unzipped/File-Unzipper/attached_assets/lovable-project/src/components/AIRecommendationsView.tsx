import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Package, Users, Cloud, Sparkles, Brain, ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { allAgentInsights, type AIInsight } from '../ai/agents';

export function AIRecommendationsView() {
  const { t, lang } = useLang();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [implemented, setImplemented] = useState<Set<string>>(new Set());

  useEffect(() => {
    setInsights(allAgentInsights(lang));
  }, [lang]);

  const toggleDismiss = (id: string) => setDismissed(s => new Set(s).add(id));
  const toggleImplement = (id: string) => setImplemented(s => new Set(s).add(id));

  const iconMap: Record<string, typeof Lightbulb> = {
    inventory: Package, finance: TrendingUp, weather: Cloud, marketing: Sparkles,
    customer: Users, supplier: ArrowRight, advisor: Brain,
  };

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    high: { bg: 'bg-overdue-light/40', text: 'text-overdue-deep', border: 'border-overdue/30' },
    medium: { bg: 'bg-primary-50/50', text: 'text-secondary', border: 'border-primary-100' },
    low: { bg: 'bg-inventory-light/40', text: 'text-inventory-deep', border: 'border-inventory/20' },
  };

  const activeInsights = insights.filter(i => !dismissed.has(i.id));
  const autonomousActions = [
    { icon: Package, label: 'Inventory auto-optimized', detail: 'Reorder points adjusted for 3 products', time: '2 min ago' },
    { icon: TrendingUp, label: 'Revenue forecast updated', detail: 'Next month projection: ₹1,42,000', time: '5 min ago' },
    { icon: Sparkles, label: 'Festival offers generated', detail: 'Independence Day campaign created', time: '12 min ago' },
    { icon: Users, label: 'Customer segments analyzed', detail: '2 inactive customers flagged for reactivation', time: '18 min ago' },
    { icon: Cloud, label: 'Weather impact predicted', detail: 'Rain tomorrow — 6 products affected', time: '25 min ago' },
  ];

  return (
    <div className="space-y-5">
      <div className="animate-slideUp">
        <h1 className="font-serif text-2xl font-bold text-ink">{t('aiRecommendations')}</h1>
        <p className="text-sm text-ink-soft mt-1">{t('actionableAdvice')} from your AI agents</p>
      </div>

      {/* Autonomous actions */}
      <div className="card p-5 animate-slideUp">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink">{t('autonomousActions')}</h3>
        </div>
        <div className="space-y-2">
          {autonomousActions.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary-50/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                <a.icon className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{a.label}</p>
                <p className="text-xs text-ink-soft">{a.detail}</p>
              </div>
              <span className="text-xs text-ink-faint flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="animate-slideUp">
        <div className="section-divider mb-4" style={{ padding: 0 }}>
          <span className="label"><Lightbulb className="w-4 h-4" /> {t('smartInsights')}</span>
          <div className="rule" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {activeInsights.map((ins) => {
          const Icon = iconMap[ins.agent] || Lightbulb;
          const colors = colorMap[ins.priority];
          const isImplemented = implemented.has(ins.id);
          return (
            <div key={ins.id} className={`card border ${colors.border} p-5 animate-slideUp`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-ink">{ins.title}</p>
                    <span className={`tag ${ins.priority === 'high' ? 'tag-overdue' : ins.priority === 'medium' ? 'tag-credit' : 'tag-inventory'}`}>
                      {ins.priority === 'high' ? t('priorityHigh') : ins.priority === 'medium' ? t('priorityMedium') : t('priorityLow')}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed mb-3">{ins.message}</p>
                  {ins.value && <p className="font-serif text-lg font-bold text-secondary mb-2">{ins.value}</p>}
                  <div className="flex items-center gap-2">
                    {ins.action && !isImplemented && (
                      <button onClick={() => toggleImplement(ins.id)} className="btn-primary text-xs py-1.5 px-3">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('implement')}
                      </button>
                    )}
                    {isImplemented && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-sale-deep">
                        <CheckCircle2 className="w-4 h-4" />
                        Implemented
                      </span>
                    )}
                    <button onClick={() => toggleDismiss(ins.id)} className="text-xs font-medium text-ink-faint hover:text-overdue-deep transition-colors flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      {t('dismiss')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeInsights.length === 0 && (
        <div className="card p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-sale mx-auto mb-3" />
          <p className="text-ink-soft">All recommendations have been addressed!</p>
        </div>
      )}
    </div>
  );
}

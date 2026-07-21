import { Trophy, TrendingUp, Rocket, Package, Award, Megaphone, Lightbulb, Star, Flame, Zap } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { Badge } from './ui';
import { achievements, growthScore } from '../data/businessData';
import type { TranslationKey } from '../i18n/translations';

const iconMap: Record<string, typeof Trophy> = {
  TrendingUp, Rocket, Package, Award, Megaphone, Lightbulb,
};

export function GamificationView() {
  const { t } = useLang();

  const levelPct = (growthScore.points / growthScore.nextLevelPoints) * 100;

  return (
    <div className="space-y-6">
      {/* Growth Score Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-6 text-white shadow-lg animate-slideUp">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">{t('growthScore')}</span>
            </div>
            <h2 className="mt-2 text-4xl font-bold">{growthScore.current}/100</h2>
            <p className="mt-1 text-sm opacity-90">{t('currentLevel')}: {growthScore.level} • {growthScore.points.toLocaleString()} pts</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
              <Flame className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-bold">{growthScore.streak} day streak</span>
            </div>
            <p className="mt-2 text-xs opacity-80">{t('nextLevel')}: {growthScore.nextLevelPoints.toLocaleString()} pts</p>
          </div>
        </div>
        <div className="relative mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${levelPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs opacity-80">{Math.round(levelPct)}% to {t('nextLevel')}</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">{t('achievements')}</h3>
          <Badge variant="brand">{achievements.filter((a) => a.earned).length}/{achievements.length}</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const Icon = iconMap[a.icon] || Star;
            const nameKey = a.name as TranslationKey;
            return (
              <div key={a.id} className={`rounded-xl border p-4 transition-all ${a.earned ? 'border-brand-200 bg-brand-50/30' : 'border-ink-100 opacity-60'}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.earned ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-400'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{t(nameKey)}</p>
                    <p className="text-xs text-ink-400">{a.earned ? 'Earned' : 'Locked'}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-ink-500">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">{t('leaderboard')}</h3>
        </div>
        <div className="space-y-2">
          {[
            { rank: 1, name: t('shopName'), score: growthScore.current, you: true },
            { rank: 2, name: 'Shri Ganesh Kirana', score: 72 },
            { rank: 3, name: 'Anand Provision Store', score: 68 },
            { rank: 4, name: 'Sai Baba General Store', score: 61 },
            { rank: 5, name: 'Venkateswara Mart', score: 55 },
          ].map((e) => (
            <div key={e.rank} className={`flex items-center gap-3 rounded-xl p-3 ${e.you ? 'border border-brand-200 bg-brand-50/30' : 'border border-ink-50'}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${e.rank === 1 ? 'bg-amber-100 text-amber-700' : e.rank === 2 ? 'bg-ink-200 text-ink-600' : e.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-ink-50 text-ink-500'}`}>
                {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : e.rank}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">{e.name} {e.you && <Badge variant="brand">You</Badge>}</p>
              </div>
              <span className="text-sm font-bold text-brand-600">{e.score}/100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

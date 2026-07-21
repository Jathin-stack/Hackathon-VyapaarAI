import { Menu, Search, Sparkles, LogOut } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../auth/AuthContext';

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useLang();
  const { signOut } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening');

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200/40 bg-paper/80 px-4 backdrop-blur-xl lg:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 text-ink-700 hover:bg-primary-50 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden sm:block">
        <p className="text-sm font-serif font-bold text-ink">{greeting}!</p>
        <p className="text-xs text-ink-soft">{t('shopName')}</p>
      </div>
      <div className="relative ml-auto hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          placeholder={t('search')}
          className="w-full rounded-xl border border-ink-200 bg-paper-card py-2 pl-10 pr-4 text-sm text-ink-700 outline-none transition-all focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/10"
        />
      </div>
      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <div className="hidden items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 lg:flex">
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          <span className="text-xs font-semibold text-secondary">{t('aiPartner')}</span>
        </div>
        <button onClick={() => signOut()} className="rounded-lg p-2 text-ink-600 hover:bg-overdue-light hover:text-overdue-deep transition-colors" title="Sign out">
          <LogOut className="h-4 w-4" />
        </button>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

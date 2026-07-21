import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export function LanguageSwitcher() {
  const { lang, setLang, languages, currentInfo } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 transition-all hover:bg-ink-50"
      >
        <Globe className="h-4 w-4 text-brand-600" />
        <span className="hidden sm:inline">{currentInfo.nativeName}</span>
        <span className="sm:hidden text-lg">{currentInfo.flag}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-ink-100 bg-white p-2 shadow-lg scrollbar-thin animate-slideUp">
          <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-400">
            {languages.length} Languages
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all ${
                lang === l.code ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink-700 hover:bg-ink-50'
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span className="flex-1 text-left">{l.nativeName}</span>
              <span className="text-xs text-ink-400">{l.name}</span>
              {lang === l.code && <Check className="h-4 w-4 text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

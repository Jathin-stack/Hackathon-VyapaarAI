import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { LangCode } from './languages';
import { LANGUAGES, LANG_MAP } from './languages';
import { t as translate, type TranslationKey } from './translations';

interface LanguageContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: TranslationKey) => string;
  languages: typeof LANGUAGES;
  currentInfo: (typeof LANGUAGES)[number];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'vyapaarai-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
      if (saved && LANG_MAP[saved]) return saved;
    }
    return 'en';
  });

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: TranslationKey) => translate(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES, currentInfo: LANG_MAP[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

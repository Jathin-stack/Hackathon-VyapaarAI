export type LangCode =
  | 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml'
  | 'mr' | 'bn' | 'gu' | 'pa' | 'ur' | 'or';

export interface LanguageInfo {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
  voice: string; // BCP-47 for speech synthesis
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', voice: 'en-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', voice: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', voice: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', voice: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', voice: 'ml-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', voice: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', voice: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', voice: 'gu-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', voice: 'pa-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', flag: '🇮🇳', voice: 'ur-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', voice: 'or-IN' },
];

export const LANG_MAP: Record<LangCode, LanguageInfo> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l]),
) as Record<LangCode, LanguageInfo>;

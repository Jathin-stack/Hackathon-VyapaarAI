import { Megaphone, MessageCircle, Image, Gift, Sparkles, ArrowRight, Copy } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { marketingAgentInsights } from '../ai/agents';

export function MarketingView() {
  const { t, lang } = useLang();
  const insights = marketingAgentInsights(lang);
  const [copied, setCopied] = useState<string | null>(null);

  const campaigns: Record<string, { en: string; hi: string; te: string }> = {
    festival: {
      en: 'Happy Sankranti! Grab our exclusive festival offers today. Buy 2 Get 1 Free on all sweets & snacks!',
      hi: 'संक्रांति की हार्दिक शुभकामनाएं! हमारे विशेष ऑफर्स का लाभ उठाएं। सभी मिठाइयों पर खरीदें 2 पाएं 1 मुफ्त!',
      te: 'సంక్రాంతి శుభాకాంక్షలు! మా ప్రత్యేక ఆఫర్లను ఇప్పుడే పొందండి. అన్ని మిఠాయిలపై 2 కొనుగోలు 1 ఉచితం!',
    },
    promo: {
      en: 'Special Offer! Get 20% off on Tea & Coffee this rainy season. Visit Sri Lakshmi Kirana Store today!',
      hi: 'विशेष ऑफर! इस बारिश के मौसम में चाय और कॉफी पर 20% छूट पाएं। आज ही श्री लक्ष्मी किराना स्टोर आएं!',
      te: 'ప్రత్యేక ఆఫర్! ఈ వర్షాకాలంలో టీ మరియు కాఫీపై 20% తగ్గింపు. నేడే శ్రీ లక్ష్మి కిరాణా స్టోర్‌కు రండి!',
    },
    loyalty: {
      en: 'Dear Valued Customer, enjoy 50 bonus loyalty points on your next purchase! Thank you for shopping with us.',
      hi: 'प्रिय ग्राहक, अपनी अगली खरीद पर 50 बोनस लॉयल्टी पॉइंट्स पाएं! हमारे साथ खरीदारी के लिए धन्यवाद।',
      te: 'ప్రియ గ్రాహకుడివా, మీ తదుపరి కొనుగోలుపై 50 బోనస్ లాయల్టీ పాయింట్లు పొందండి! మా వద్ద కొనుగోలు చేసినందుకు ధన్యవాదాలు.',
    },
  };

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Megaphone} label={t('campaigns')} value="12" color="brand" />
        <StatCard icon={Image} label={t('posters')} value="8" color="blue" />
        <StatCard icon={Gift} label={t('festivalOffers')} value="5" color="amber" />
        <StatCard icon={MessageCircle} label={t('whatsappMsg')} value="24" color="brand" />
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('generateCampaign')}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(campaigns).map(([key, texts]) => {
            const text = texts[lang as 'en' | 'hi' | 'te'] || texts.en;
            const isFestival = key === 'festival';
            const isLoyalty = key === 'loyalty';
            return (
              <div key={key} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-200 hover:shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  {isFestival ? <Gift className="h-4 w-4 text-amber-600" /> : isLoyalty ? <Sparkles className="h-4 w-4 text-brand-600" /> : <Megaphone className="h-4 w-4 text-blue-600" />}
                  <Badge variant={isFestival ? 'warning' : isLoyalty ? 'brand' : 'neutral'}>
                    {isFestival ? t('festivalGreeting') : isLoyalty ? t('loyaltyReward') : t('promoMessage')}
                  </Badge>
                </div>
                <p className="text-sm text-ink-700">{text}</p>
                <button onClick={() => copy(key, text)} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                  {copied === key ? <><Sparkles className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('aiRecommendation')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
              <Badge variant={ins.priority === 'high' ? 'danger' : 'warning'}>{ins.title}</Badge>
              <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
              {ins.action && <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600">{ins.action} <ArrowRight className="h-3 w-3" /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { MessageCircle, Send, Users, Gift, Bell, Sparkles, Copy } from 'lucide-react';
import { useState } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge } from './ui';
import { customers } from '../data/businessData';

export function WhatsappView() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState<number | null>(null);

  const templates: Record<string, { en: string; hi: string; te: string }>[] = [
    {
      festival: {
        en: 'Happy Sankranti! Grab our exclusive festival offers today. Buy 2 Get 1 Free on all sweets & snacks!',
        hi: 'संक्रांति की हार्दिक शुभकामनाएं! हमारे विशेष ऑफर्स का लाभ उठाएं। सभी मिठाइयों पर खरीदें 2 पाएं 1 मुफ्त!',
        te: 'సంక్రాంతి శుభాకాంక్షలు! మా ప్రత్యేక ఆఫర్లను ఇప్పుడే పొందండి. అన్ని మిఠాయిలపై 2 కొనుగోలు 1 ఉచితం!',
      },
    },
    {
      offer: {
        en: 'Special Offer! Get 20% off on Tea & Coffee this rainy season. Visit our store today!',
        hi: 'विशेष ऑफर! इस बारिश के मौसम में चाय और कॉफी पर 20% छूट पाएं। आज ही हमारे स्टोर आएं!',
        te: 'ప్రత్యేక ఆఫర్! ఈ వర్షాకాలంలో టీ మరియు కాఫీపై 20% తగ్గింపు. నేడే మా స్టోర్‌కు రండి!',
      },
    },
    {
      reminder: {
        en: 'Dear Customer, your monthly payment of ₹2,500 is due. Please clear it at your earliest convenience.',
        hi: 'प्रिय ग्राहक, आपका मासिक भुगतान ₹2,500 देय है। कृपया जल्द ही भुगतान करें।',
        te: 'ప్రియ గ్రాహకుడివా, మీ నెలవారీ చెల్లింపు ₹2,500 గడువు దాటింది. దయచేసి త్వరలో చెల్లించండి.',
      },
    },
    {
      loyalty: {
        en: 'Dear Valued Customer, enjoy 50 bonus loyalty points on your next purchase! Thank you for shopping with us.',
        hi: 'प्रिय ग्राहक, अपनी अगली खरीद पर 50 बोनस लॉयल्टी पॉइंट्स पाएं! हमारे साथ खरीदारी के लिए धन्यवाद।',
        te: 'ప్రియ గ్రాహకుడివా, మీ తదుపరి కొనుగోలుపై 50 బోనస్ లాయల్టీ పాయింట్లు పొందండి! మా వద్ద కొనుగోలు చేసినందుకు ధన్యవాదాలు.',
      },
    },
  ];

  const copy = (i: number, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={MessageCircle} label={t('messagesGenerated')} value="24" color="brand" />
        <StatCard icon={Users} label={t('customers')} value="785" color="blue" />
        <StatCard icon={Gift} label={t('offersGenerated')} value="12" color="amber" />
        <StatCard icon={Bell} label={t('campaigns')} value="8" color="brand" />
      </div>

      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-bold text-ink-900">{t('whatsappMsg')}</h3>
          <Badge variant="brand"><Sparkles className="h-3 w-3" /> {lang.toUpperCase()}</Badge>
        </div>
        <div className="space-y-3">
          {templates.map((tmpl, i) => {
            const [key, texts] = Object.entries(tmpl)[0];
            const text = (texts as any)[lang] || (texts as any).en;
            const label = key === 'festival' ? t('festivalGreeting') : key === 'offer' ? t('promoMessage') : key === 'reminder' ? 'Payment Reminder' : t('loyaltyReward');
            return (
              <div key={i} className="rounded-xl border border-ink-100 p-4 transition-all hover:border-brand-200">
                <div className="flex items-center justify-between">
                  <Badge variant={key === 'festival' ? 'warning' : key === 'reminder' ? 'danger' : 'brand'}>{label}</Badge>
                  <button onClick={() => copy(i, text)} className="flex items-center gap-1 text-xs font-semibold text-brand-600">
                    {copied === i ? <><Sparkles className="h-3 w-3" /> Copied!</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                </div>
                <p className="mt-2 text-sm text-ink-700">{text}</p>
                <button className="mt-3 flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-700">
                  <Send className="h-3 w-3" /> WhatsApp
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('customerEngagement')}</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {customers.filter((c) => c.segment !== 'inactive').slice(0, 6).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border border-ink-100 p-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{c.name}</p>
                <p className="text-xs text-ink-400">{c.phone}</p>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition-all hover:bg-brand-100">
                <MessageCircle className="h-3 w-3" /> Send
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

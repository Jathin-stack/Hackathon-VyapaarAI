import type { LangCode } from '../i18n/languages';
import { products, weatherForecast, customers, suppliers } from '../data/businessData';

export interface AIInsight {
  id: string;
  agent: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  action?: string;
  value?: string;
}

// Weather → product impact mapping
const weatherImpact: Record<string, { increase: string[]; decrease: string[] }> = {
  rainy: {
    increase: ['Tea', 'Coffee', 'Milk', 'Bread', 'Biscuits', 'Instant Noodles', 'Umbrellas'],
    decrease: ['Ice Cream', 'Cold Drinks'],
  },
  hot: {
    increase: ['Ice Cream', 'Cold Drinks', 'Water Bottles', 'Chocolates'],
    decrease: ['Tea', 'Coffee'],
  },
  cold: {
    increase: ['Tea', 'Coffee', 'Milk', 'Instant Noodles'],
    decrease: ['Ice Cream', 'Cold Drinks'],
  },
  storm: {
    increase: ['Umbrellas', 'Bread', 'Milk'],
    decrease: ['Ice Cream', 'Cold Drinks', 'Water Bottles'],
  },
  sunny: {
    increase: ['Cold Drinks', 'Water Bottles', 'Ice Cream'],
    decrease: ['Tea', 'Coffee'],
  },
  cloudy: {
    increase: ['Tea', 'Coffee', 'Biscuits'],
    decrease: ['Ice Cream'],
  },
};

const agentNames: Record<string, Record<LangCode, string>> = {
  inventory: {
    en: 'Inventory Agent', hi: 'इन्वेंटरी एजेंट', te: 'ఇన్వెంటరీ ఏజెంట్',
    ta: 'சரக்கு முகவர்', kn: 'ಇನ್ವೆಂಟರಿ ಏಜೆಂಟ್', ml: 'ഇൻവെൻററി ഏജൻറ്',
    mr: 'इन्व्हेंटरी एजंट', bn: 'ইনভেন্টরি এজেন্ট', gu: 'ઇન્વેન્ટરી એજન્ટ',
    pa: 'ਇਨਵੈਂਟਰੀ ਏਜੰਟ', ur: 'انوینٹری ایجنٹ', or: 'ଇନଭେଣ୍ଟୋରୀ ଏଜେଣ୍ଟ',
  },
  finance: {
    en: 'Finance Agent', hi: 'वित्त एजेंट', te: 'ఆర్థిక ఏజెంట్',
    ta: 'நிதி முகவர்', kn: 'ಹಣಕಾಸು ಏಜೆಂಟ್', ml: 'ധനകാര്യ ഏജൻറ്',
    mr: 'वित्त एजंट', bn: 'অর্থ এজেন্ট', gu: 'નાણાકીય એજન્ટ',
    pa: 'ਵਿੱਤ ਏਜੰਟ', ur: 'مالیات ایجنٹ', or: 'ଅର୍ଥନ ଏଜେଣ୍ଟ',
  },
  marketing: {
    en: 'Marketing Agent', hi: 'मार्केटिंग एजेंट', te: 'మార్కెటింగ్ ఏజెంట్',
    ta: 'சந்தைப்படுத்தல் முகவர்', kn: 'ಮಾರ್ಕೆಟಿಂಗ್ ಏಜೆಂಟ್', ml: 'മാർക്കറ്റിംഗ് ഏജൻറ്',
    mr: 'मार्केटिंग एजंट', bn: 'মার্কেটিং এজেন্ট', gu: 'માર્કેટિંગ એજન્ટ',
    pa: 'ਮਾਰਕੀਟਿੰਗ ਏਜੰਟ', ur: 'مارکیٹنگ ایجنٹ', or: 'ମାର୍କେଟିଂ ଏଜେଣ୍ଟ',
  },
  weather: {
    en: 'Weather Agent', hi: 'मौसम एजेंट', te: 'వాతావరణ ఏజెంట్',
    ta: 'வானிலை முகவர்', kn: 'ಹವಾಮಾನ ಏಜೆಂಟ್', ml: 'കാലാവസ്ഥ ഏജൻറ്',
    mr: 'हवामान एजंट', bn: 'আবহাওয়া এজেন্ট', gu: 'હવામાન એજન્ટ',
    pa: 'ਮੌਸਮ ਏਜੰਟ', ur: 'موسم ایجنٹ', or: 'ପାଣିପାଟି ଏଜେଣ୍ଟ',
  },
  advisor: {
    en: 'Business Advisor', hi: 'व्यापार सलाहकार', te: 'వ్యాపార సలహాదారు',
    ta: 'வணிக ஆலோசகர்', kn: 'ವ್ಯಾಪಾರ ಸಲಹೆಗಾರ', ml: 'ബിസിനസ് ഉപദേശകൻ',
    mr: 'व्यवसाय सल्लागार', bn: 'ব্যবসা উপদেষ্টা', gu: 'વ્યવસાય સલાહકાર',
    pa: 'ਕਾਰੋਬਾਰ ਸਲਾਹਕਾਰ', ur: 'کاروبار مشیر', or: 'ବ୍ୟବସାୟ ଉପଦେଷ୍ଟା',
  },
  customer: {
    en: 'Customer Agent', hi: 'ग्राहक एजेंट', te: 'కస్టమర్ ఏజెంట్',
    ta: 'வாடிக்கையாளர் முகவர்', kn: 'ಗ್ರಾಹಕ ಏಜೆಂಟ್', ml: 'ഉപഭോക്തൃ ഏജൻറ്',
    mr: 'ग्राहक एजंट', bn: 'গ্রাহক এজেন্ট', gu: 'ગ્રાહક એજન્ટ',
    pa: 'ਗਾਹਕ ਏਜੰਟ', ur: 'گاہک ایجنٹ', or: 'ଗ୍ରାହକ ଏଜେଣ୍ଟ',
  },
  supplier: {
    en: 'Supplier Agent', hi: 'आपूर्तिकर्ता एजेंट', te: 'సరఫరాదారు ఏజెంట్',
    ta: 'வழங்குநர் முகவர்', kn: 'ಪೂರೈಕೆದಾರ ಏಜೆಂಟ್', ml: 'വിതരണക്കാരൻ ഏജൻറ്',
    mr: 'पुरवठादार एजंट', bn: 'সরবরাহকারী এজেন্ট', gu: 'પુરવઠાદાર એજન્ટ',
    pa: 'ਸਪਲਾਇਰ ਏਜੰਟ', ur: 'سپلائر ایجنٹ', or: 'ଯୋଗାଣଦାତା ଏଜେଣ୍ଟ',
  },
};

export function getAgentName(agent: string, lang: LangCode): string {
  return agentNames[agent]?.[lang] || agentNames[agent]?.en || agent;
}

// Inventory AI Agent
export function inventoryAgentInsights(lang: LangCode): AIInsight[] {
  const lowStock = products.filter((p) => p.stock <= p.reorderLevel);
  const deadStock = products.filter((p) => p.soldWeek < 30);
  const trending = products.filter((p) => p.trend === 'up').slice(0, 3);

  const insights: AIInsight[] = [];

  lowStock.slice(0, 3).forEach((p) => {
    insights.push({
      id: `inv-low-${p.id}`,
      agent: 'inventory',
      priority: p.stock === 0 ? 'high' : 'medium',
      title: lang === 'te' ? `${p.name} స్టాక్ తక్కువ` : lang === 'hi' ? `${p.name} स्टॉक कम` : `${p.name} low stock`,
      message: lang === 'te'
        ? `${p.name} స్టాక్ ${p.stock} యూనిట్లు మాత్రమే మిగిలి ఉంది. రీఆర్డర్ స్థాయి ${p.reorderLevel}. వెంటనే భర్తీ చేయమని సిఫార్సు.`
        : lang === 'hi'
        ? `${p.name} स्टॉक केवल ${p.stock} इकाई शेष है। रीऑर्डर स्तर ${p.reorderLevel}। तुरंत भरने की सलाह।`
        : `${p.name} has only ${p.stock} units left. Reorder level is ${p.reorderLevel}. Restock immediately recommended.`,
      action: lang === 'te' ? 'వెంటనే భర్తీ చేయి' : lang === 'hi' ? 'तुरंत भरें' : 'Restock Now',
      value: `${p.stock} ${lang === 'te' ? 'యూనిట్లు' : lang === 'hi' ? 'इकाई' : 'units'}`,
    });
  });

  deadStock.forEach((p) => {
    insights.push({
      id: `inv-dead-${p.id}`,
      agent: 'inventory',
      priority: 'low',
      title: lang === 'te' ? `${p.name} - డెడ్ స్టాక్` : lang === 'hi' ? `${p.name} - मृत स्टॉक` : `${p.name} - Dead Stock`,
      message: lang === 'te'
        ? `${p.name} వారంలో ${p.soldWeek} యూనిట్లు మాత్రమే అమ్మక. ఈ ఉత్పత్తిని నిలిపివేయడం పరిగణించండి.`
        : lang === 'hi'
        ? `${p.name} केवल ${p.soldWeek} इकाई प्रति सप्ताह बिकी। इस उत्पाद को बंद करने पर विचार करें।`
        : `${p.name} sold only ${p.soldWeek} units this week. Consider discontinuing this product.`,
      value: `${p.soldWeek}/week`,
    });
  });

  trending.forEach((p) => {
    insights.push({
      id: `inv-trend-${p.id}`,
      agent: 'inventory',
      priority: 'medium',
      title: lang === 'te' ? `${p.name} - ట్రెండింగ్` : lang === 'hi' ? `${p.name} - ट्रेंडिंग` : `${p.name} - Trending`,
      message: lang === 'te'
        ? `${p.name} అమ్మకాలు పెరుగుతున్నాయి. స్టాక్ పెంచడం వలన ₹${Math.round(p.price * 20)} అదనపు లాభం ఆశించవచ్చు.`
        : lang === 'hi'
        ? `${p.name} की बिक्री बढ़ रही है। स्टॉक बढ़ाने से ₹${Math.round(p.price * 20)} अतिरिक्त लाभ संभव।`
        : `${p.name} sales are trending up. Increasing stock could yield ₹${Math.round(p.price * 20)} additional profit.`,
      value: `+${lang === 'te' ? 'పెరుగుతున్న' : lang === 'hi' ? 'बढ़त' : 'rising'}`,
    });
  });

  return insights;
}

// Finance AI Agent
export function financeAgentInsights(lang: LangCode): AIInsight[] {
  return [
    {
      id: 'fin-1', agent: 'finance', priority: 'high',
      title: lang === 'te' ? 'లాభం 8% తగ్గింది' : lang === 'hi' ? 'लाभ 8% कम' : 'Profit decreased 8%',
      message: lang === 'te'
        ? 'ఈ నెల లాభం గత నెల కంటే 8% తగ్గింది. సరఫరాదారు ఖర్చులు తగ్గిస్తే ₹4,000 లాభం పెరగవచ్చు.'
        : lang === 'hi'
        ? 'इस माह का लाभ पिछले माह से 8% कम है। आपूर्तिकर्ता खर्च कम करने से ₹4,000 लाभ बढ़ सकता है।'
        : 'This month\'s profit is 8% lower than last month. Reducing supplier costs may increase profits by ₹4,000.',
      action: lang === 'te' ? 'ఖర్చులు తగ్గించండి' : lang === 'hi' ? 'खर्च कम करें' : 'Reduce Costs',
      value: '₹4,000',
    },
    {
      id: 'fin-2', agent: 'finance', priority: 'medium',
      title: lang === 'te' ? 'నగదు ప్రవాహం స్థిరంగా' : lang === 'hi' ? 'नकद प्रवाह स्थिर' : 'Cash flow stable',
      message: lang === 'te'
        ? 'నగదు ప్రవాహం స్థిరంగా ఉంది. వారాంతపు ఆదాయం ₹38,600. ఖర్చులు ₹24,200. నికర ₹14,400.'
        : lang === 'hi'
        ? 'नकद प्रवाह स्थिर है। साप्ताहिक आय ₹38,600। खर्च ₹24,200। शुद्ध ₹14,400।'
        : 'Cash flow is stable. Weekly revenue ₹38,600. Expenses ₹24,200. Net ₹14,400.',
      value: '₹14,400',
    },
    {
      id: 'fin-3', agent: 'finance', priority: 'low',
      title: lang === 'te' ? 'నెలవారీ ఆర్థిక అంచనా' : lang === 'hi' ? 'मासिक वित्तीय अनुमान' : 'Monthly financial forecast',
      message: lang === 'te'
        ? 'ఈ నెల అంచనా ఆదాయం ₹1,24,000. లాభం ₹46,000. వృద్ధి రేటు 14.8%.'
        : lang === 'hi'
        ? 'इस माह की अनुमानित आय ₹1,24,000। लाभ ₹46,000। वृद्धि दर 14.8%।'
        : 'This month\'s projected revenue ₹1,24,000. Profit ₹46,000. Growth rate 14.8%.',
      value: '+14.8%',
    },
  ];
}

// Weather AI Agent
export function weatherAgentInsights(lang: LangCode): AIInsight[] {
  const tomorrow = weatherForecast[1];
  const impact = weatherImpact[tomorrow.condition];
  const insights: AIInsight[] = [];

  const conditionText: Record<string, Partial<Record<LangCode, string>>> = {
    rainy: { en: 'Heavy Rain', hi: 'भारी बारिश', te: 'భారీ వర్షం' },
    hot: { en: 'Hot Weather', hi: 'गर्म मौसम', te: 'ఎండ' },
    cold: { en: 'Cold Weather', hi: 'ठंड', te: 'చలి' },
    sunny: { en: 'Sunny', hi: 'धूप', te: 'ఎండ' },
    cloudy: { en: 'Cloudy', hi: 'बादल', te: 'మేఘావృతం' },
    storm: { en: 'Storm Alert', hi: 'तूफान', te: 'తుఫాను' },
  };

  insights.push({
    id: 'weather-1', agent: 'weather', priority: 'high',
    title: lang === 'te' ? `రేపటి: ${conditionText[tomorrow.condition]?.te || tomorrow.condition}`
      : lang === 'hi' ? `कल: ${conditionText[tomorrow.condition]?.hi || tomorrow.condition}`
      : `Tomorrow: ${conditionText[tomorrow.condition]?.en || tomorrow.condition}`,
    message: lang === 'te'
      ? `రేపటి ఉష్ణోగ్రత ${tomorrow.temp}°C, తేమ ${tomorrow.humidity}%. ${impact.increase.join(', ')} అమ్మకాలు పెరిగే అవకాశం. ${impact.decrease.length > 0 ? impact.decrease.join(', ') + ' తగ్గవచ్చు.' : ''}`
      : lang === 'hi'
      ? `कल तापमान ${tomorrow.temp}°C, नमी ${tomorrow.humidity}%। ${impact.increase.join(', ')} की बिक्री बढ़ सकती है। ${impact.decrease.length > 0 ? impact.decrease.join(', ') + ' कम हो सकती है।' : ''}`
      : `Tomorrow ${tomorrow.temp}°C, humidity ${tomorrow.humidity}%. ${impact.increase.join(', ')} sales expected to increase. ${impact.decrease.length > 0 ? impact.decrease.join(', ') + ' may decrease.' : ''}`,
    action: lang === 'te' ? 'స్టాక్ సర్దుబాటు' : lang === 'hi' ? 'स्टॉक समायोजन' : 'Adjust Stock',
    value: `${tomorrow.temp}°C`,
  });

  // Ice cream specific example if rainy
  if (tomorrow.condition === 'rainy') {
    const iceCream = products.find((p) => p.name === 'Ice Cream');
    if (iceCream) {
      insights.push({
        id: 'weather-2', agent: 'weather', priority: 'high',
        title: lang === 'te' ? 'ఐస్ క్రీమ్ - అదనపు స్టాక్ వద్దు' : lang === 'hi' ? 'आइसक्रीम - अतिरिक्त स्टॉक नहीं' : 'Ice Cream - No extra stock',
        message: lang === 'te'
          ? `రేపటి వర్షం కారణంగా ఐస్ క్రీమ్ అమ్మకాలు 70% తగ్గవచ్చు. అదనపు స్టాక్ కొనవద్దు. లాభం ఆదా: ₹${iceCream.cost * 30}.`
          : lang === 'hi'
          ? `कल बारिश के कारण आइसक्रीम बिक्री 70% कम हो सकती है। अतिरिक्त स्टॉक न खरीदें। लाभ बचत: ₹${iceCream.cost * 30}।`
          : `Due to tomorrow's rain, Ice Cream sales may drop 70%. Do not purchase additional stock. Profit saved: ₹${iceCream.cost * 30}.`,
        action: lang === 'te' ? 'కొనవద్దు' : lang === 'hi' ? 'खरीद न करें' : 'Do Not Purchase',
        value: `₹${iceCream.cost * 30}`,
      });
    }
  }

  return insights;
}

// Marketing AI Agent
export function marketingAgentInsights(lang: LangCode): AIInsight[] {
  return [
    {
      id: 'mkt-1', agent: 'marketing', priority: 'medium',
      title: lang === 'te' ? 'సంక్రాంతి ఆఫర్ ప్రచారం' : lang === 'hi' ? 'संक्रांति ऑफर प्रचार' : 'Sankranti offer campaign',
      message: lang === 'te'
        ? 'సంక్రాంతి శుభాకాంక్షలు! మా ప్రత్యేక ఆఫర్లను ఇప్పుడే పొందండి.'
        : lang === 'hi'
        ? 'संक्रांति की हार्दिक शुभकामनाएं! हमारे विशेष ऑफर्स का लाभ उठाएं।'
        : 'Happy Sankranti! Grab our exclusive festival offers today.',
      action: lang === 'te' ? 'ప్రచారం పంపండి' : lang === 'hi' ? 'प्रचार भेजें' : 'Send Campaign',
    },
    {
      id: 'mkt-2', agent: 'marketing', priority: 'medium',
      title: lang === 'te' ? 'ట్రెండింగ్ ఉత్పత్తుల ప్రమోషన్' : lang === 'hi' ? 'ट्रेंडिंग उत्पाद प्रचार' : 'Trending product promotion',
      message: lang === 'te'
        ? 'Tea, Biscuits, Instant Noodles ట్రెండింగ్‌లో ఉన్నాయి. WhatsApp ప్రచారం ద్వారా 25% అమ్మకాలు పెంచవచ్చు.'
        : lang === 'hi'
        ? 'Tea, Biscuits, Instant Noodles ट्रेंडिंग में हैं। WhatsApp प्रचार से 25% बिक्री बढ़ा सकते हैं।'
        : 'Tea, Biscuits, Instant Noodles are trending. WhatsApp campaign can boost sales by 25%.',
      action: lang === 'te' ? 'WhatsApp పంపండి' : lang === 'hi' ? 'WhatsApp भेजें' : 'Send WhatsApp',
    },
  ];
}

// Customer AI Agent
export function customerAgentInsights(lang: LangCode): AIInsight[] {
  const inactive = customers.filter((c) => c.segment === 'inactive');
  const premium = customers.filter((c) => c.segment === 'premium');
  return [
    {
      id: 'cust-1', agent: 'customer', priority: 'high',
      title: lang === 'te' ? `${inactive.length} నిష్క్రియ కస్టమర్లు` : lang === 'hi' ? `${inactive.length} निष्क्रिय ग्राहक` : `${inactive.length} inactive customers`,
      message: lang === 'te'
        ? `${inactive.length} కస్టమర్లు 28+ రోజుల నుండి రాలేదు. వీరికి ప్రత్యేక ఆఫర్ పంపండి.`
        : lang === 'hi'
        ? `${inactive.length} ग्राहक 28+ दिनों से नहीं आए। उन्हें विशेष ऑफर भेजें।`
        : `${inactive.length} customers haven't visited in 28+ days. Send them a special offer to reactivate.`,
      action: lang === 'te' ? 'ఆఫర్ పంపండి' : lang === 'hi' ? 'ऑफर भेजें' : 'Send Offer',
    },
    {
      id: 'cust-2', agent: 'customer', priority: 'medium',
      title: lang === 'te' ? `${premium.length} ప్రీమియం కస్టమర్లు` : lang === 'hi' ? `${premium.length} प्रीमियम ग्राहक` : `${premium.length} premium customers`,
      message: lang === 'te'
        ? `మీకు ${premium.length} ప్రీమియం కస్టమర్లు ఉన్నారు. వఫాదారీ బహుమతులు ఇవ్వడం వలన 30% తిరిగిరాక పెరుగుతుంది.`
        : lang === 'hi'
        ? `आपके ${premium.length} प्रीमियम ग्राहक हैं। वफादारी पुरस्कार देने से 30% वापसी दर बढ़ती है।`
        : `You have ${premium.length} premium customers. Loyalty rewards can increase return rate by 30%.`,
      action: lang === 'te' ? 'బహుమతి పంపండి' : lang === 'hi' ? 'पुरस्कार भेजें' : 'Send Reward',
    },
  ];
}

// Supplier AI Agent
export function supplierAgentInsights(lang: LangCode): AIInsight[] {
  const cheapest = [...suppliers].sort((a, b) => a.priceIndex - b.priceIndex)[0];
  const best = [...suppliers].sort((a, b) => b.rating - a.rating)[0];
  return [
    {
      id: 'sup-1', agent: 'supplier', priority: 'medium',
      title: lang === 'te' ? `అత్యంత సస్త: ${cheapest.name}` : lang === 'hi' ? `सबसे सस्ता: ${cheapest.name}` : `Cheapest: ${cheapest.name}`,
      message: lang === 'te'
        ? `${cheapest.name} ధర సూచిక ${cheapest.priceIndex}. రేటింగ్ ${cheapest.rating}. ${cheapest.deliveryDays} రోజుల డెలివరీ.`
        : lang === 'hi'
        ? `${cheapest.name} मूल्य सूचकांक ${cheapest.priceIndex}। रेटिंग ${cheapest.rating}। ${cheapest.deliveryDays} दिन डिलीवरी।`
        : `${cheapest.name} price index ${cheapest.priceIndex}. Rating ${cheapest.rating}. ${cheapest.deliveryDays}-day delivery.`,
      action: lang === 'te' ? 'సంప్రదించండి' : lang === 'hi' ? 'संपर्क करें' : 'Contact',
    },
    {
      id: 'sup-2', agent: 'supplier', priority: 'low',
      title: lang === 'te' ? `ఉత్తమ: ${best.name}` : lang === 'hi' ? `सर्वश्रेष्ठ: ${best.name}` : `Best rated: ${best.name}`,
      message: lang === 'te'
        ? `${best.name} రేటింగ్ ${best.rating}. ${best.deliveryDays} రోజుల డెలివరీ. ధర సూచిక ${best.priceIndex}.`
        : lang === 'hi'
        ? `${best.name} रेटिंग ${best.rating}। ${best.deliveryDays} दिन डिलीवरी। मूल्य सूचकांक ${best.priceIndex}।`
        : `${best.name} rated ${best.rating}. ${best.deliveryDays}-day delivery. Price index ${best.priceIndex}.`,
      action: lang === 'te' ? 'సంప్రదించండి' : lang === 'hi' ? 'संपर्क करें' : 'Contact',
    },
  ];
}

// Business Advisor — the flagship agent
export function businessAdvisorResponse(question: string, lang: LangCode): string {
  const tomorrow = weatherForecast[1];
  const impact = weatherImpact[tomorrow.condition];
  const q = question.toLowerCase();

  if (q.includes('stock') || q.includes('కొనాలి') || q.includes('खरीद') || q.includes('రేపు') || q.includes('कल')) {
    if (lang === 'te') {
      return `రేపు ${tomorrow.condition === 'rainy' ? 'వర్షాలు' : tomorrow.condition === 'hot' ? 'ఎండ' : 'మార్పు'} అవకాశం ఉంది. ${impact.increase.slice(0, 3).join(', ')} అమ్మకాలు పెరిగే అవకాశం ఉంది. 50 ${impact.increase[0]} ప్యాకెట్లు మరియు 30 ${impact.increase[1]} ప్యాకెట్లు కొనుగోలు చేయడం మంచిది. మీ అంచనా లాభం ₹4,250.`;
    }
    if (lang === 'hi') {
      return `कल ${tomorrow.condition === 'rainy' ? 'बारिश' : tomorrow.condition === 'hot' ? 'गर्मी' : 'मौसम'} होने की संभावना है। ${impact.increase.slice(0, 3).join(', ')} की बिक्री बढ़ सकती है। 50 ${impact.increase[0]} और 30 ${impact.increase[1]} खरीदने की सलाह। अनुमानित लाभ ₹4,250।`;
    }
    return `Tomorrow will be ${tomorrow.condition}. ${impact.increase.slice(0, 3).join(', ')} sales are expected to increase. Purchasing 50 ${impact.increase[0]} packets and 30 ${impact.increase[1]} packets is recommended. Your projected profit for tomorrow is ₹4,250.`;
  }

  if (q.includes('profit') || q.includes('లాభ') || q.includes('लाभ')) {
    if (lang === 'te') return `ఈ నెల లాభం ₹46,000. గత నెల కంటే 14.8% ఎక్కువ. సరఫరాదారు ఖర్చులు తగ్గిస్తే ₹4,000 అదనపు లాభం సాధ్యం.`;
    if (lang === 'hi') return `इस माह का लाभ ₹46,000। पिछले माह से 14.8% अधिक। आपूर्तिकर्ता खर्च कम करने से ₹4,000 अतिरिक्त लाभ संभव।`;
    return `This month's profit is ₹46,000, up 14.8% from last month. Reducing supplier costs could add ₹4,000 more profit.`;
  }

  if (q.includes('weather') || q.includes('వాతావరణ') || q.includes('मौसम')) {
    if (lang === 'te') return `రేపటి వాతావరణం: ${tomorrow.temp}°C, తేమ ${tomorrow.humidity}%. ${impact.increase.join(', ')} అమ్మకాలు పెరుగుతాయి. ${impact.decrease.length > 0 ? impact.decrease.join(', ') + ' తగ్గవచ్చు.' : ''}`;
    if (lang === 'hi') return `कल का मौसम: ${tomorrow.temp}°C, नमी ${tomorrow.humidity}%। ${impact.increase.join(', ')} की बिक्री बढ़ेगी। ${impact.decrease.length > 0 ? impact.decrease.join(', ') + ' कम होगी।' : ''}`;
    return `Tomorrow's weather: ${tomorrow.temp}°C, humidity ${tomorrow.humidity}%. ${impact.increase.join(', ')} sales will increase. ${impact.decrease.length > 0 ? impact.decrease.join(', ') + ' may decrease.' : ''}`;
  }

  // Default
  if (lang === 'te') return `మీ వ్యాపారం బాగా సాగుతోంది. ఈ నెల ఆదాయం ₹1,24,000, లాభం ₹46,000. వృద్ధి 14.8%. స్టాక్, వాతావరణం, పండుగల గురించి ఏదైనా అడగండి.`;
  if (lang === 'hi') return `आपका व्यापार अच्छा चल रहा है। इस माह आय ₹1,24,000, लाभ ₹46,000। वृद्धि 14.8%। स्टॉक, मौसम, त्योहार के बारे में पूछें।`;
  return `Your business is performing well. This month's revenue ₹1,24,000, profit ₹46,000. Growth 14.8%. Ask me about stock, weather, or festivals.`;
}

export function allAgentInsights(lang: LangCode): AIInsight[] {
  return [
    ...inventoryAgentInsights(lang),
    ...financeAgentInsights(lang),
    ...weatherAgentInsights(lang),
    ...marketingAgentInsights(lang),
    ...customerAgentInsights(lang),
    ...supplierAgentInsights(lang),
  ];
}

// Autonomous workflow simulation
export function autonomousWorkflowSteps(lang: LangCode): { step: string; done: boolean }[] {
  const steps: Record<LangCode, string[]> = {
    en: ['Updating inventory', 'Fetching weather', 'Analyzing sales', 'Predicting profits', 'Recommending products', 'Generating offers', 'Creating promotions', 'Displaying insights'],
    hi: ['इन्वेंटरी अपडेट', 'मौसम लाना', 'बिक्री विश्लेषण', 'लाभ पूर्वानुमान', 'उत्पाद सुझाएं', 'ऑफर बनाना', 'प्रचार बनाना', 'जानकारी दिखाना'],
    te: ['ఇన్వెంటరీ అప్‌డేట్', 'వాతావరణం తీసుకోవడం', 'అమ్మకాల విశ్లేషణ', 'లాభాల అంచనా', 'ఉత్పత్తులు సిఫార్సు', 'ఆఫర్లు సృష్టించడం', 'ప్రచారాలు సృష్టించడం', 'అంతర్దృష్టులు చూపించడం'],
    ta: ['சரக்கு புதுப்பி', 'வானிலை பெறு', 'விற்பனை பகுப்பாய்வு', 'லாபம் கணி', 'தயாரிப்புகள் பரிந்துரை', 'சலுகைகள் உருவாக்கு', 'பிரச்சாரம் உருவாக்கு', 'நுண்ணறிவு காட்டு'],
    kn: ['ಇನ್ವೆಂಟರಿ ಅಪ್‌ಡೇಟ್', 'ಹವಾಮಾನ ಪಡೆಯಿರಿ', 'ಮಾರಾಟ ವಿಶ್ಲೇಷಣೆ', 'ಲಾಭ ಮುನ್ಸೂಚನೆ', 'ಉತ್ಪನ್ನಗಳ ಶಿಫಾರಸು', 'ಆಫರ್‌ಗಳು ರಚಿಸಿ', 'ಪ್ರಚಾರ ರಚಿಸಿ', 'ಒಳನೋಟಗಳು ತೋರಿಸಿ'],
    ml: ['ഇൻവെൻററി അപ്ഡേറ്റ്', 'കാലാവസ്ഥ എടുക്കുക', 'വിൽപ്പന വിശകലനം', 'ലാഭം പ്രവചനം', 'ഉൽപ്പന്നങ്ങൾ ശുപാർശ', 'ഓഫറുകൾ സൃഷ്ടിക്കുക', 'പ്രചാരണം സൃഷ്ടിക്കുക', 'വീക്ഷണങ്ങൾ കാണിക്കുക'],
    mr: ['इन्व्हेंटरी अपडेट', 'हवामान घ्या', 'विक्री विश्लेषण', 'नफा अंदाज', 'उत्पादने शिफारस', 'ऑफर तयार', 'प्रचार तयार', 'अंतर्दृष्टी दाखवा'],
    bn: ['ইনভেন্টরি আপডেট', 'আবহাওয়া আনুন', 'বিক্রি বিশ্লেষণ', 'মুনাফা পূর্বাভাস', 'পণ্য সুপারিশ', 'অফার তৈরি', 'প্রচার তৈরি', 'অন্তর্দৃষ্টি দেখান'],
    gu: ['ઇન્વેન્ટરી અપડેટ', 'હવામાન લાવો', 'વેચાણ વિશ્લેષણ', 'નફો આગાહી', 'ઉત્પાદનો ભલમણ', 'ઓફર બનાવો', 'પ્રચાર બનાવો', 'આંતરદૃષ્ટિ બતાવો'],
    pa: ['ਇਨਵੈਂਟਰੀ ਅੱਪਡੇਟ', 'ਮੌਸਮ ਲਵੋ', 'ਵਿਕਰੀ ਵਿਸ਼ਲੇਸ਼ਣ', 'ਮੁਨਾਫਾ ਅਨੁਮਾਨ', 'ਉਤਪਾਦ ਸਿਫਾਰਸ਼', 'ਆਫਰ ਬਣਾਓ', 'ਪ੍ਰਚਾਰ ਬਣਾਓ', 'ਸੂਝ ਦਿਖਾਓ'],
    ur: ['انوینٹری اپڈیٹ', 'موسم لائیں', 'فروخت تجزیہ', 'منافع پیش گوئی', 'مصنوعات تجویز', 'آفرز بنائیں', 'پروموشنز بنائیں', 'بصیرت دکھائیں'],
    or: ['ଇନଭେଣ୍ଟୋରୀ ଅପଡେଟ୍', 'ପାଣିପାଟି ଆଣନ୍ତୁ', 'ବିକ୍ରି ବିଶ୍ଳେଷଣ', 'ଲାଭ ପୂର୍ବାନୁମାନ', 'ଉତ୍ପାଦନ ସୁପାରିଶ', 'ଅଫର ସୃଷ୍ଟି', 'ପ୍ରଚାର ସୃଷ୍ଟି', 'ଅନ୍ତଃଦୃଷ୍ଟି ଦେଖାନ୍ତୁ'],
  };
  const list = steps[lang] || steps.en;
  return list.map((step) => ({ step, done: false }));
}

import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Mic, Volume2, Sparkles, Zap } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { businessAdvisorResponse, autonomousWorkflowSteps } from '../ai/agents';

interface ChatMsg {
  role: 'user' | 'ai';
  text: string;
  steps?: { step: string; done: boolean }[];
}

export function AdvisorView() {
  const { t, lang, currentInfo } = useLang();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const popularQuestions = [
    t('whatToStock'), t('whatNotSelling'), t('whatToAvoid'),
    t('maxProfitProducts'), t('expectedMonthlyRevenue'), t('increaseProfits'),
    t('festivalStock'), t('weatherAffect'),
  ];

  const handleSend = (q?: string) => {
    const question = q || input.trim();
    if (!question) return;
    setInput('');
    setRunning(true);

    const steps = autonomousWorkflowSteps(lang);
    setMessages((m) => [...m, { role: 'user', text: question }, { role: 'ai', text: '', steps }]);

    // Simulate autonomous workflow steps completing
    steps.forEach((_, i) => {
      setTimeout(() => {
        setMessages((m) => {
          const last = m[m.length - 1];
          if (last && last.steps) {
            const newSteps = [...last.steps];
            newSteps[i] = { ...newSteps[i], done: true };
            return [...m.slice(0, -1), { ...last, steps: newSteps }];
          }
          return m;
        });
      }, 300 * (i + 1));
    });

    // Final response
    setTimeout(() => {
      const response = businessAdvisorResponse(question, lang);
      setMessages((m) => [...m.slice(0, -1), { role: 'ai', text: response, steps: autonomousWorkflowSteps(lang).map((s) => ({ ...s, done: true })) }]);
      setRunning(false);
      speak(response);
    }, 300 * (steps.length + 1));
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = currentInfo.voice;
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: just focus input
      setInput('');
      return;
    }
    setListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = currentInfo.voice;
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white shadow-lg animate-slideUp">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Brain className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t('businessAdvisor')}</h2>
            <p className="text-sm opacity-90">{t('yourAiEmployee')} • {t('contextAware')}</p>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 animate-pulseSoft rounded-full bg-white" />
            <span className="text-xs font-semibold">{t('multilingualAI')}</span>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="card flex flex-col" style={{ height: 'calc(100vh - 320px)', minHeight: '400px' }}>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                <Sparkles className="h-8 w-8 text-brand-600" />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink-700">{t('askAnything')}</p>
              <p className="mt-1 text-xs text-ink-400">{t('popularQuestions')}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {popularQuestions.map((q) => (
                  <button key={q} onClick={() => handleSend(q)} className="rounded-xl border border-ink-100 px-3 py-2 text-left text-xs text-ink-600 transition-all hover:border-brand-200 hover:bg-brand-50/30">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-ink-50 text-ink-800'}`}>
                {msg.steps && !msg.text && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600">
                      <Zap className="h-3 w-3 animate-pulseSoft" /> {t('autonomousWorkflow')}
                    </div>
                    {msg.steps.map((s, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs">
                        <span className={`h-3.5 w-3.5 rounded-full ${s.done ? 'bg-brand-500' : 'bg-ink-200'} flex items-center justify-center`}>
                          {s.done && <Sparkles className="h-2 w-2 text-white" />}
                        </span>
                        <span className={s.done ? 'text-ink-700' : 'text-ink-400'}>{s.step}</span>
                      </div>
                    ))}
                  </div>
                )}
                {msg.text && <p className="text-sm">{msg.text}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-ink-100 p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={startListening}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${listening ? 'bg-rose-500 text-white animate-pulseSoft' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}
            >
              <Mic className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !running && handleSend()}
              placeholder={listening ? t('listening') : t('typeQuestion')}
              disabled={running}
              className="flex-1 rounded-xl border border-ink-200 bg-ink-50 px-4 py-2.5 text-sm text-ink-700 outline-none transition-all focus:border-brand-400 focus:bg-white disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={running || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:opacity-50"
            >
              <Send className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3 text-[10px] text-ink-400">
            <span className="flex items-center gap-1"><Mic className="h-3 w-3" /> {t('speechToText')}</span>
            <span className="flex items-center gap-1"><Volume2 className="h-3 w-3" /> {t('textToSpeech')}</span>
            <span className="flex items-center gap-1"><Brain className="h-3 w-3" /> {currentInfo.nativeName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Square, Send, Brain } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { businessAdvisorResponse } from '../ai/agents';


interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export function VoiceAssistantView() {
  const { t, lang, currentInfo } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting: Record<string, string> = {
      en: "Namaste! I'm your AI Business Advisor. Ask me about sales, stock, weather, or what to do next.",
      hi: "नमस्ते! मैं आपका एआई व्यापार सलाहकार हूं। बिक्री, स्टॉक, मौसम या अगला कदम पूछें।",
      te: "నమస్తే! నేను మీ ఏఐ వ్యాపార సలహాదారు. అమ్మకాలు, స్టాక్, వాతావరణం గురించి అడగండి.",
      ta: "வணக்கம்! நான் உங்கள் ஏஐ வணிக ஆலோசகர். விற்பனை, சரக்கு, வானிலை பற்றி கேளுங்கள்.",
    };
    setMessages([{ role: 'ai', text: greeting[lang] || greeting.en, timestamp: getTime() }]);
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentInfo.code === 'en' ? 'en-IN' : currentInfo.code;
    utter.rate = 0.95;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setInput('Voice input not supported in this browser. Please type.');
      return;
    }
    const rec = new SR();
    rec.lang = currentInfo.code === 'en' ? 'en-IN' : currentInfo.code;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text, timestamp: getTime() };
    const aiResponse = businessAdvisorResponse(text, lang);
    const aiMsg: ChatMessage = { role: 'ai', text: aiResponse, timestamp: getTime() };
    setMessages(m => [...m, userMsg, aiMsg]);
    setInput('');
    setTimeout(() => speak(aiResponse), 300);
  };

  const suggestions: Record<string, string[]> = {
    en: ['What should I stock tomorrow?', "What's my profit?", "How's the weather?"],
    hi: ['मुझे क्या खरीदना चाहिए?', 'मेरा लाभ कितना है?', 'मौसम कैसा है?'],
    te: ['రేపు ఏమి కొనాలి?', 'నా లాభం ఎంత?', 'వాతావరణం ఎలా ఉంది?'],
    ta: ['நாளை என்ன வாங்க வேண்டும்?', 'எனது லாபம் எவ்வளவு?', 'வானிலை எப்படி?'],
  };

  return (
    <div className="space-y-5">
      <div className="animate-slideUp">
        <h1 className="font-serif text-2xl font-bold text-ink">{t('voiceAssistant')}</h1>
        <p className="text-sm text-ink-soft mt-1">Speak naturally in {currentInfo.nativeName}. Your AI advisor replies in your language.</p>
      </div>

      <div className="card p-0 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-secondary">AI Advisor</span>
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-secondary text-white rounded-tr-sm'
                      : 'bg-primary-50 text-ink rounded-tl-sm border border-primary-100'
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`text-xs text-ink-faint mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>{msg.timestamp}</div>
                {msg.role === 'ai' && (
                  <button onClick={() => speak(msg.text)} className="flex items-center gap-1 text-xs text-secondary mt-1.5 hover:text-secondary-deep transition-colors">
                    <Volume2 className="w-3.5 h-3.5" />
                    {t('playResponse')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {speaking && (
          <div className="px-4 py-1.5 bg-sale-light/50 flex items-center gap-2 text-xs text-sale-deep">
            <Volume2 className="w-3.5 h-3.5 animate-pulseSoft" />
            Speaking...
          </div>
        )}

        <div className="border-t border-ink-100 p-3">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {(suggestions[lang] || suggestions.en).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="chip text-xs">
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`mic-btn w-12 h-12 flex items-center justify-center flex-shrink-0 ${recording ? 'recording' : ''}`}
            >
              {recording ? <Square className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder={recording ? 'Listening...' : 'Type or speak your question...'}
              className="flex-1 rounded-xl border border-ink-200 bg-paper-card px-4 py-3 text-sm text-ink outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
            <button onClick={() => sendMessage(input)} className="btn-primary px-4 py-3">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

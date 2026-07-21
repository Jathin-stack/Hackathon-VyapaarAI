import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Mic, TrendingUp, Users, Cloud, Sparkles, ArrowRight,
  CheckCircle2, Package, Brain, Zap, Globe, BarChart3, Wallet,
} from 'lucide-react';
import heroShopkeeper from '@/assets/hero-shopkeeper.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: Mic, title: 'Voice-First Logging', desc: 'Speak in Hindi, Tamil, Telugu or any Indian language. Say "500 rupaye ki chai bechi" and it logs instantly.', color: 'sale' },
    { icon: Brain, title: 'AI Business Advisor', desc: 'Ask any question about your business. Get instant insights, forecasts, and recommendations in your language.', color: 'secondary' },
    { icon: Cloud, title: 'Weather Intelligence', desc: '7-day forecasts that tell you exactly what to stock. Rain coming? Stock umbrellas and chai.', color: 'inventory' },
    { icon: Users, title: 'Customer Insights', desc: "Know your top customers, their buying patterns, and who hasn't visited in a while.", color: 'purchase' },
    { icon: Package, title: 'Smart Inventory', desc: 'Auto-reorder alerts, stock movement analysis, and expiry tracking — all automated.', color: 'credit' },
    { icon: TrendingUp, title: 'Predictive Analytics', desc: 'Festival-aware demand forecasting. Know what will sell before it happens.', color: 'sale' },
  ];

  const languages = ['हिन्दी', 'English', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'मराठी', 'বাংলা', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'اردو', 'ଓଡ଼ିଆ'];

  const bigStats = [
    { value: '10,000+', label: 'Stores Active' },
    { value: '₹500Cr+', label: 'Transactions Processed' },
    { value: '98%', label: 'Udhaar Recovered' },
    { value: '2M+', label: 'Products Tracked' },
  ];

  // Floating overlay cards for hero image
  const float = (delay = 0, y = 8): any => ({
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: {
      opacity: 1,
      y: [0, -y, 0],
      scale: 1,
      transition: {
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: { duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' as const, delay: delay + 0.6 },
      },
    },
  });

  return (
    <div className="min-h-screen bg-paper kirana-bg">
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/90 backdrop-blur-md shadow-card' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <span className="font-serif text-white text-xl font-bold leading-none">v</span>
            </div>
            <span className="font-serif text-xl font-bold text-ink">
              Vyapaar<span className="text-primary-deep">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink-700">
            <a href="#features" className="hover:text-secondary transition-colors">Features</a>
            <a href="#how" className="hover:text-secondary transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-secondary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-secondary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onSignIn} className="text-sm font-semibold text-ink-700 hover:text-secondary transition-colors">
              Login
            </button>
            <button onClick={onGetStarted} className="btn-primary text-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — two column */}
      <section className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="marigold-blur marigold-tl" />
        <div className="marigold-blur marigold-br" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200/70 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-deep" />
              <span className="text-xs font-semibold text-primary-deep tracking-wide">Built for Indian Shopkeepers</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[68px] font-bold text-ink leading-[1.05]">
              The{' '}
              <span className="bg-gradient-to-r from-primary via-primary-deep to-secondary bg-clip-text text-transparent">
                Bahi Khata
              </span>
              <br />
              of the Future
            </h1>
            <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
              VyapaarAI is the intelligent operating system for your Kirana store.
              Speak to log sales, track udhaar automatically, and get AI insights to
              grow your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button onClick={onGetStarted} className="btn-primary px-6 py-3.5 text-base">
                Start Your Digital Dukaan
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onSignIn}
                className="px-7 py-3.5 text-base font-semibold text-ink bg-paper-card border border-ink-200 rounded-xl hover:bg-white transition-colors shadow-card"
              >
                View Demo
              </button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sale" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sale" /> Voice enabled</span>
            </div>
          </motion.div>

          {/* Right — image + floating dashboard overlays */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-hero border border-ink-200/40 aspect-[5/4] bg-ink">
              <img
                src={heroShopkeeper}
                alt="Indian kirana shopkeeper welcoming"
                className="w-full h-full object-cover"
                width={1280}
                height={960}
              />
              {/* Warm color overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3A1F0A]/40 via-transparent to-[#F5A623]/10 pointer-events-none" />

              {/* Overlay: Daily Sales */}
              <motion.div
                {...float(0.2, 6)}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 w-[42%] max-w-[240px] rounded-xl backdrop-blur-md bg-black/40 border border-primary/40 p-3 text-white shadow-glow"
              >
                <div className="text-[9px] font-semibold uppercase tracking-widest text-primary-100">Daily Sales Overview</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] text-white/70">Total Sales</div>
                    <div className="font-serif text-lg font-bold text-primary-100">₹ 24,530</div>
                  </div>
                  <div className="text-[10px] font-semibold text-sale-light bg-sale/30 px-1.5 py-0.5 rounded">+15%</div>
                </div>
                <svg viewBox="0 0 100 24" className="mt-1.5 w-full h-6">
                  <path d="M0,20 L15,15 L30,17 L45,10 L60,12 L75,6 L90,8 L100,4" fill="none" stroke="#F9C44F" strokeWidth="1.5" />
                </svg>
              </motion.div>

              {/* Overlay: Top Products */}
              <motion.div
                {...float(0.4, 5)}
                className="absolute top-4 right-4 sm:top-6 sm:right-24 w-[36%] max-w-[200px] rounded-xl backdrop-blur-md bg-black/40 border border-primary/40 p-3 text-white shadow-glow"
              >
                <div className="text-[9px] font-semibold uppercase tracking-widest text-primary-100">Top Products</div>
                <ul className="mt-1.5 space-y-0.5 text-[10px]">
                  {['Toor Dal', 'Basmati Rice', 'Mustard Oil', 'Wheat Flour', 'Sugar'].map((p) => (
                    <li key={p} className="flex justify-between text-white/85">
                      <span>{p}</span><span className="text-white/60">•</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Overlay: Voice Entry */}
              <motion.div
                {...float(0.3, 8)}
                className="absolute top-8 right-4 sm:top-10 sm:right-6 w-[44%] max-w-[230px] rounded-xl backdrop-blur-md bg-black/50 border border-primary/60 p-3 text-white shadow-glow flex items-center gap-2.5"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute inset-0 rounded-full border-2 border-primary/60 animate-pulseSoft" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-semibold uppercase tracking-widest text-primary-100">Voice Entry</div>
                  <div className="text-[11px] font-semibold truncate">"Ramesh ko 500 ka udhaar"</div>
                </div>
              </motion.div>

              {/* Overlay: Customer Insights */}
              <motion.div
                {...float(0.5, 6)}
                className="absolute top-1/2 left-4 sm:left-6 -translate-y-1/2 w-[42%] max-w-[220px] rounded-xl backdrop-blur-md bg-black/40 border border-primary/40 p-3 text-white shadow-glow"
              >
                <div className="text-[9px] font-semibold uppercase tracking-widest text-primary-100 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Customer Insights
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1 text-[10px]">
                  <div>
                    <div className="text-white/70">Total</div>
                    <div className="font-serif text-sm font-bold">1,124</div>
                  </div>
                  <div>
                    <div className="text-white/70">Returning</div>
                    <div className="font-serif text-sm font-bold text-sale-light">68%</div>
                  </div>
                </div>
              </motion.div>

              {/* Overlay: Payment Summary */}
              <motion.div
                {...float(0.6, 7)}
                className="absolute top-[45%] right-4 sm:right-6 w-[36%] max-w-[210px] rounded-xl backdrop-blur-md bg-black/40 border border-primary/40 p-3 text-white shadow-glow"
              >
                <div className="text-[9px] font-semibold uppercase tracking-widest text-primary-100 flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> Payment Summary
                </div>
                <ul className="mt-1.5 space-y-0.5 text-[10px]">
                  <li className="flex justify-between"><span className="text-white/70">Cash</span><span className="font-mono">₹12,660</span></li>
                  <li className="flex justify-between"><span className="text-white/70">UPI</span><span className="font-mono">₹ 8,320</span></li>
                  <li className="flex justify-between"><span className="text-white/70">Card</span><span className="font-mono">₹ 3,560</span></li>
                </ul>
              </motion.div>

              {/* Overlay: Weekly Sales */}
              <motion.div
                {...float(0.7, 6)}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-[36%] max-w-[210px] rounded-xl backdrop-blur-md bg-black/40 border border-primary/40 p-3 text-white shadow-glow"
              >
                <div className="text-[9px] font-semibold uppercase tracking-widest text-primary-100 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> Weekly Sales
                </div>
                <div className="mt-1.5 flex items-end justify-between h-8 gap-0.5">
                  {[40, 60, 45, 75, 55, 82, 65].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-primary-deep to-primary rounded-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </motion.div>

              {/* Overlay: Today's Sales big card */}
              <motion.div
                {...float(0.8, 8)}
                className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-[44%] max-w-[220px] rounded-xl backdrop-blur-md bg-black/50 border border-primary/50 p-3.5 text-white shadow-glow"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-white/70">Today's Sales</div>
                <div className="mt-1 font-serif text-2xl font-bold text-primary-100">₹ 14,520</div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-sale-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-sale" /> +12% from yesterday
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Big stats bar */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 border-y border-ink-200/40 bg-paper-card/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {bigStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="mt-1 text-sm font-medium text-ink-soft">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
              <span className="label"><Sparkles className="w-4 h-4" /> Features</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink">Everything your store needs</h2>
            <p className="mt-3 text-ink-soft text-lg">Six AI agents working autonomously, 24/7, in your language.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card card-hover p-6 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: f.color === 'sale' ? '#E8F4EC' : f.color === 'secondary' ? '#FFF3EE' : f.color === 'inventory' ? '#E5F0F7' : f.color === 'purchase' ? '#F1E9F8' : '#FDECC5',
                  }}>
                  <f.icon className="w-6 h-6"
                    style={{ color: f.color === 'sale' ? '#22683F' : f.color === 'secondary' ? '#C1440E' : f.color === 'inventory' ? '#315C7B' : f.color === 'purchase' ? '#5A3778' : '#C9760F' }}
                    strokeWidth={2} />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-transparent to-primary-50/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
              <span className="label"><Zap className="w-4 h-4" /> How it Works</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-ink">From voice to insight in 3 steps</h2>
          </div>
          <div className="space-y-6">
            {[
              { n: '01', icon: Mic, title: 'Speak naturally', desc: 'Just talk. "Aaj 2000 ki sabzi bechi, 500 ka udhaar diya." VyapaarAI understands Hindi, English, Tamil, Telugu and 8 more languages.' },
              { n: '02', icon: Brain, title: 'AI processes everything', desc: 'Six AI agents analyze your sales, inventory, customers, weather, and festivals — automatically, in real time.' },
              { n: '03', icon: TrendingUp, title: 'Get smart recommendations', desc: 'Tomorrow will rain — stock umbrellas. Diwali is coming — order sweets. Your AI advisor tells you what to do, in your language.' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-6 flex gap-5 items-start"
              >
                <div className="font-serif text-4xl font-bold text-primary-deep flex-shrink-0">{step.n}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon className="w-5 h-5 text-secondary" />
                    <h3 className="font-serif text-xl font-bold text-ink">{step.title}</h3>
                  </div>
                  <p className="text-sm text-ink-soft leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
            <span className="label"><Globe className="w-4 h-4" /> Multilingual</span>
          </div>
          <h2 className="font-serif text-4xl font-bold text-ink">Speaks your language</h2>
          <p className="mt-3 text-ink-soft text-lg">12 Indian languages. One app. Fully synced.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {languages.map((lang, i) => (
              <span key={i} className="chip text-base px-5 py-2.5 animate-slideUp" style={{ animationDelay: `${i * 0.04}s` }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="hero-card p-10 sm:p-14 text-center text-white">
            <div className="relative z-10">
              <Store className="w-12 h-12 mx-auto mb-4 text-white/90" />
              <h2 className="font-serif text-4xl font-bold mb-3">Ready to grow your kirana?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of shop owners using VyapaarAI to save time, increase sales, and make smarter decisions.
              </p>
              <button onClick={onGetStarted} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-secondary font-bold rounded-xl text-base hover:bg-paper-card transition-colors shadow-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="faq" className="px-4 sm:px-6 lg:px-8 py-10 border-t border-ink-200/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-serif text-white text-sm font-bold leading-none">v</span>
            </div>
            <span className="font-serif text-lg font-bold text-ink">VyapaarAI</span>
          </div>
          <p className="text-sm text-ink-faint">Made in India, for India's micro-merchants.</p>
        </div>
      </footer>
    </div>
  );
}

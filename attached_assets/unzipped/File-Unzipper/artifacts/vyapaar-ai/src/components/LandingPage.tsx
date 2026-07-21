import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Store, Mic, TrendingUp, Users, Sparkles, ArrowRight,
  CheckCircle2, Package, Brain, Zap, Globe, BarChart3, Wallet, Star, Cloud,
} from 'lucide-react';
import heroShopkeeper from '@/assets/hero-shopkeeper.jpg';
import productScreenshot from '@/assets/hero-shopkeeper-new.png';

/* ─── Counter hook ─────────────────────────────────────────── */
function useCountUp(target: number, duration = 1.5, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

/* ─── Typewriter hook ──────────────────────────────────────── */
function useTypewriter(text: string, delay = 0.5) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const t = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, 50);
      return () => clearInterval(id);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [text, delay]);
  return displayed;
}

/* ─── Animated floating card wrapper ──────────────────────── */
function FloatCard({
  delay, floatY = 7, className, children,
}: { delay: number; floatY?: number; className: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.88 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -floatY, 0],
        transition: {
          opacity: { duration: 0.5, delay },
          scale: { duration: 0.5, delay },
          y: { duration: 4 + delay * 0.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated hero dashboard ──────────────────────────────── */
function HeroDashboard() {
  const sales = useCountUp(24530, 1.8, 0.4);
  const todaySales = useCountUp(14520, 1.6, 0.7);
  const customers = useCountUp(1124, 1.4, 0.9);
  const returning = useCountUp(68, 1.2, 1.0);
  const voiceText = useTypewriter('"Ramesh ko 500 ka udhaar"', 0.8);
  const bars = [40, 60, 45, 75, 55, 82, 65];

  return (
    <div className="relative rounded-[28px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(20,10,0,0.55)] border border-white/10 aspect-[5/4]">
      {/* Base image */}
      <img
        src={heroShopkeeper}
        alt="VyapaarAI kirana shopkeeper with AI dashboard"
        className="w-full h-full object-cover object-center"
      />
      {/* Subtle darkening overlay so our cards pop */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-black/25 pointer-events-none" />

      {/* ── Card 1: Daily Sales Overview (top-left) ── */}
      <FloatCard delay={0.3} floatY={6}
        className="absolute top-[6%] left-[3%] w-[40%] max-w-[210px] rounded-xl backdrop-blur-md bg-black/50 border border-[#F5A623]/40 p-2.5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="text-[8px] font-bold uppercase tracking-widest text-[#F5A623]/90 mb-1">Daily Sales Overview</div>
        <div className="flex items-baseline justify-between mb-0.5">
          <div>
            <div className="text-[9px] text-white/60">Total Sales</div>
            <div className="font-serif text-base font-bold text-[#F9C44F] leading-none">
              ₹ {sales.toLocaleString('en-IN')}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="text-[9px] font-bold text-emerald-300 bg-emerald-500/25 px-1.5 py-0.5 rounded"
          >+15%</motion.div>
        </div>
        {/* Animated chart line */}
        <svg viewBox="0 0 100 22" className="w-full h-5 mt-1">
          <motion.path
            d="M0,18 L12,14 L25,16 L38,9 L52,11 L66,5 L80,7 L100,2"
            fill="none" stroke="#F9C44F" strokeWidth="1.5" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.9 }}
          />
          <motion.path
            d="M0,18 L12,14 L25,16 L38,9 L52,11 L66,5 L80,7 L100,2 L100,22 L0,22 Z"
            fill="url(#chartGrad)" opacity="0.25"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.25 }}
            transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.9 }}
          />
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F9C44F" />
              <stop offset="100%" stopColor="#F9C44F" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </FloatCard>

      {/* ── Card 2: Top Products (top-center) ── */}
      <FloatCard delay={0.5} floatY={5}
        className="absolute top-[6%] left-[46%] w-[29%] max-w-[160px] rounded-xl backdrop-blur-md bg-black/50 border border-[#F5A623]/35 p-2.5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="text-[8px] font-bold uppercase tracking-widest text-[#F5A623]/90 mb-1.5">Top Products</div>
        {['Toor Dal', 'Basmati Rice', 'Mustard Oil', 'Wheat Flour', 'Sugar'].map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            className="flex items-center justify-between text-[9px] text-white/80 py-0.5"
          >
            <span>{p}</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${60 - i * 10}%` }}
              transition={{ delay: 1.0 + i * 0.1, duration: 0.4 }}
              className="h-0.5 bg-gradient-to-r from-[#F5A623]/70 to-[#F5A623]/20 rounded ml-1"
            />
          </motion.div>
        ))}
      </FloatCard>

      {/* ── Card 3: Voice Entry (top-right) ── */}
      <FloatCard delay={0.45} floatY={8}
        className="absolute top-[6%] right-[3%] w-[40%] max-w-[200px] rounded-xl backdrop-blur-md bg-black/55 border border-[#F5A623]/50 p-2.5 text-white shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex items-start gap-2"
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#C1440E] flex items-center justify-center shadow-[0_0_12px_rgba(245,166,35,0.6)]">
            <Mic className="w-3.5 h-3.5 text-white" />
          </div>
          {/* Pulse rings */}
          <motion.span
            animate={{ scale: [1, 1.7, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-[#F5A623]/70"
          />
          <motion.span
            animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
            className="absolute inset-0 rounded-full border border-[#F5A623]/40"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[8px] font-bold uppercase tracking-widest text-[#F5A623]/80 mb-0.5">Voice Entry</div>
          <div className="text-[10px] font-semibold text-white leading-snug min-h-[30px]">
            {voiceText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              className="inline-block w-0.5 h-3 bg-[#F9C44F] ml-0.5 align-middle"
            />
          </div>
        </div>
      </FloatCard>

      {/* ── Card 4: Customer Insights (middle-left) ── */}
      <FloatCard delay={0.7} floatY={6}
        className="absolute top-[48%] left-[3%] w-[36%] max-w-[190px] rounded-xl backdrop-blur-md bg-black/50 border border-[#F5A623]/35 p-2.5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="text-[8px] font-bold uppercase tracking-widest text-[#F5A623]/90 flex items-center gap-1 mb-1.5">
          <Users className="w-2.5 h-2.5" /> Customer Insights
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <div className="text-[8px] text-white/60">Total Customers</div>
            <div className="font-serif text-sm font-bold text-white leading-tight">
              {customers.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-white/60">Returning</div>
            <div className="font-serif text-sm font-bold text-emerald-300 leading-tight">
              {returning}%
            </div>
          </div>
        </div>
        {/* Mini donut ring */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <svg viewBox="0 0 28 28" className="w-7 h-7 flex-shrink-0">
            <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
            <motion.circle
              cx="14" cy="14" r="10" fill="none"
              stroke="#6ee7b7" strokeWidth="4" strokeLinecap="round"
              strokeDasharray="62.8"
              initial={{ strokeDashoffset: 62.8 }}
              animate={{ strokeDashoffset: 62.8 * (1 - 0.68) }}
              transition={{ duration: 1.2, delay: 1.3, ease: 'easeOut' }}
              style={{ transformOrigin: '14px 14px', rotate: '-90deg' }}
              transform="rotate(-90 14 14)"
            />
          </svg>
          <span className="text-[8px] text-white/60">68% return rate</span>
        </div>
      </FloatCard>

      {/* ── Card 5: Payment Summary (middle-right) ── */}
      <FloatCard delay={0.8} floatY={7}
        className="absolute top-[45%] right-[3%] w-[36%] max-w-[190px] rounded-xl backdrop-blur-md bg-black/50 border border-[#F5A623]/35 p-2.5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="text-[8px] font-bold uppercase tracking-widest text-[#F5A623]/90 flex items-center gap-1 mb-1.5">
          <Wallet className="w-2.5 h-2.5" /> Payment Summary
        </div>
        {[
          { label: 'Cash', value: 12660, color: '#6ee7b7' },
          { label: 'UPI', value: 8320, color: '#93c5fd' },
          { label: 'Card', value: 3560, color: '#fbbf24' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 + i * 0.12, duration: 0.35 }}
            className="flex justify-between items-center text-[9px] py-0.5"
          >
            <span className="text-white/65">{item.label}</span>
            <span className="font-mono font-semibold" style={{ color: item.color }}>
              ₹{item.value.toLocaleString('en-IN')}
            </span>
          </motion.div>
        ))}
        {/* Bar breakdown */}
        <div className="mt-1.5 flex gap-0.5 h-1 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '52%' }} transition={{ delay: 1.5, duration: 0.6 }} className="bg-emerald-400 h-full" />
          <motion.div initial={{ width: 0 }} animate={{ width: '33%' }} transition={{ delay: 1.6, duration: 0.5 }} className="bg-blue-400 h-full" />
          <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ delay: 1.7, duration: 0.4 }} className="bg-amber-400 h-full" />
        </div>
      </FloatCard>

      {/* ── Card 6: Weekly Sales bar chart (bottom-right) ── */}
      <FloatCard delay={0.9} floatY={6}
        className="absolute bottom-[5%] right-[3%] w-[36%] max-w-[190px] rounded-xl backdrop-blur-md bg-black/50 border border-[#F5A623]/35 p-2.5 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="text-[8px] font-bold uppercase tracking-widest text-[#F5A623]/90 flex items-center gap-1 mb-1.5">
          <BarChart3 className="w-2.5 h-2.5" /> Weekly Sales
        </div>
        <div className="flex items-end justify-between h-10 gap-0.5">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-[2px] bg-gradient-to-t from-[#C1440E] to-[#F5A623]"
              style={{ originY: 1 }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.09, duration: 0.45, ease: 'easeOut' }}
            >
              <div style={{ height: `${h}%` }} className="w-full rounded-[2px]" />
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="flex-1 text-center text-[7px] text-white/40">{d}</span>
          ))}
        </div>
      </FloatCard>

      {/* ── Card 7: Today's Sales (bottom-left, prominent white card) ── */}
      <FloatCard delay={1.0} floatY={9}
        className="absolute bottom-[5%] left-[3%] w-[42%] max-w-[210px] rounded-xl backdrop-blur-sm bg-white/95 border border-white/60 p-3 shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
      >
        <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Today's Sales</div>
        <div className="font-serif text-xl font-bold text-gray-900 leading-tight">
          ₹ {todaySales.toLocaleString('en-IN')}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[9px] font-bold text-emerald-600">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"
          />
          +12% from yesterday
        </div>
        {/* Sparkline */}
        <svg viewBox="0 0 80 16" className="w-full h-3.5 mt-1.5">
          <motion.path
            d="M0,12 L10,10 L20,11 L30,7 L40,8 L52,4 L64,5 L80,2"
            fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 1.4 }}
          />
        </svg>
      </FloatCard>

      {/* Live badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, type: 'spring' }}
        className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2 py-1"
      >
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        />
        <span className="text-[8px] font-semibold text-white/80 uppercase tracking-wider">Live</span>
      </motion.div>
    </div>
  );
}

/* ─── Main LandingPage ─────────────────────────────────────── */
interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const springY = useSpring(heroY, { stiffness: 80, damping: 20 });

  const rotatingWords = ['Bahi Khata', 'AI Advisor', 'Dukaan OS'];
  useEffect(() => {
    const id = setInterval(() => setActiveWord(w => (w + 1) % rotatingWords.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: Mic, title: 'Voice-First Bahi Khata', desc: 'Speak in Hindi, Tamil, Telugu or any Indian language. Say "500 rupaye ki chai bechi" and it logs instantly.', color: 'sale' },
    { icon: Brain, title: 'Smart Udhaar Tracking', desc: 'Track who owes what, send automated reminders, and recover more money with less awkwardness.', color: 'secondary' },
    { icon: Cloud, title: 'AI Business Insights', desc: '7-day forecasts that tell you exactly what to stock. Rain coming? Stock umbrellas and chai.', color: 'inventory' },
    { icon: Users, title: 'Inventory Management', desc: "Know your top customers, their buying patterns, and who hasn't visited in a while.", color: 'purchase' },
    { icon: Package, title: 'WhatsApp Integration', desc: 'Auto-reorder alerts, stock movement analysis, and expiry tracking — all automated.', color: 'credit' },
    { icon: TrendingUp, title: 'Daily P&L Reports', desc: 'Festival-aware demand forecasting. Know what will sell before it happens.', color: 'sale' },
  ];

  const languages = ['हिन्दी', 'English', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'മലയാളം', 'मराठी', 'বাংলা', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'اردو', 'ଓଡ଼ିଆ'];

  const bigStats = [
    { value: '10,000+', label: 'Stores Active' },
    { value: '₹500Cr+', label: 'Transactions Processed' },
    { value: '98%', label: 'Udhaar Recovered' },
    { value: '2M+', label: 'Products Tracked' },
  ];

  const testimonials = [
    { name: 'Ramesh Kumar', store: 'Ramesh Kirana, Delhi', text: 'Pehle haath se sab likhta tha. Ab VyapaarAI sab kar leta hai. Mera time bachta hai aur paisa bhi!', rating: 5 },
    { name: 'Anita Goswami', store: 'Anita General Store, Mumbai', text: 'The udhaar collection improved by 40%. The WhatsApp reminder feature is brilliant and professional.', rating: 5 },
    { name: 'Abdul Rahman', store: 'Rahman Stores, Hyderabad', text: 'Inventory tracking improved by 60%. Now I know exactly what to order and when. Best app for kiranas.', rating: 5 },
  ];

  const pricingPlans = [
    {
      name: 'Basic Dukaan', price: '₹0', period: '/month', badge: '',
      desc: 'Perfect for small shops getting started.',
      features: ['Voice Bahi Khata (50 entries/day)', 'Basic Udhaar Tracking', 'WhatsApp reminders', 'Up to 50 inventory items'],
      cta: 'Start Free', primary: false,
    },
    {
      name: 'Smart Seth-ji', price: '₹499', period: '/month', badge: 'Most Popular',
      desc: 'Everything you need to scale your business.',
      features: ['Unlimited Voice Bahi Khata', 'Advanced Udhaar with Auto-reminders', 'AI Business Insights & Stock Alerts', 'Unlimited Inventory Tracking', 'P&L Billing feature'],
      cta: 'Upgrade to Smart', primary: true,
    },
  ];

  const faqs = [
    { q: 'Does it understand mixed Hindi and English?', a: 'Yes! VyapaarAI understands Hinglish — mix Hindi and English naturally when speaking.' },
    { q: 'Is my business data safe?', a: 'Your data is encrypted and stored securely. Only you can access your store information.' },
    { q: 'Do I need an internet connection to use it?', a: 'Basic voice logging works offline. AI insights and sync require internet.' },
    { q: 'Can my staff use it on their phones?', a: 'Yes, invite up to 3 staff members on the Smart Seth-ji plan.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-paper kirana-bg overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/90 backdrop-blur-md shadow-card' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow cursor-pointer">
              <span className="font-serif text-white text-xl font-bold leading-none">v</span>
            </motion.div>
            <span className="font-serif text-xl font-bold text-ink">Vyapaar<span className="text-primary-deep">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink-700">
            {['Features', 'How it Works', 'Pricing', 'FAQ'].map((item, i) => (
              <motion.a key={item} href={`#${item.toLowerCase().replace(/ /g, '')}`}
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="hover:text-secondary transition-colors">{item}</motion.a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={onSignIn} className="text-sm font-semibold text-ink-700 hover:text-secondary transition-colors">Login</motion.button>
            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 8px 20px -6px rgba(193,68,14,0.55)' }}
              whileTap={{ scale: 0.97 }} onClick={onGetStarted} className="btn-primary text-sm">Get Started</motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[92vh] flex items-center">
        <div className="marigold-blur marigold-tl" />
        <div className="marigold-blur marigold-br" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#2A1F14 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center relative w-full">
          {/* Left copy */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200/70 mb-7">
              <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary-deep" />
              <span className="text-xs font-semibold text-primary-deep tracking-wide">Built for Indian Shopkeepers</span>
            </motion.div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[66px] font-bold text-ink leading-[1.05]">
              <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }} className="block">
                The{' '}
                <span className="relative inline-block">
                  <AnimatePresence mode="wait">
                    <motion.span key={activeWord}
                      initial={{ opacity: 0, y: 20, rotateX: -30 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: 30 }}
                      transition={{ duration: 0.45 }}
                      className="bg-gradient-to-r from-primary via-primary-deep to-secondary bg-clip-text text-transparent inline-block">
                      {rotatingWords[activeWord]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }} className="block">of the Future</motion.span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
              VyapaarAI is the intelligent operating system for your Kirana store.
              Speak to log sales, track udhaar automatically, and get AI insights to grow your business.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <motion.button whileHover={{ scale: 1.04, boxShadow: '0 12px 28px -8px rgba(193,68,14,0.5)' }}
                whileTap={{ scale: 0.97 }} onClick={onGetStarted}
                className="btn-primary px-6 py-3.5 text-base relative overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Digital Dukaan
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
                <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.04, backgroundColor: '#fff' }} whileTap={{ scale: 0.97 }}
                onClick={onSignIn}
                className="px-7 py-3.5 text-base font-semibold text-ink bg-paper-card border border-ink-200 rounded-xl transition-colors shadow-card">
                View Demo
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              className="mt-6 flex items-center gap-6 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sale" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-sale" /> Voice enabled</span>
            </motion.div>
          </motion.div>

          {/* Right — animated dashboard */}
          <motion.div style={{ y: springY, opacity: heroOpacity }}
            initial={{ opacity: 0, x: 40, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative">
            {/* Ambient glow */}
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-primary/25 via-secondary/15 to-transparent blur-3xl pointer-events-none" />
            <HeroDashboard />
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 border-y border-ink-200/40 bg-paper-card/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {bigStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <div className="font-serif text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-ink-soft">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Product screenshot showcase */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <span className="text-sm font-semibold text-ink-soft uppercase tracking-widest">See it in action</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-2">Your store, beautifully managed</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent blur-3xl pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(42,31,20,0.22)] border border-ink-100/60">
              <div className="flex items-center gap-2 px-4 py-3 bg-ink-100/40 border-b border-ink-100/60 backdrop-blur-sm">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                <div className="flex-1 mx-4">
                  <div className="max-w-xs mx-auto bg-white/60 rounded-md px-3 py-1 text-xs text-ink-soft text-center border border-ink-100/50">vyapaarai.app</div>
                </div>
              </div>
              <img src={productScreenshot} alt="VyapaarAI dashboard" className="w-full block" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
              <span className="label"><Sparkles className="w-4 h-4" /> Features</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink">Everything your store needs</h2>
            <p className="mt-3 text-ink-soft text-lg">Six AI agents working autonomously, 24/7, in your language.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6, boxShadow: '0 12px 32px -8px rgba(42,31,20,0.14)' }}
                className="card p-6 group cursor-default transition-all duration-300">
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.color === 'sale' ? '#E8F4EC' : f.color === 'secondary' ? '#FFF3EE' : f.color === 'inventory' ? '#E5F0F7' : f.color === 'purchase' ? '#F1E9F8' : '#FDECC5' }}>
                  <f.icon className="w-6 h-6"
                    style={{ color: f.color === 'sale' ? '#22683F' : f.color === 'secondary' ? '#C1440E' : f.color === 'inventory' ? '#315C7B' : f.color === 'purchase' ? '#5A3778' : '#C9760F' }}
                    strokeWidth={2} />
                </motion.div>
                <h3 className="font-serif text-xl font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="howitworks" className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-transparent to-primary-50/40">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10">
              <div className="section-divider mb-4" style={{ padding: 0 }}>
                <span className="label"><Zap className="w-4 h-4" /> How it Works</span>
              </div>
              <h2 className="font-serif text-4xl font-bold text-ink">As simple as talking to your customer</h2>
            </motion.div>
            <div className="space-y-6">
              {[
                { n: '01', icon: Mic, title: 'Tap the Mic', desc: 'Open the app and tap the floating button while serving a customer.' },
                { n: '02', icon: Brain, title: 'Speak naturally', desc: 'Say "Suresh bhai ko 600 uthaar gai" or "2 kilo atta udhaar." — it just works.' },
                { n: '03', icon: TrendingUp, title: 'AI does the rest', desc: 'It instantly detects the items, amount, and client, saving it perfectly.' },
              ].map((step, i) => (
                <motion.div key={step.n}
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="card p-5 flex gap-5 items-start">
                  <div className="font-serif text-4xl font-bold text-primary-deep flex-shrink-0 w-12 text-center">{step.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-5 h-5 text-secondary" />
                      <h3 className="font-serif text-lg font-bold text-ink">{step.title}</h3>
                    </div>
                    <p className="text-sm text-ink-soft leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
            <div className="card p-8 text-center w-full max-w-xs">
              <motion.div
                animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 0 0 rgba(245,166,35,0.4)', '0 0 0 18px rgba(245,166,35,0)', '0 0 0 0 rgba(245,166,35,0)'] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Mic className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink mb-2">
                "Ravi ke 300 ka udhaar"
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }} className="flex items-center justify-center gap-2 text-xs">
                <span className="tag tag-credit">Entry Saved</span>
                <span className="tag tag-inventory">Credit ₹300</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
              <span className="label"><Star className="w-4 h-4" /> Testimonials</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-ink">Trusted by 10,000+ Seth-jis</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="card p-6 transition-all duration-300">
                <div className="flex gap-0.5 mb-3">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <p className="text-sm text-ink-soft leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-ink text-sm">{t.name}</div>
                  <div className="text-xs text-ink-faint">{t.store}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section id="languages" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
            <span className="label"><Globe className="w-4 h-4" /> Multilingual</span>
          </div>
          <h2 className="font-serif text-4xl font-bold text-ink">Speaks your language</h2>
          <p className="mt-3 text-ink-soft text-lg">12 Indian languages. One app.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {languages.map((lang, i) => (
              <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.08 }}
                className="chip text-base px-5 py-2.5 cursor-default">{lang}</motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-transparent to-primary-50/30">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
              <span className="label"><Sparkles className="w-4 h-4" /> Pricing</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-ink">Simple, honest pricing</h2>
            <p className="mt-2 text-ink-soft">No hidden fees. Pay only when you grow.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className={`relative card p-7 transition-all duration-300 ${plan.primary ? 'border-primary/40 shadow-glow' : ''}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="btn-primary text-xs px-3 py-1 rounded-full">{plan.badge}</span>
                  </div>
                )}
                <h3 className="font-serif text-xl font-bold text-ink mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="font-serif text-4xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-soft">{plan.period}</span>
                </div>
                <p className="text-sm text-ink-soft mb-5">{plan.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink">
                      <CheckCircle2 className="w-4 h-4 text-sale mt-0.5 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.primary ? 'btn-primary' : 'border border-ink-200 bg-paper-card text-ink hover:bg-white'}`}>
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <div className="section-divider justify-center mb-4" style={{ padding: 0 }}>
              <span className="label">FAQ</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-ink">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="card overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-semibold text-ink text-sm">{faq.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}
                    className="text-ink-soft ml-3 flex-shrink-0">▾</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div key="ans"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-ink-soft leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="hero-card p-10 sm:p-14 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Store className="w-12 h-12 mx-auto mb-4 text-white/90" />
              </motion.div>
              <h2 className="font-serif text-4xl font-bold mb-3">Ready to modernize your store?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of shopkeepers growing their business with VyapaarAI.</p>
              <motion.button whileHover={{ scale: 1.06, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.97 }} onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-secondary font-bold rounded-xl text-base hover:bg-paper-card transition-colors shadow-lg">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-10 border-t border-ink-200/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="font-serif text-white text-sm font-bold leading-none">v</span>
            </div>
            <span className="font-serif text-lg font-bold text-ink">VyapaarAI</span>
          </div>
          <p className="text-sm text-ink-faint">Made with ❤️ for India's shopkeepers</p>
          <div className="flex items-center gap-5 text-xs text-ink-faint">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

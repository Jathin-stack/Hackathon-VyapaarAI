import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Smartphone, Laptop, MapPin, Clock, CheckCircle2, XCircle, Bell, ArrowRight } from 'lucide-react';

interface LoginApprovalViewProps {
  email: string;
  onApprove: () => void;
  onCancel: () => void;
}

export function LoginApprovalView({ email, onApprove, onCancel }: LoginApprovalViewProps) {
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [showSystemNotification, setShowSystemNotification] = useState(false);

  useEffect(() => {
    // Show sliding system notification from the top after 1 second
    const timer = setTimeout(() => {
      setShowSystemNotification(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = () => {
    setApproved(true);
    setShowSystemNotification(false);
    setTimeout(() => {
      onApprove();
    }, 1500);
  };

  const handleReject = () => {
    setRejected(true);
    setShowSystemNotification(false);
    setTimeout(() => {
      onCancel();
    }, 1500);
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden bg-paper kirana-bg">
      {/* Sliding System Notification Mock at the top */}
      <AnimatePresence>
        {showSystemNotification && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white/90 backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-xl z-50 hover:border-primary transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0">
                <span className="font-serif text-white font-bold">v</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-bold text-ink tracking-wide">VyapaarAI Security</span>
                  <span className="text-[10px] text-ink-soft">Just now</span>
                </div>
                <p className="text-xs font-semibold text-ink-soft">Approve login request for {email}?</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleApprove(); }}
                    className="px-3 py-1 bg-secondary text-white text-[11px] font-bold rounded-lg hover:bg-secondary-deep transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReject(); }}
                    className="px-3 py-1 bg-ink-100 text-ink text-[11px] font-bold rounded-lg hover:bg-ink-200 transition-colors"
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Main Details Panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 glass-card p-8 flex flex-col justify-between min-h-[480px]"
        >
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-ink">Two-Step Login Approval</h1>
                <p className="text-xs text-ink-soft">Protecting your Kirana dashboard</p>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-1.5">
                <motion.span
                  animate={approved || rejected ? {} : { scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-2 h-2 rounded-full ${approved ? 'bg-sale' : rejected ? 'bg-overdue' : 'bg-primary'}`}
                />
                <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  Current Status
                </span>
              </div>
              <h2 className="text-sm font-bold text-ink">
                {approved ? (
                  <span className="text-sale-deep flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Approval Successful. Loading dashboard...
                  </span>
                ) : rejected ? (
                  <span className="text-overdue-deep flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Login Request Denied. Redirecting...
                  </span>
                ) : (
                  'Awaiting confirmation from your registered device...'
                )}
              </h2>
            </div>

            {/* Login Attempt Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Request Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/50 border border-ink-100 rounded-xl">
                  <Laptop className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-ink-soft font-semibold uppercase tracking-wide">Device</p>
                    <p className="text-xs font-bold text-ink truncate">Chrome on Windows</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 border border-ink-100 rounded-xl">
                  <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-ink-soft font-semibold uppercase tracking-wide">Location</p>
                    <p className="text-xs font-bold text-ink truncate">Delhi, India (Simulated)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 border border-ink-100 rounded-xl">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-ink-soft font-semibold uppercase tracking-wide">Time</p>
                    <p className="text-xs font-bold text-ink">{currentTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 border border-ink-100 rounded-xl">
                  <Smartphone className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-ink-soft font-semibold uppercase tracking-wide">Target Account</p>
                    <p className="text-xs font-bold text-ink truncate">{email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-ink-100 flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApprove}
              disabled={approved || rejected}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50"
            >
              Approve Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReject}
              disabled={approved || rejected}
              className="py-3 px-6 bg-white border border-ink-200 text-ink text-sm font-semibold rounded-xl hover:bg-ink-100 transition-colors disabled:opacity-50"
            >
              Deny Access
            </motion.button>
          </div>
        </motion.div>

        {/* Interactive Device Simulation */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 flex flex-col items-center justify-center"
        >
          {/* Smartphone Shell */}
          <div className="w-[280px] h-[540px] bg-ink rounded-[40px] p-3 shadow-2xl border-4 border-white/20 relative flex flex-col justify-between overflow-hidden">
            {/* Camera Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-ink rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full border border-neutral-800" />
            </div>

            {/* Screen Content */}
            <div className="w-full h-full bg-[#1A0C02] rounded-[30px] overflow-hidden relative flex flex-col justify-between p-4 pt-10 text-white select-none">
              {/* Simulated lock screen wallpaper */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#2A1000] via-[#120500] to-[#0A000E] z-0" />
              {/* Subtle design element */}
              <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl z-0" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="text-4xl font-extralight tracking-wide mt-2">{currentTime}</span>
                <span className="text-[10px] text-white/50 font-medium tracking-widest uppercase mt-1">Saturday, July 18</span>
              </div>

              {/* Push Notification Dialog on lock screen */}
              <div className="relative z-10 flex-1 flex items-center justify-center">
                <AnimatePresence>
                  {!approved && !rejected && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: -20 }}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-left shadow-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                          <span className="font-serif text-white text-xs font-bold">v</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-white/90">VyapaarAI Security</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Confirm Identity</h4>
                      <p className="text-[10px] text-white/70 mb-3">
                        We detected a login attempt for {email}. Is it you?
                      </p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleApprove}
                          className="flex-1 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-deep active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1"
                        >
                          Yes, it's me <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleReject}
                          className="py-1.5 px-3 bg-white/15 text-white text-[10px] font-medium rounded-lg hover:bg-white/20 active:scale-95 transition-all"
                        >
                          No
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Screen */}
                <AnimatePresence>
                  {approved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 rounded-full bg-sale/20 border-2 border-sale flex items-center justify-center mb-4"
                      >
                        <CheckCircle2 className="w-8 h-8 text-sale" />
                      </motion.div>
                      <h4 className="text-sm font-bold text-white mb-1">Approved!</h4>
                      <p className="text-xs text-white/60">Your login session has been authenticated successfully.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rejected Screen */}
                <AnimatePresence>
                  {rejected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        className="w-16 h-16 rounded-full bg-overdue/20 border-2 border-overdue flex items-center justify-center mb-4"
                      >
                        <XCircle className="w-8 h-8 text-overdue" />
                      </motion.div>
                      <h4 className="text-sm font-bold text-white mb-1">Access Denied</h4>
                      <p className="text-xs text-white/60">This login request has been terminated.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="relative z-10 flex justify-center pb-1">
                <div className="w-24 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
          <span className="text-[11px] text-ink-soft mt-3 italic flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-primary" /> Simulate approval directly on the phone or main card
          </span>
        </motion.div>
      </div>
    </div>
  );
}

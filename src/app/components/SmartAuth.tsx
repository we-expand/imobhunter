import React, { useState } from 'react';
import { Fingerprint, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { EtherealLogo } from './ui/EtherealLogo';

export function SmartAuth({ onBack }: { onBack?: () => void }) {
  const { login, hasBiometrics } = useAuthStore();
  const [email, setEmail] = useState('admin@imobhunter.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay with elegant loading
    await new Promise(r => setTimeout(r, 1500));
    
    if (email === 'admin@imobhunter.com' && password === '123456') {
         toast.success("Welcome back to Ethereal.");
         login();
    } else {
        toast.error("Invalid credentials.");
        setIsLoading(false);
    }
  };

  const handleBiometricTrigger = async () => {
    toast.info("Scanning biometric signature...");
    try {
        setTimeout(() => {
            toast.success("Identity Verified.");
            login();
        }, 1500);
    } catch (e) {
        toast.error("Sensor Error");
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-slate-50/50 backdrop-blur-sm relative">
      
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 z-50 p-2 rounded-full hover:bg-slate-100/50 transition-colors text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
      )}

      {/* LEFT: FORM (Glassmorphism) */}
      <motion.div 
        className="w-full lg:w-[480px] p-12 lg:p-16 flex flex-col justify-center relative z-20 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-2xl shadow-indigo-50/20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-12">
            <EtherealLogo className="w-12 h-12" />
        </div>

        <div className="w-full">
            <h1 className="text-4xl font-light tracking-tight text-slate-900 mb-2">
                Sign In
            </h1>
            <p className="text-slate-500 font-light mb-10 leading-relaxed">
                Access your intelligent workspace.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-5">
                    <div className="group relative">
                        <Input 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className="h-14 bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:bg-white text-lg px-4 rounded-xl transition-all pt-4" 
                            placeholder=" "
                        />
                        <label className="absolute left-4 top-4 text-xs font-medium uppercase tracking-widest text-slate-400 transition-all group-focus-within:-translate-y-3 group-focus-within:scale-90 pointer-events-none">Email</label>
                    </div>
                    
                    <div className="group relative">
                        <Input 
                            type="password"
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className="h-14 bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:bg-white text-lg px-4 rounded-xl transition-all pt-4" 
                            placeholder=" "
                        />
                        <label className="absolute left-4 top-4 text-xs font-medium uppercase tracking-widest text-slate-400 transition-all group-focus-within:-translate-y-3 group-focus-within:scale-90 pointer-events-none">Password</label>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="h-14 px-10 rounded-full bg-slate-900 text-white text-lg font-light hover:bg-slate-800 transition-all hover:px-12 disabled:opacity-50 shadow-lg hover:shadow-xl hover:shadow-slate-900/10"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Authenticate"}
                    </Button>

                    <button 
                        type="button"
                        onClick={handleBiometricTrigger}
                        className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                        title="Biometric Access"
                    >
                        <Fingerprint className="w-6 h-6 stroke-[1.5]" />
                    </button>
                </div>
            </form>

            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Secure Connection</span>
                </div>
                <span>Ethereal OS v3.0</span>
            </div>
        </div>
      </motion.div>

      {/* RIGHT: Global Background Visible Here */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center">
         <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center p-12 max-w-2xl"
         >
            <h2 className="text-3xl font-light text-slate-900 mb-6 italic font-serif">
                "Intelligence is the ultimate luxury."
            </h2>
         </motion.div>
      </div>
    </div>
  );
}

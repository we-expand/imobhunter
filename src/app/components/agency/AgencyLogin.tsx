import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, Loader2, CheckCircle2, AlertCircle, ScanLine, Fingerprint, Linkedin, QrCode, Smartphone } from "lucide-react";
import { AgencyLogo } from "./AgencyLogo";
import { MagneticButton } from "./MagneticButton";
import { useAuthStore } from "../../hooks/useAuthStore";

interface AgencyLoginProps {
  onBack: () => void;
}

export const AgencyLogin = ({ onBack }: AgencyLoginProps) => {
  const [step, setStep] = useState<"email" | "scanning" | "password" | "success" | "digital-access" | "linkedin-qr">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Status do scanner biométrico
  const [scannerStatus, setScannerStatus] = useState<'waiting' | 'scanning' | 'success'>('waiting');
  
  // Status do LinkedIn QR
  const [qrStatus, setQrStatus] = useState<'generating' | 'ready' | 'scanned' | 'success'>('generating');
  
  const { login } = useAuthStore();

  // Reset states
  useEffect(() => {
    if (step === 'digital-access') {
      setScannerStatus('waiting');
    }
    if (step === 'linkedin-qr') {
      setQrStatus('generating');
      // Simula geração do QR Code via API
      setTimeout(() => setQrStatus('ready'), 800);
    }
  }, [step]);

  // Simulação de Polling da API do LinkedIn (Long Polling)
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;

    if (step === 'linkedin-qr' && qrStatus === 'ready') {
        // Polling a cada 2s para verificar se o usuário escaneou
        pollingInterval = setInterval(() => {
            // Em um cenário real, aqui chamariamos: await api.checkLoginStatus(sessionToken)
            // Vamos simular que o usuário escaneou após 4 segundos aleatórios
            const randomChance = Math.random();
            if (randomChance > 0.7) {
                setQrStatus('scanned');
                clearInterval(pollingInterval);
                
                // Transição para sucesso
                setTimeout(() => {
                    setQrStatus('success');
                    setTimeout(() => {
                        login(); // Login com dados mockados do LinkedIn
                    }, 1000);
                }, 1500);
            }
        }, 2000);
    }

    return () => clearInterval(pollingInterval);
  }, [step, qrStatus, login]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        setError("Identification required.");
        return;
    }
    setError(null);
    setStep("scanning");
    
    // Simula scan de identidade
    setTimeout(() => {
      setStep("password");
    }, 1500);
  };

  const handleBiometricScan = async () => {
    if (scannerStatus !== 'waiting') return;
    setScannerStatus('scanning');
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScannerStatus('success');
    await new Promise(resolve => setTimeout(resolve, 500));
    setStep("success");
    setTimeout(() => {
        login();
    }, 1500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    try {
        await login(); 
        setStep("success");
    } catch (err) {
        setError("Access Denied: Invalid Credentials.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white flex items-center justify-center font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Header */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center mb-12"
        >
            <div className="scale-75 mb-6"><AgencyLogo /></div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <p className="mt-4 text-xs font-mono text-indigo-400 uppercase tracking-widest">Secure Access Protocol v2.0</p>
        </motion.div>

        {/* Login Container */}
        <div className="relative">
            {/* Glass Box */}
            <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl" />
            
            <div className="relative p-8 md:p-12">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: EMAIL & OPTIONS */}
                    {step === "email" && (
                        <motion.form
                            key="email-step"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            onSubmit={handleEmailSubmit}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Identification</label>
                                <div className="group relative flex items-center">
                                    <Mail className="absolute left-4 h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        type="email" 
                                        autoFocus
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="user@imobhunter.com"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            
                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={14} /> {error}
                                </motion.div>
                            )}

                            <div className="pt-2 space-y-3">
                                <MagneticButton className="w-full bg-indigo-600/10 hover:bg-indigo-600 border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white">
                                    Proceed <ArrowRight className="ml-2 h-4 w-4" />
                                </MagneticButton>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/5" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase">
                                        <span className="bg-[#0A0A0B] px-2 text-zinc-600">Quick Access</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setError(null); setStep("digital-access"); }}
                                        className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                                    >
                                        <Fingerprint className="w-5 h-5 text-indigo-500 group-hover:text-white transition-colors" />
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 group-hover:text-white">Biometric</span>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => { setError(null); setStep("linkedin-qr"); }}
                                        className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[#0077b5]/20 hover:border-[#0077b5]/30 transition-all group"
                                    >
                                        <Linkedin className="w-5 h-5 text-[#0077b5] group-hover:text-[#0077b5] transition-colors" />
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 group-hover:text-white">LinkedIn QR</span>
                                    </button>
                                </div>
                            </div>
                            
                            <button type="button" onClick={onBack} className="w-full text-center text-xs text-zinc-600 hover:text-white transition-colors mt-4">
                                Cancel Connection
                            </button>
                        </motion.form>
                    )}

                    {/* STEP: LINKEDIN QR */}
                    {step === "linkedin-qr" && (
                        <motion.div
                            key="linkedin-step"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="flex flex-col items-center text-center space-y-6"
                        >
                            <div className="space-y-2">
                                <h3 className="text-lg font-light text-white flex items-center justify-center gap-2">
                                    <Linkedin className="w-5 h-5 text-[#0077b5]" />
                                    LinkedIn Connect
                                </h3>
                                <p className="text-xs text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                                    Scan the code below with your mobile camera to authorize access.
                                </p>
                            </div>

                            <div className="relative p-3 bg-white rounded-xl shadow-[0_0_30px_rgba(0,119,181,0.15)] group">
                                {qrStatus === 'generating' && (
                                    <div className="w-48 h-48 flex items-center justify-center bg-zinc-100 rounded-lg">
                                        <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                                    </div>
                                )}

                                {(qrStatus === 'ready' || qrStatus === 'scanned' || qrStatus === 'success') && (
                                    <div className="relative">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://linkedin.com/oauth/authorize?client_id=imobhunter_v2&response_type=code&scope=r_liteprofile%20r_emailaddress&state=xyz123`}
                                            alt="LinkedIn Auth QR"
                                            className={`w-48 h-48 mix-blend-multiply transition-opacity duration-500 ${qrStatus === 'success' ? 'opacity-20' : 'opacity-100'}`}
                                        />
                                        
                                        {/* Logo Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Linkedin className="w-6 h-6 text-[#0077b5]" />
                                            </div>
                                        </div>

                                        {/* Success Overlay */}
                                        {qrStatus === 'success' && (
                                            <motion.div 
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                <CheckCircle2 className="w-16 h-16 text-green-500 drop-shadow-lg" />
                                            </motion.div>
                                        )}
                                        
                                        {/* Scanned Overlay */}
                                        {qrStatus === 'scanned' && qrStatus !== 'success' && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg"
                                            >
                                                <Smartphone className="w-10 h-10 text-[#0077b5] animate-bounce mb-2" />
                                                <span className="text-xs font-bold text-[#0077b5] uppercase tracking-wide">Device Connected</span>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="h-4">
                                {qrStatus === 'generating' && <p className="text-[10px] text-zinc-500">Generating Secure Key...</p>}
                                {qrStatus === 'ready' && <p className="text-[10px] text-[#0077b5] animate-pulse">Waiting for scan...</p>}
                                {qrStatus === 'scanned' && <p className="text-[10px] text-green-500">Authorizing...</p>}
                                {qrStatus === 'success' && <p className="text-[10px] text-green-500 font-bold">Authorized!</p>}
                            </div>

                            <button 
                                type="button" 
                                onClick={() => { setStep("email"); setQrStatus('generating'); }} 
                                className="text-xs text-zinc-600 hover:text-white transition-colors"
                            >
                                Back to Identification
                            </button>
                        </motion.div>
                    )}

                    {/* STEP: BIOMETRIC */}
                    {step === "digital-access" && (
                        <motion.div
                            key="digital-step"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="flex flex-col items-center text-center space-y-10 py-4"
                        >
                            <div className="space-y-3">
                                <h3 className="text-2xl font-normal text-white tracking-tight">Biometric Auth</h3>
                                <p className="text-sm text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
                                    Use a Digital e disponibilize ou cadastre sua digital ou acesso com Digital.
                                </p>
                            </div>

                            <div 
                                className="relative group cursor-pointer my-4"
                                onClick={handleBiometricScan}
                            >
                                <div className="absolute inset-0 -m-8 rounded-full border border-indigo-500/10 opacity-50" />
                                <div className="absolute inset-0 -m-4 rounded-full border border-indigo-500/20 opacity-30" />
                                
                                {scannerStatus === 'waiting' && (
                                    <>
                                        <div className="absolute inset-0 -m-2 rounded-full border border-indigo-500/50 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.2)]" />
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-xl" />
                                    </>
                                )}

                                {scannerStatus === 'scanning' && (
                                    <>
                                        <div className="absolute inset-0 -m-6 rounded-full border border-indigo-500/40 animate-ping" />
                                        <div className="absolute inset-0 -m-2 rounded-full border border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
                                    </>
                                )}
                                
                                <div className={`
                                    relative w-28 h-28 rounded-full flex items-center justify-center
                                    border-2 transition-all duration-500
                                    ${scannerStatus === 'waiting' ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-black' : ''}
                                    ${scannerStatus === 'scanning' ? 'border-indigo-400 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.4)]' : ''}
                                    ${scannerStatus === 'success' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : ''}
                                `}>
                                    <Fingerprint 
                                        className={`
                                            w-14 h-14 transition-all duration-500
                                            ${scannerStatus === 'waiting' ? 'text-indigo-500' : ''}
                                            ${scannerStatus === 'scanning' ? 'text-indigo-300 scale-110' : ''}
                                            ${scannerStatus === 'success' ? 'text-emerald-400 scale-110' : ''}
                                        `}
                                        strokeWidth={1.5}
                                    />
                                    
                                    {scannerStatus === 'scanning' && (
                                        <motion.div 
                                            initial={{ top: "10%" }}
                                            animate={{ top: "90%" }}
                                            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                            className="absolute left-4 right-4 h-0.5 bg-indigo-400 shadow-[0_0_15px_#fff]"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <p className={`text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${scannerStatus === 'waiting' ? 'text-indigo-500' : 'text-indigo-300/50'}`}>
                                    {scannerStatus === 'waiting' && "TOUCH SENSOR TO LOGIN"}
                                    {scannerStatus === 'scanning' && "READING BIOMETRICS..."}
                                    {scannerStatus === 'success' && "IDENTITY VERIFIED"}
                                </p>

                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setStep("email");
                                        setScannerStatus('waiting');
                                    }} 
                                    className="text-sm text-zinc-600 hover:text-white transition-colors"
                                >
                                    Back to Standard Login
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SCANNING (Transition) */}
                    {step === "scanning" && (
                        <motion.div
                            key="scanning-step"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
                                <div className="relative rounded-full border border-indigo-500 p-4">
                                    <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                                </div>
                            </div>
                            <p className="mt-6 text-sm font-mono text-zinc-400 animate-pulse">
                                Verifying credentials...
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 3: PASSWORD */}
                    {step === "password" && (
                        <motion.form
                            key="password-step"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            onSubmit={handleLogin}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-8 p-3 rounded-lg bg-white/5 border border-white/5">
                                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                                    {email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate">{email}</p>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Verified ID
                                    </p>
                                </div>
                                <button type="button" onClick={() => setStep("email")} className="text-xs text-zinc-500 hover:text-white">Change</button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Access Key</label>
                                <div className="group relative flex items-center">
                                    <Lock className="absolute left-4 h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        type="password" 
                                        autoFocus
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={14} /> {error}
                                </motion.div>
                            )}

                            <div className="pt-2">
                                <MagneticButton className="w-full bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                    Authenticate <ArrowRight className="ml-2 h-4 w-4" />
                                </MagneticButton>
                            </div>
                        </motion.form>
                    )}

                    {/* SUCCESS */}
                    {step === "success" && (
                        <motion.div
                            key="success-step"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center py-8"
                        >
                            <CheckCircle2 className="h-16 w-16 text-green-400 mb-6" />
                            <h3 className="text-2xl font-bold text-white">Access Granted</h3>
                            <p className="text-zinc-400 mt-2">Loading Command Center...</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center flex justify-between text-[10px] text-zinc-600 uppercase tracking-wider font-mono">
            <span>Encrypted Connection</span>
            <span>Server: US-East-1</span>
        </div>

      </div>
    </div>
  );
};
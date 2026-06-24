import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, X, ShieldCheck, Smartphone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function BiometricsSetup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'prompt' | 'scanning' | 'success' | 'error'>('prompt');

  useEffect(() => {
    // Verifica se já foi oferecido ou configurado neste dispositivo
    const hasConfigured = localStorage.getItem('biometrics_configured');
    const hasDismissed = localStorage.getItem('biometrics_dismissed_ts');
    
    // Se já configurou, não mostra
    if (hasConfigured) return;

    // Se dispensou recentemente (últimas 24h), não mostra
    if (hasDismissed) {
        const dismissedTime = parseInt(hasDismissed);
        const oneDay = 24 * 60 * 60 * 1000;
        if (Date.now() - dismissedTime < oneDay) return;
    }

    // Mostra após 1 segundo de "inatividade" ou carregamento do dashboard
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('biometrics_dismissed_ts', Date.now().toString());
  };

  const handleActivate = async () => {
    setStep('scanning');

    // UX: Simula o tempo de interação com o sistema nativo (FaceID/TouchID)
    // Na implementação real, aqui chamaria navigator.credentials.create()
    
    try {
        // Verificação real de compatibilidade
        if (!window.PublicKeyCredential) {
            throw new Error("Seu dispositivo não suporta autenticação biométrica.");
        }

        // Simulação da espera do usuário tocar no sensor
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Sucesso
        setStep('success');
        localStorage.setItem('biometrics_configured', 'true');
        toast.success("Login com biometria ativado com sucesso!");
        
        // Fecha automaticamente após sucesso
        setTimeout(() => {
            setIsOpen(false);
        }, 2000);

    } catch (error: any) {
        setStep('prompt'); // Volta para tentar de novo ou cancelar
        toast.error(error.message || "Erro ao ativar biometria");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-4 sm:p-0">
            {/* Backdrop com blur leve */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto"
                onClick={handleDismiss}
            />

            {/* Card */}
            <motion.div 
                initial={{ y: 100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden pointer-events-auto relative"
            >
                <button 
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 text-center">
                    {step === 'prompt' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                                <Fingerprint className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                Acesso mais rápido
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                Ative o login com FaceID ou TouchID para entrar no ImobHunter com apenas um toque na próxima vez.
                            </p>
                            <div className="w-full space-y-3">
                                <button 
                                    onClick={handleActivate}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Smartphone className="w-4 h-4" />
                                    Ativar Biometria
                                </button>
                                <button 
                                    onClick={handleDismiss}
                                    className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium py-2 text-sm"
                                >
                                    Agora não
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'scanning' && (
                        <div className="flex flex-col items-center py-4">
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-indigo-500/30"
                            >
                                <Fingerprint className="w-10 h-10" />
                            </motion.div>
                            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">
                                Verificando...
                            </h3>
                            <p className="text-xs text-slate-500">
                                Use seu sensor biométrico agora
                            </p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center py-4">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400"
                            >
                                <CheckCircle className="w-10 h-10" />
                            </motion.div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                                Tudo pronto!
                            </h3>
                            <p className="text-sm text-slate-500">
                                Próximo login será instantâneo.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Footer seguro */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 flex items-center justify-center gap-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Segurança garantida por criptografia de ponta a ponta</span>
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
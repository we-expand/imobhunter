import React, { useState, useEffect } from 'react';
import { Fingerprint, Lock, ShieldCheck, ScanFace } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from './ui/button';

export function BiometricLogin({ onBack }: { onBack?: () => void }) {
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [scanProgress, setScanProgress] = useState(0);

  const handleBiometricAuth = async () => {
    setStatus('SCANNING');
    setScanProgress(0);

    // Tenta usar a API nativa do navegador (WebAuthn) se disponível
    if (window.PublicKeyCredential) {
      try {
        // Simulação de chamada de credencial (em produção precisaria de backend)
        // Aqui apenas simulamos o tempo de espera da UI nativa
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.log("WebAuthn não disponível ou cancelado, usando fallback visual");
      }
    }

    // Animação de progresso do scanner
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('SUCCESS');
          setTimeout(() => {
             login();
          }, 800);
          return 100;
        }
        return prev + 4; // Velocidade do scan
      });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
      {/* Botão de Voltar */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm z-50 transition-colors"
        >
          ← Voltar ao Início
        </button>
      )}

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mb-4 shadow-xl">
             <ShieldCheck className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">ImobHunter <span className="text-indigo-500">SaaS</span></h1>
          <p className="text-slate-400 text-sm mt-2">Acesso Seguro ao AI Dev Advisor</p>
        </div>

        {/* SCANNER AREA */}
        <div 
          className="relative w-48 h-48 mb-10 cursor-pointer group"
          onClick={status === 'IDLE' ? handleBiometricAuth : undefined}
        >
          {/* Anéis pulsantes */}
          {status === 'SCANNING' && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-pulse delay-75" />
            </>
          )}

          {/* Círculo base */}
          <div className={`
            absolute inset-0 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-slate-900/50 backdrop-blur-sm
            ${status === 'IDLE' ? 'border-slate-700 group-hover:border-indigo-500/50' : ''}
            ${status === 'SCANNING' ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : ''}
            ${status === 'SUCCESS' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-110' : ''}
          `}>
            
            {/* Ícone de Digital */}
            <Fingerprint 
              className={`
                w-24 h-24 transition-all duration-500
                ${status === 'IDLE' ? 'text-slate-600 group-hover:text-slate-400' : ''}
                ${status === 'SCANNING' ? 'text-indigo-400 opacity-50' : ''}
                ${status === 'SUCCESS' ? 'text-emerald-400 scale-110' : ''}
              `} 
              strokeWidth={1}
            />

            {/* Linha de Scan */}
            {status === 'SCANNING' && (
              <div 
                className="absolute w-full h-1 bg-indigo-400 shadow-[0_0_10px_#818cf8] opacity-80"
                style={{ top: `${scanProgress}%` }}
              />
            )}
            
            {/* Texto de Progresso */}
            {status === 'SCANNING' && (
              <div className="absolute font-mono text-xs text-indigo-300 bottom-10 bg-slate-900/80 px-2 py-0.5 rounded">
                {scanProgress}%
              </div>
            )}
          </div>
        </div>

        <div className="h-12 flex flex-col items-center justify-center w-full">
           {status === 'IDLE' && (
             <p className="text-slate-500 animate-pulse text-sm">Toque na digital para entrar</p>
           )}
           {status === 'SCANNING' && (
             <p className="text-indigo-400 font-medium text-sm tracking-wide">VERIFICANDO IDENTIDADE...</p>
           )}
           {status === 'SUCCESS' && (
             <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wide animate-in fade-in slide-in-from-bottom-2">
               <ShieldCheck className="w-5 h-5" />
               ACESSO AUTORIZADO
             </div>
           )}
        </div>

        {/* Fallback Buttons */}
        <div className="mt-12 flex gap-4 w-full justify-center opacity-50 hover:opacity-100 transition-opacity">
           <Button variant="ghost" className="text-xs text-slate-500 hover:text-white" onClick={handleBiometricAuth}>
             <ScanFace className="w-4 h-4 mr-2" />
             Usar FaceID
           </Button>
           <Button variant="ghost" className="text-xs text-slate-500 hover:text-white">
             <Lock className="w-4 h-4 mr-2" />
             Senha Padrão
           </Button>
        </div>
      </div>
    </div>
  );
}

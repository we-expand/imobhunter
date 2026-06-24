/**
 * 🔐 DEMO GATE - Proteção para Apresentações de Portfólio
 * 
 * Componente que protege o acesso ao ImobHunter durante apresentações.
 * Senha configurável via props ou variável de ambiente.
 */

import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DemoGateProps {
  children: React.ReactNode;
  /** Senha de acesso (default: "imobhunter2024") */
  password?: string;
  /** Título personalizado */
  title?: string;
  /** Mensagem personalizada */
  message?: string;
  /** Nome do apresentador */
  presenterName?: string;
  /** Email de contato */
  contactEmail?: string;
}

const STORAGE_KEY = 'imobhunter_demo_access';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 horas

export function DemoGate({
  children,
  password = 'imobhunter2024',
  title = 'ImobHunter - Demo Protegida',
  message = 'Esta é uma demonstração privada do projeto ImobHunter',
  presenterName = 'Cleber Couto',
  contactEmail,
}: DemoGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se já tem acesso salvo
  useEffect(() => {
    const savedAccess = localStorage.getItem(STORAGE_KEY);
    if (savedAccess) {
      try {
        const { timestamp, unlocked } = JSON.parse(savedAccess);
        const now = Date.now();
        
        // Verificar se sessão ainda é válida (4 horas)
        if (unlocked && (now - timestamp) < SESSION_DURATION) {
          setIsUnlocked(true);
        } else {
          // Sessão expirada, limpar
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (inputPassword === password) {
      // Salvar acesso no localStorage com timestamp
      const accessData = {
        unlocked: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accessData));
      
      setIsUnlocked(true);
      setInputPassword('');
    } else {
      setError('Senha incorreta. Por favor, tente novamente.');
      
      // Limpar erro após 3 segundos
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsUnlocked(false);
    setInputPassword('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400 text-xl">Carregando...</div>
      </div>
    );
  }

  // Se desbloqueado, mostrar conteúdo
  if (isUnlocked) {
    return (
      <>
        {children}
        
        {/* Botão flutuante para sair da demo */}
        <button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 bg-slate-800/80 backdrop-blur-sm text-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors shadow-lg border border-slate-700 z-50 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Sair da Demo
        </button>
      </>
    );
  }

  // Tela de login
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card Principal */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-slate-800 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-cyan-500/20">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              {title}
            </h1>
            
            <p className="text-slate-400 text-sm">
              {message}
            </p>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input de Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Senha de Acesso
                </label>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="Digite a senha de demonstração"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12"
                    autoFocus
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Erro */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={!inputPassword}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              >
                Acessar Demonstração
              </button>
            </form>

            {/* Info Adicional */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                💡 <strong>Para recrutadores:</strong> Se você recebeu este link mas não tem a senha, entre em contato comigo
              </p>
              
              {(presenterName || contactEmail) && (
                <div className="mt-4 text-center space-y-1">
                  {presenterName && (
                    <p className="text-sm text-slate-400">
                      <strong className="text-slate-300">Desenvolvedor:</strong> {presenterName}
                    </p>
                  )}
                  {contactEmail && (
                    <p className="text-sm text-slate-400">
                      <strong className="text-slate-300">Contato:</strong>{' '}
                      <a href={`mailto:${contactEmail}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        {contactEmail}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Badge de Segurança */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Acesso válido por 4 horas após login</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            Este projeto foi desenvolvido com React, TypeScript, Supabase e IA
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - LOCAL AUTH PAGE (VERSÃO LIMPA E SEGURA)
// ═══════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { localAuthService } from '../lib/local-auth-service';
import { 
  LogIn, UserPlus, ArrowLeft, Mail, Lock, User, Loader2, Sparkles,
  CheckCircle2, Shield, Zap, Target, TrendingUp, MessageSquare
} from 'lucide-react';

import { SupabaseAdminTools } from './SupabaseAdminTools';

interface AuthPageLocalProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function AuthPageLocal({ onLogin, onBack }: AuthPageLocalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Forçar foco no carregamento
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const [showAdminTools, setShowAdminTools] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Tentando login com:', email);

    try {
      const result = await localAuthService.login(email, password);

      if (result.success && result.user) {
        toast.success('✅ Login realizado com sucesso!');
        onLogin(result.user);
      } else {
        toast.error(result.error || 'Erro ao fazer login');
        if (result.error && result.error.includes('Verifique seu email')) {
          setShowAdminTools(true);
          // Pequeno delay para garantir que o estado atualize antes de scrollar se necessário
          setTimeout(() => {
             const adminPanel = document.getElementById('admin-tools-panel');
             if(adminPanel) adminPanel.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao conectar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await localAuthService.signup(email, password, name);

      if (result.success) {
        toast.success('✅ Conta criada! Faça login agora.');
        setIsLogin(true);
        setPassword('');
      } else {
        toast.error(result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      toast.error('Erro ao conectar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    console.log('Botão Demo Clicado');
    toast.success('🚀 Acesso Demo Liberado!');
    onLogin({
      id: 'demo-user',
      name: 'Usuário Demo',
      email: 'demo@imobhunter.com',
      role: 'admin'
    });
  };

  const benefits = [
    { icon: Target, text: 'Leads qualificados automaticamente', color: 'text-blue-600' },
    { icon: Zap, text: 'Automação multicanal inteligente', color: 'text-indigo-600' },
    { icon: TrendingUp, text: 'Acompanhamento em tempo real', color: 'text-purple-600' },
    { icon: MessageSquare, text: 'Nutrição automatizada de leads', color: 'text-pink-600' },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lado Esquerdo - Formulário (Limpo, sem z-index complexo) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 bg-white text-gray-900">
        
        <div className="w-full max-w-md mx-auto">
          {/* Botão Voltar */}
          <button
            type="button"
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 px-3 -ml-3 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar para Home</span>
          </button>

          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
              <Sparkles className="w-3 h-3" />
              <span>Acesso ImobHunter</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
            </h1>
            
            <p className="text-gray-500 text-lg">
              {isLogin 
                ? 'Entre com suas credenciais para continuar.' 
                : 'Junte-se a corretores de elite hoje mesmo.'}
            </p>
          </div>

          {/* Formulário Principal */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5 mb-8">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                Email profissional
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">
                Senha de acesso
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Entrar no Sistema</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Confirmar Cadastro</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="space-y-4">
            {/* Divisor */}
            <div className="flex items-center gap-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400 font-medium uppercase">Ou acesse como</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Botão Demo Gigante */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-green-50 border-2 border-green-500 text-green-700 py-4 rounded-xl hover:bg-green-100 transition-colors flex items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="bg-green-500 text-white p-1.5 rounded-full group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">ENTRAR MODO DEMO</span>
            </button>
            
            <p className="text-center text-xs text-green-600">
              * Acesso imediato, sem senha, para testes.
            </p>

            {/* Toggle Login/Signup */}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
              }}
              className="w-full py-3 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors cursor-pointer mt-4"
            >
              {isLogin 
                ? 'Não tem conta? Clique para cadastrar' 
                : 'Já tem conta? Voltar para login'}
            </button>

            {/* 🛠️ FERRAMENTAS ADMIN PARA RESOLVER LOGIN */}
            <div id="admin-tools-panel">
              <SupabaseAdminTools forceOpen={showAdminTools} />
            </div>
          </div>

        </div>
      </div>

      {/* Lado Direito - Decorativo (Escondido em Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 items-center justify-center relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="max-w-lg relative z-10">
          <div className="mb-10">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/50">
               <Target className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-4xl font-bold mb-4 leading-tight">Potencialize sua caça aos leads imobiliários.</h2>
             <p className="text-slate-300 text-lg leading-relaxed">
               Nossa IA varre a internet em busca de proprietários reais, qualifica os contatos e entrega tudo pronto para você fechar negócio.
             </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <benefit.icon className={`w-6 h-6 ${benefit.color === 'text-blue-600' ? 'text-blue-400' : benefit.color === 'text-indigo-600' ? 'text-indigo-400' : 'text-purple-400'}`} />
                <span className="font-medium text-slate-200">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - SIMPLE AUTH PAGE
// Página de autenticação usando sistema simples (sem Supabase Auth)
// ═══════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { simpleAuthService } from '../lib/simple-auth-service';
import { LogIn, UserPlus, ArrowLeft, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthPageSimpleProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

export function AuthPageSimple({ onLogin, onBack }: AuthPageSimpleProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // ═══════════════════════════════════════════════════════════════════════
  // 🔓 HANDLE LOGIN
  // ═══════════════════════════════════════════════════════════════════════
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Tentando login...');
      
      const result = await simpleAuthService.login(email, password);

      if (result.success && result.user) {
        toast.success('Login realizado com sucesso!');
        console.log('✅ Login bem-sucedido:', result.user);
        onLogin(result.user);
      } else {
        toast.error(result.error || 'Erro ao fazer login');
        console.error('❌ Erro no login:', result.error);
      }
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 📝 HANDLE SIGNUP
  // ═══════════════════════════════════════════════════════════════════════
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📝 Criando conta...');
      
      const result = await simpleAuthService.signup(email, password, name);

      if (result.success) {
        toast.success('Conta criada! Faça login agora.');
        console.log('✅ Conta criada com sucesso');
        setIsLogin(true);
        setPassword(''); // Limpar senha para fazer login
      } else {
        toast.error(result.error || 'Erro ao criar conta');
        console.error('❌ Erro no signup:', result.error);
      }
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
              {isLogin ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? 'Entre com suas credenciais para continuar' 
                : 'Preencha os dados para criar sua conta'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {/* Nome (apenas no signup) */}
            {!isLogin && (
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="João Silva"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Entrar
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Criar conta
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
              }}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isLogin ? (
                <>Não tem conta? <span className="font-semibold">Criar agora</span></>
              ) : (
                <>Já tem conta? <span className="font-semibold">Fazer login</span></>
              )}
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mt-4 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>🔒 Seus dados estão seguros e protegidos</p>
        </div>
      </div>
    </div>
  );
}

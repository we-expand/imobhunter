import { useState, useEffect } from 'react';
import { MessageCircle, Loader2, ArrowLeft, CheckCircle2, Smartphone } from 'lucide-react';
import { LogoHero } from './Logo';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db`;

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [step, setStep] = useState<'initial' | 'waiting' | 'success'>('initial');
  
  const twilioSandboxNumber = '+1 415 523 8886';
  const whatsappLink = `https://wa.me/${twilioSandboxNumber.replace(/[^0-9]/g, '')}?text=join%20${joinCode}`;

  // Gerar código único ao carregar
  useEffect(() => {
    generateJoinCode();
  }, []);

  // Verificar periodicamente se o usuário conectou
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 'waiting' && joinCode) {
      interval = setInterval(() => {
        checkWhatsAppConnection();
      }, 3000); // Verifica a cada 3 segundos
    }
    
    return () => clearInterval(interval);
  }, [step, joinCode]);

  const generateJoinCode = async () => {
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/whatsapp-get-join-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok && data.joinCode) {
        setJoinCode(data.joinCode);
      } else {
        toast.error('Erro ao gerar código. Recarregue a página.');
      }
    } catch (error) {
      toast.error('Erro ao conectar. Recarregue a página.');
    } finally {
      setLoading(false);
    }
  };

  const checkWhatsAppConnection = async () => {
    if (checking) return; // Evita múltiplas chamadas simultâneas
    
    setChecking(true);
    
    try {
      const res = await fetch(`${API_URL}/whatsapp-verify-connection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ joinCode })
      });

      const data = await res.json();

      if (res.ok && data.connected) {
        // Usuário conectou! Fazer login
        setStep('success');
        
        // Criar/fazer login do usuário
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email || `whatsapp_${joinCode}@tapago.pt`,
          password: data.password || joinCode
        });

        if (error && error.message.includes('Invalid login')) {
          // Usuário não existe, criar conta
          await createWhatsAppUser(data.phoneNumber || joinCode);
        } else if (authData?.session?.access_token) {
          localStorage.setItem('access_token', authData.session.access_token);
          toast.success('✅ Conectado via WhatsApp!');
          setTimeout(() => onLogin(), 1000);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
    } finally {
      setChecking(false);
    }
  };

  const createWhatsAppUser = async (identifier: string) => {
    try {
      const email = `whatsapp_${identifier}@tapago.pt`;
      const password = joinCode + '_secure_' + Date.now();

      const signupRes = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email,
          password,
          name: `Usuário WhatsApp ${identifier.substring(0, 6)}`
        })
      });

      if (signupRes.ok) {
        // Login automático
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (data?.session?.access_token) {
          localStorage.setItem('access_token', data.session.access_token);
          toast.success('✅ Conta criada e conectada!');
          setTimeout(() => onLogin(), 1000);
        }
      }
    } catch (error) {
      console.error('Erro ao criar usuário WhatsApp:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-green-200 rounded-3xl shadow-2xl w-full max-w-lg p-8">
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        
        <div className="mb-6">
          <LogoHero />
        </div>

        {/* PASSO 1: INICIAL */}
        {step === 'initial' && (
          <div className="space-y-6">
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login via WhatsApp
              </h2>
              <p className="text-gray-600">
                Conecte-se de forma rápida e segura
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                {/* Código Único */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6">
                  <p className="text-center text-purple-900 font-semibold mb-3">
                    Seu Código Único:
                  </p>
                  <div className="bg-white rounded-xl p-6 text-center">
                    <p className="text-5xl font-bold text-purple-900 mb-2 tracking-wider">
                      {joinCode}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(joinCode)}
                    className="w-full mt-4 px-4 py-2 bg-white border-2 border-purple-300 text-purple-900 rounded-lg hover:bg-purple-50 transition-all"
                  >
                    📋 Copiar Código
                  </button>
                </div>

                {/* BOTÃO PRINCIPAL - GIGANTE */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-2xl">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Smartphone className="w-8 h-8" />
                    <p className="text-lg font-semibold">
                      Conecte pelo WhatsApp
                    </p>
                  </div>
                  
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      setStep('waiting');
                      toast.success('Aguardando conexão...', { duration: 10000 });
                    }}
                  >
                    <button className="w-full h-16 bg-white text-green-700 rounded-xl text-xl font-bold hover:bg-green-50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3">
                      <MessageCircle className="w-7 h-7" />
                      ABRIR WHATSAPP
                    </button>
                  </a>

                  <p className="text-sm text-center mt-4 opacity-90">
                    👆 Clique aqui para enviar a mensagem automaticamente
                  </p>
                </div>

                {/* Instruções alternativas */}
                <details className="bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <summary className="p-4 cursor-pointer text-sm font-semibold text-blue-900 hover:bg-blue-100 rounded-xl transition-all">
                    📱 Instruções Manuais (se o botão não funcionar)
                  </summary>
                  <div className="p-4 pt-2 space-y-3">
                    <ol className="text-sm text-blue-900 space-y-2 list-decimal list-inside">
                      <li>Adicione <strong className="font-mono">{twilioSandboxNumber}</strong> nos seus contatos</li>
                      <li>Abra o WhatsApp</li>
                      <li>Envie a mensagem: <strong className="font-mono bg-blue-100 px-2 py-1 rounded">join {joinCode}</strong></li>
                      <li>Aguarde alguns segundos</li>
                      <li>O login será feito automaticamente!</li>
                    </ol>
                  </div>
                </details>

              </>
            )}
          </div>
        )}

        {/* PASSO 2: AGUARDANDO CONEXÃO */}
        {step === 'waiting' && (
          <div className="space-y-6 py-8">
            
            <div className="flex justify-center">
              <div className="relative">
                <MessageCircle className="w-24 h-24 text-green-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                  <Loader2 className="w-6 h-6 text-yellow-900 animate-spin" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Aguardando Conexão...
              </h3>
              <p className="text-gray-600">
                Envie a mensagem no WhatsApp para continuar
              </p>
              
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                <p className="text-sm text-green-900 font-semibold mb-2">
                  ✅ O que fazer agora:
                </p>
                <ol className="text-xs text-green-800 space-y-1 text-left list-decimal list-inside">
                  <li>Se o WhatsApp abriu, clique em <strong>Enviar</strong></li>
                  <li>Se não abriu, envie manualmente: <strong className="font-mono">join {joinCode}</strong></li>
                  <li>Aguarde... O login será automático!</li>
                </ol>
              </div>

              <p className="text-xs text-gray-500">
                Verificando conexão automaticamente...
              </p>
            </div>

            <button
              onClick={() => setStep('initial')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            >
              Voltar
            </button>
          </div>
        )}

        {/* PASSO 3: SUCESSO */}
        {step === 'success' && (
          <div className="space-y-6 py-8 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="w-24 h-24 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Conectado!
              </h3>
              <p className="text-gray-600">
                Entrando no sistema...
              </p>
            </div>

            <Loader2 className="w-8 h-8 mx-auto animate-spin text-green-600" />
          </div>
        )}

      </div>
    </div>
  );
}

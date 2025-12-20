import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Loader2, Send, Shield, AlertCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

type VerificationStep = 'input-phone' | 'verify-code' | 'connected';

export function WhatsAppPhoneVerification() {
  const [step, setStep] = useState<VerificationStep>('input-phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectedPhone, setConnectedPhone] = useState<string>('');
  const [countdown, setCountdown] = useState(0);
  const [sentChannels, setSentChannels] = useState<string[]>([]); // NOVO: armazena canais usados
  const [devModeCode, setDevModeCode] = useState<string>(''); // NOVO: código em modo dev

  // Verifica se já está conectado ao carregar
  useEffect(() => {
    checkConnection();
  }, []);

  // Countdown para reenviar código
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const checkConnection = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/whatsapp-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'connected' && data.phoneNumber) {
          setConnectedPhone(data.phoneNumber);
          setStep('connected');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
    }
  };

  const handleSendCode = async () => {
    // Validação básica
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 9) {
      toast.error('Digite um número de telefone válido');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/whatsapp-send-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber: cleaned })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao enviar código');
      }

      const data = await res.json();
      
      setStep('verify-code');
      setCountdown(60); // 60 segundos para reenviar
      
      // Feedback específico por canal
      if (data.sentViaSMS && data.sentViaWhatsApp) {
        toast.success('✅ Código enviado via SMS e WhatsApp!', {
          description: 'Verifique ambos os canais'
        });
      } else if (data.sentViaSMS) {
        toast.success('✅ Código enviado via SMS!', {
          description: 'WhatsApp não configurado - usando SMS'
        });
      } else if (data.sentViaWhatsApp) {
        toast.success('✅ Código enviado via WhatsApp!', {
          description: 'Verifique seu WhatsApp'
        });
      } else if (data.code) {
        // MODO DESENVOLVIMENTO - mostra código no toast
        toast.warning(`🧪 MODO DEV - Código: ${data.code}`, {
          description: 'Configure Twilio para envio real',
          duration: 10000 // 10 segundos
        });
        console.log('🧪 CÓDIGO DE DESENVOLVIMENTO:', data.code);
        setDevModeCode(data.code); // NOVO: armazena código em modo dev
      } else {
        toast.warning('⚠️ Código gerado mas não enviado', {
          description: 'Configure Twilio para envio real'
        });
      }
      
      console.log('📊 Canais de envio:', {
        SMS: data.sentViaSMS,
        WhatsApp: data.sentViaWhatsApp,
        channels: data.channels,
        code: data.code ? '***' + data.code.slice(-3) : 'não disponível'
      });
      
      setSentChannels(data.channels || []); // NOVO: armazena canais usados
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/whatsapp-verify-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          code: verificationCode
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Código inválido');
      }

      const data = await res.json();
      
      setConnectedPhone(data.phoneNumber);
      setStep('connected');
      toast.success('✅ WhatsApp conectado com sucesso!');
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message);
      setVerificationCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/whatsapp-disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setStep('input-phone');
        setPhoneNumber('');
        setVerificationCode('');
        setConnectedPhone('');
        toast.success('WhatsApp desconectado');
      }
    } catch (error: any) {
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove tudo exceto números
    const cleaned = value.replace(/\D/g, '');
    
    // Formata para +351 912 345 678
    if (cleaned.startsWith('351')) {
      const formatted = cleaned.slice(3);
      return `+351 ${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 9)}`.trim();
    } else if (cleaned.length > 0) {
      return `+351 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`.trim();
    }
    return value;
  };

  // Passo 1: Inserir número de telefone
  if (step === 'input-phone') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-xl border-2 border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50">
            <CardTitle className="text-emerald-700 flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Conectar WhatsApp Business
            </CardTitle>
            <CardDescription>
              Verificação por número de telefone (método oficial)
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              {/* Ícone */}
              <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-16 h-16 text-emerald-600" />
              </div>

              {/* Explicação */}
              <div className="max-w-md mx-auto space-y-3">
                <h3 className="text-slate-800 font-semibold">
                  Como funciona:
                </h3>
                <ol className="text-left text-sm text-slate-600 space-y-2">
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">1</span>
                    <span>Digite o número de telefone empresarial do WhatsApp</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">2</span>
                    <span>Receberá um código de verificação via SMS</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">3</span>
                    <span>Digite o código para confirmar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">4</span>
                    <span>Pronto! WhatsApp conectado e funcionando</span>
                  </li>
                </ol>
              </div>

              {/* Campo de telefone */}
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">
                    Número de Telefone WhatsApp Business
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="912 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendCode();
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 text-left">
                    Formato: 912345678 ou +351912345678
                  </p>
                </div>

                <Button
                  onClick={handleSendCode}
                  disabled={isLoading || !phoneNumber}
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      A enviar código...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Código de Verificação
                    </>
                  )}
                </Button>
              </div>

              {/* Info de segurança */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Seguro e Oficial
                    </p>
                    <p className="text-xs text-blue-800">
                      Este é o método oficial de verificação do WhatsApp Business API. 
                      Seus dados estão protegidos e criptografados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Passo 2: Verificar código
  if (step === 'verify-code') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Verificar Código
            </CardTitle>
            <CardDescription>
              Digite o código enviado para {formatPhoneNumber(phoneNumber)}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              {/* Ícone */}
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-16 h-16 text-blue-600" />
              </div>

              {/* Instruções */}
              <div className="max-w-md mx-auto">
                <p className="text-slate-700 mb-4">
                  {sentChannels.length > 0 ? (
                    sentChannels.includes('SMS') && sentChannels.includes('WhatsApp') ? (
                      <>Enviámos um código de 6 dígitos via <strong>SMS e WhatsApp</strong> para o seu número</>
                    ) : sentChannels.includes('SMS') ? (
                      <>Enviámos um código de 6 dígitos via <strong>SMS</strong> para o seu número</>
                    ) : sentChannels.includes('WhatsApp') ? (
                      <>Enviámos um código de 6 dígitos via <strong>WhatsApp</strong> para o seu número</>
                    ) : (
                      <>Enviámos um código de 6 dígitos para o seu número</>
                    )
                  ) : (
                    <>Enviámos um código de 6 dígitos via <strong>SMS</strong> para o seu número</>
                  )}
                </p>
                <p className="text-2xl font-bold text-slate-800 mb-2">
                  {formatPhoneNumber(phoneNumber)}
                </p>
                {sentChannels.length > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    {sentChannels.map((channel, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-bold text-emerald-700"
                      >
                        {channel === 'SMS' && '📱 SMS'}
                        {channel === 'WhatsApp' && '💬 WhatsApp'}
                        {channel === 'Desenvolvimento' && '🧪 Dev Mode'}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* MODO DEV: Mostra código direto na tela */}
              {devModeCode && (
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-400 rounded-2xl p-6 shadow-2xl animate-pulse">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <AlertCircle className="w-6 h-6 text-purple-700" />
                      <p className="font-black text-purple-900 text-lg">
                        🧪 MODO DESENVOLVIMENTO
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border-2 border-purple-300">
                      <p className="text-xs text-purple-700 mb-2 font-semibold">
                        SEU CÓDIGO DE VERIFICAÇÃO:
                      </p>
                      <p className="text-6xl font-black text-purple-900 tracking-widest text-center mb-3">
                        {devModeCode}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(devModeCode);
                          toast.success('Código copiado!');
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold"
                      >
                        📋 Copiar Código
                      </button>
                    </div>
                    <p className="text-xs text-purple-800 mt-3 text-center">
                      Configure Twilio em <strong>Configurações → SMS</strong> para envio real
                    </p>
                  </div>
                </div>
              )}

              {/* Campo de código */}
              <div className="max-w-sm mx-auto space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-3xl font-bold tracking-widest py-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && verificationCode.length === 6) {
                        handleVerifyCode();
                      }
                    }}
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Digite o código de 6 dígitos
                  </p>
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      A verificar...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verificar Código
                    </>
                  )}
                </Button>
              </div>

              {/* Reenviar código */}
              <div className="border-t pt-4">
                <p className="text-sm text-slate-600 mb-2">Não recebeu o código?</p>
                {countdown > 0 ? (
                  <p className="text-sm text-slate-500">
                    Reenviar em {countdown}s
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep('input-phone');
                      setVerificationCode('');
                    }}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Alterar Número
                  </Button>
                )}
              </div>

              {/* Alerta */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-xs text-amber-800">
                      Se não receber o SMS, verifique se o número está correto e 
                      se tem cobertura de rede.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Passo 3: Conectado
  if (step === 'connected') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-xl border-2 border-emerald-200">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-6">
              {/* Ícone de sucesso */}
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-emerald-100 to-cyan-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200">
                  <CheckCircle className="w-20 h-20 text-emerald-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-emerald-700 text-3xl">
                  ✅ WhatsApp Conectado!
                </h2>
                <p className="text-lg text-slate-700 font-semibold">
                  {formatPhoneNumber(connectedPhone)}
                </p>
              </div>
              
              {/* Status */}
              <div className="inline-block bg-gradient-to-r from-emerald-100 to-cyan-100 px-8 py-4 rounded-2xl border-2 border-emerald-300 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-emerald-800 font-bold">
                    ONLINE • Pronto para enviar mensagens
                  </p>
                </div>
              </div>

              {/* Informações */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <p className="text-blue-900 font-semibold mb-2">
                  Conexão Ativa
                </p>
                <p className="text-sm text-blue-800">
                  O sistema está pronto para enviar mensagens automáticas de cobrança 
                  através do WhatsApp Business API.
                </p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-2xl font-bold text-emerald-600">1000</p>
                  <p className="text-xs text-slate-600">Conversas grátis/mês</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-600">24h</p>
                  <p className="text-xs text-slate-600">Janela de resposta</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-2xl font-bold text-purple-600">∞</p>
                  <p className="text-xs text-slate-600">Mensagens ilimitadas</p>
                </div>
              </div>

              {/* Botão de desconectar */}
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 px-8"
                  onClick={handleDisconnect}
                >
                  Desconectar WhatsApp
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
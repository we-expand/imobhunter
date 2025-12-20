import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, Loader2, MessageCircle, Send, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

interface WhatsAppEasyConnectProps {
  onConnectionChange?: (connected: boolean, number?: string) => void;
}

export function WhatsAppEasyConnect({ onConnectionChange }: WhatsAppEasyConnectProps) {
  const [step, setStep] = useState<'intro' | 'phone' | 'verify' | 'connected'>('intro');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const [developmentCode, setDevelopmentCode] = useState<string | null>(null);

  const addLog = (log: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
    console.log(log);
  };

  // Verificar se já está conectado
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${SERVER_URL}/whatsapp-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.connected || data.status === 'connected') {
          setPhoneNumber(data.phoneNumber || data.number || '');
          setStep('connected');
          onConnectionChange?.(true, data.phoneNumber || data.number);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const handleStartConnection = () => {
    setStep('phone');
  };

  const handleSendCodes = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('Digite um número válido com código do país');
      return;
    }

    // Validar formato básico
    if (!phoneNumber.startsWith('+')) {
      toast.error('Número deve começar com + e código do país\nExemplo: +351912345678');
      return;
    }

    setDebugLogs([]); // Limpar logs anteriores
    setIsLoading(true);
    toast.loading('📱 Enviando códigos via SMS e WhatsApp...', { id: 'sending' });
    
    try {
      addLog('🔐 Obtendo token de autenticação...');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        addLog('❌ ERRO: Sem token de autenticação!');
        toast.error('Você precisa fazer login primeiro', { id: 'sending' });
        return;
      }
      
      addLog('✅ Token obtido com sucesso');
      addLog(`📤 Enviando códigos para: ${phoneNumber}`);
      addLog(`🌐 URL do servidor: ${SERVER_URL}/whatsapp-send-verification`);

      const res = await fetch(`${SERVER_URL}/whatsapp-send-verification`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ phoneNumber })
      });

      addLog(`📥 Status HTTP recebido: ${res.status}`);
      
      const data = await res.json();
      
      addLog(`📥 Resposta do servidor: ${JSON.stringify(data)}`);
      
      // Se o servidor retornou debugLogs, adicionar ao painel
      if (data.debugLogs && Array.isArray(data.debugLogs)) {
        addLog('');
        addLog('🔍 ========== LOGS DO SERVIDOR ==========');
        data.debugLogs.forEach((log: string) => addLog(log));
        addLog('🔍 ========================================');
        addLog('');
      }

      if (res.ok && data.success) {
        addLog('✅ SUCESSO! Códigos foram enviados');
        addLog(`📱 SMS enviado: ${data.sentViaSMS ? 'SIM ✅' : 'NÃO ❌'}`);
        addLog(`💬 WhatsApp enviado: ${data.sentViaWhatsApp ? 'SIM ✅' : 'NÃO ❌'}`);
        
        // DETECTAR MODO DESENVOLVIMENTO AUTOMATICAMENTE
        const isDevMode = !data.sentViaSMS && !data.sentViaWhatsApp && data.code;
        setIsDevelopmentMode(isDevMode);
        
        if (isDevMode) {
          setDevelopmentCode(data.code);
          addLog(`🧪 MODO DESENVOLVIMENTO ATIVADO - Código: ${data.code}`);
          toast.success(
            `🧪 MODO DEV: Código gerado automaticamente!\n\n📋 Veja abaixo o código de 6 dígitos`, 
            { id: 'sending', duration: 8000 }
          );
        } else {
          toast.success(
            `✅ Códigos enviados!\n📱 Verifique seu SMS e WhatsApp`, 
            { id: 'sending', duration: 5000 }
          );
        }
        
        setSentCode(data.code);
        setStep('verify');
      } else {
        addLog(`❌ ERRO do servidor: ${data.error || 'Erro desconhecido'}`);
        toast.error(
          data.error || 'Erro ao enviar códigos.\nVerifique se o número está correto.', 
          { id: 'sending' }
        );
      }
    } catch (error: any) {
      addLog(`❌ EXCEPTION: ${error.message}`);
      addLog(`❌ Stack: ${error.stack}`);
      toast.error('Erro ao enviar códigos', { id: 'sending' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${SERVER_URL}/whatsapp-verify-code`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          phoneNumber,
          code: verificationCode 
        })
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setStep('connected');
        onConnectionChange?.(true, phoneNumber);
        toast.success('🎉 WhatsApp e SMS conectados com sucesso!');
      } else {
        toast.error(data.error || 'Código incorreto. Tente novamente.');
      }
    } catch (error: any) {
      toast.error('Erro ao verificar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      await fetch(`${SERVER_URL}/whatsapp-disconnect`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      setStep('intro');
      setPhoneNumber('');
      setVerificationCode('');
      setSentCode('');
      onConnectionChange?.(false);
      toast.success('Desconectado com sucesso');
    } catch (error: any) {
      toast.error('Erro ao desconectar');
    }
  };

  const handleTestMessage = async () => {
    const testNumber = window.prompt(
      'Digite o número para teste (com código do país):\n\nExemplo: +351912345678',
      phoneNumber
    );
    
    if (!testNumber) return;
    
    toast.loading('Enviando mensagem de teste...', { id: 'test' });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`${SERVER_URL}/whatsapp-send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: testNumber,
          message: '✅ Teste do Tá Pago.pt!\n\nSua conexão WhatsApp está funcionando! 🎉'
        })
      });
      
      if (res.ok) {
        toast.success('✅ Mensagem WhatsApp enviada!', { id: 'test' });
      } else {
        const error = await res.json();
        toast.error(error.error || 'Erro ao enviar', { id: 'test' });
      }
    } catch (error: any) {
      toast.error('Erro ao enviar', { id: 'test' });
    }
  };

  const handleResendCodes = async () => {
    setVerificationCode('');
    await handleSendCodes();
  };

  return (
    <Card className="border-green-100 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Smartphone className="w-5 h-5" />
          Conexão WhatsApp + SMS
        </CardTitle>
        <CardDescription>
          {step === 'connected' 
            ? '✅ Conectado - Enviando mensagens reais via WhatsApp e SMS'
            : '🚀 Receba códigos por SMS e WhatsApp para conectar'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        {/* DEBUG PANEL - SEMPRE VISÍVEL */}
        {debugLogs.length > 0 && (
          <div className="mb-6 bg-slate-900 text-green-400 rounded-lg p-4 font-mono text-xs max-h-96 overflow-y-auto sticky top-0 z-50 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400 ml-2">🔍 Logs de Debug</span>
              </div>
              <button
                onClick={() => {
                  const text = debugLogs.join('\n');
                  navigator.clipboard.writeText(text);
                  toast.success('Logs copiados!');
                }}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white"
              >
                📋 Copiar
              </button>
            </div>
            <div className="space-y-1">
              {debugLogs.map((log, idx) => (
                <div key={idx} className="break-all">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* INTRO */}
        {step === 'intro' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-600 p-3 rounded-full">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">
                    Conexão Ultra-Simples em 2 Passos
                  </h3>
                  <p className="text-sm text-green-700">
                    Receba códigos REAIS por SMS e WhatsApp e conecte em 1 minuto!
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Digite seu número</p>
                    <p className="text-xs text-green-700">Enviaremos códigos via SMS + WhatsApp</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Digite o código recebido</p>
                    <p className="text-xs text-green-700">Você receberá nos 2 canais</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Pronto! 🎉</p>
                    <p className="text-xs text-green-700">Envie mensagens reais por WhatsApp e SMS</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>✅ Benefícios:</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ <strong>2 canais conectados</strong> (WhatsApp + SMS)</li>
                <li>✓ Mensagens <strong>REAIS</strong> usando Twilio</li>
                <li>✓ <strong>1.000 msgs grátis/mês</strong> para testar</li>
                <li>✓ Configuração em <strong>menos de 1 minuto</strong></li>
              </ul>
            </div>

            <Button 
              onClick={handleStartConnection}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Começar Agora (Grátis)
            </Button>
          </div>
        )}

        {/* PASSO 1: NÚMERO */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <h3 className="font-semibold text-green-900">Passo 1: Digite seu número</h3>
              </div>
              <p className="text-sm text-green-700">
                Enviaremos códigos de verificação por <strong>SMS</strong> e <strong>WhatsApp</strong>
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">
                Número de Telefone
              </Label>
              <Input 
                id="phone"
                type="text"
                placeholder="+351912345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 h-12 text-lg"
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500 mt-2">
                📱 <strong>Importante:</strong> Deve começar com + e código do país
                <br />
                🇵🇹 Portugal: +351912345678 | 🇧🇷 Brasil: +5511987654321
              </p>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
              <p className="text-xs text-cyan-900">
                <strong>💡 O que acontece:</strong> Você receberá um código de 6 dígitos 
                tanto no <strong>SMS</strong> quanto no <strong>WhatsApp</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSendCodes}
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando códigos...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Códigos
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setStep('intro')}
                disabled={isLoading}
                className="h-12"
              >
                Voltar
              </Button>
            </div>
          </div>
        )}

        {/* PASSO 2: VERIFICAÇÃO */}
        {step === 'verify' && (
          <div className="space-y-4">
            
            {/* 🧪 MODO DESENVOLVIMENTO - CARD COM CÓDIGO */}
            {isDevelopmentMode && developmentCode && (
              <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-4 border-amber-400 rounded-2xl p-6 shadow-2xl animate-pulse">
                <div className="text-center space-y-4">
                  <div className="bg-amber-600 text-white px-4 py-2 rounded-full inline-block font-semibold text-sm">
                    🧪 MODO DESENVOLVIMENTO
                  </div>
                  
                  <h3 className="text-xl font-bold text-amber-900">
                    Código Gerado Automaticamente
                  </h3>
                  
                  <p className="text-sm text-amber-800">
                    As credenciais Twilio não estão configuradas.<br/>
                    Use o código abaixo para testar:
                  </p>
                  
                  <div className="bg-white border-4 border-amber-500 rounded-xl p-6 shadow-lg">
                    <div className="text-6xl font-bold text-amber-600 tracking-[0.5em] font-mono">
                      {developmentCode}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(developmentCode);
                        toast.success('Código copiado!');
                      }}
                      className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      📋 Copiar Código
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-left">
                    <p className="text-xs text-blue-900 font-semibold mb-2">
                      💡 Para ativar envio REAL de SMS/WhatsApp:
                    </p>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Configure suas credenciais do Twilio</li>
                      <li>O sistema detectará automaticamente</li>
                      <li>Passará a enviar mensagens reais!</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <h3 className="font-semibold text-blue-900">Passo 2: Digite o código recebido</h3>
              </div>
              
              <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-3">
                <p className="text-sm text-blue-900 font-semibold">
                  📱 Códigos enviados para: {phoneNumber}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                    <MessageCircle className="w-4 h-4 mx-auto mb-1 text-green-600" />
                    <p className="font-semibold text-green-900">WhatsApp</p>
                    <p className="text-green-700">Verifique sua mensagem!</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <p className="font-semibold text-blue-900">SMS</p>
                    <p className="text-blue-700">Verifique sua mensagem!</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="code" className="text-sm font-semibold">
                Código de Verificação (6 dígitos)
              </Label>
              <Input 
                id="code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-2 h-14 text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Digite o código que você recebeu no SMS ou WhatsApp
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
              <p className="text-xs text-amber-900">
                <strong>💡 Dica:</strong> O código acima foi enviado por SMS e WhatsApp. 
                Verifique seu celular! Se não recebeu, clique em "Reenviar Códigos".
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Verificar Código
                  </>
                )}
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={handleResendCodes}
                  disabled={isLoading}
                  className="flex-1 h-10 text-sm"
                >
                  Reenviar Códigos
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setStep('phone')}
                  disabled={isLoading}
                  className="flex-1 h-10 text-sm"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CONECTADO */}
        {step === 'connected' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-green-600" />
              <p className="font-semibold text-lg text-green-900 mb-1">
                🎉 Conectado com Sucesso!
              </p>
              <p className="text-sm text-green-700 mb-3">{phoneNumber}</p>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                  <MessageCircle className="w-5 h-5 mx-auto mb-1 text-green-700" />
                  <p className="text-xs text-green-800 font-semibold">WhatsApp ✓</p>
                </div>
                <div className="bg-blue-100 px-3 py-2 rounded-lg border border-blue-300">
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-blue-700" />
                  <p className="text-xs text-blue-800 font-semibold">SMS ✓</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                onClick={handleTestMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Mensagem de Teste
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleDisconnect}
              >
                Desconectar
              </Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle2, Loader2, MessageCircle, Send, AlertCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

export function WhatsAppBusinessConnect() {
  const [step, setStep] = useState<'setup' | 'loading' | 'qr' | 'connected'>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [errorDetails, setErrorDetails] = useState('');
  
  // Teste
  const [testNumber, setTestNumber] = useState('');
  const [testMessage, setTestMessage] = useState('Olá! Esta é uma mensagem de teste do Tá Pago.pt 🎉');
  
  // Status da conexão
  const [connectedPhone, setConnectedPhone] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');

  useEffect(() => {
    checkConnection();
    checkEvolutionConfig();
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  const checkEvolutionConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${SERVER_URL}/whatsapp-qr-check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.configured || !data.connected) {
          console.warn('⚠️ Evolution API não está configurada corretamente');
          setErrorDetails(data.error || 'Evolution API não configurada');
        } else {
          console.log('✅ Evolution API configurada e conectada!');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar configuração:', error);
    }
  };

  const checkConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      console.log('🔍 Verificando conexão WhatsApp...');

      const res = await fetch(`${SERVER_URL}/whatsapp-qr-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('📊 Status:', data);
        
        if (data.connected) {
          setConnectedPhone(data.phoneNumber || 'WhatsApp Conectado');
          setStep('connected');
          setConnectionStatus('Conectado e ativo');
        } else if (data.qr) {
          setQrCode(data.qr);
          setStep('qr');
          startPolling();
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar conexão:', error);
    }
  };

  const handleGenerateQR = async () => {
    setStep('loading');
    setIsLoading(true);
    toast.loading('Gerando QR Code...', { id: 'qr' });

    console.log('═══════════════════════════════════════');
    console.log('📱 [FRONTEND] INÍCIO - Gerar QR Code');
    console.log('═══════════════════════════════════════');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.error('❌ [FRONTEND] Token não encontrado');
        toast.error('Sessão expirada. Faça login novamente.', { id: 'qr' });
        setStep('setup');
        setIsLoading(false);
        return;
      }

      console.log('✅ [FRONTEND] Token obtido');
      console.log('📡 [FRONTEND] Fazendo requisição para:', `${SERVER_URL}/whatsapp-qr-generate`);

      const startTime = Date.now();
      const res = await fetch(`${SERVER_URL}/whatsapp-qr-generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const requestTime = Date.now() - startTime;
      console.log(`📡 [FRONTEND] Resposta recebida em ${requestTime}ms`);
      console.log('📡 [FRONTEND] Status:', res.status, res.statusText);

      let data;
      try {
        const textResponse = await res.text();
        console.log('📡 [FRONTEND] Resposta (primeiros 200 chars):', textResponse.substring(0, 200));
        
        data = JSON.parse(textResponse);
        console.log('📡 [FRONTEND] Resposta (parsed):', data);
      } catch (parseError: any) {
        console.error('❌ [FRONTEND] Erro ao fazer parse da resposta:', parseError);
        toast.error('Erro ao processar resposta do servidor', { id: 'qr' });
        setStep('setup');
        setIsLoading(false);
        return;
      }

      if (res.ok && data.qr) {
        console.log('✅ [FRONTEND] QR Code recebido!');
        console.log('✅ [FRONTEND] QR Type:', typeof data.qr);
        console.log('✅ [FRONTEND] QR Preview:', data.qr.substring(0, 100) + '...');
        
        setQrCode(data.qr);
        setStep('qr');
        toast.success('QR Code gerado! Escaneie com seu WhatsApp.', { id: 'qr' });
        startPolling();
        
        console.log('═══════════════════════════════════════');
        console.log('✅ [FRONTEND] SUCESSO - QR Code exibido');
        console.log('═══════════════════════════════════════');
        
      } else if (res.ok && data.connected) {
        console.log('✅ [FRONTEND] Já conectado!');
        setConnectedPhone(data.phoneNumber || 'WhatsApp');
        setStep('connected');
        toast.success('WhatsApp já está conectado!', { id: 'qr' });
        
      } else {
        console.error('❌ [FRONTEND] Erro na resposta');
        console.error('❌ Status:', res.status);
        console.error('❌ Data:', data);
        console.error('❌ Error:', data.error);
        console.error('❌ Details:', data.details);
        
        let errorMessage = data.error || 'Erro ao gerar QR Code';
        
        if (data.details) {
          errorMessage += `\n\nDetalhes: ${data.details}`;
        }
        
        toast.error(errorMessage, { 
          id: 'qr',
          duration: 10000
        });
        
        setStep('setup');
      }
    } catch (error: any) {
      console.error('❌ [FRONTEND] ERRO FATAL no catch');
      console.error('❌ Nome:', error.name);
      console.error('❌ Mensagem:', error.message);
      console.error('❌ Stack:', error.stack);
      
      const errorMsg = `Erro: ${error.message}`;
      toast.error(errorMsg, { id: 'qr', duration: 10000 });
      
      setStep('setup');
      
      console.log('═══════════════════════════════════════');
      console.log('❌ [FRONTEND] FIM COM ERRO');
      console.log('═══════════════════════════════════════');
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    console.log('🔄 Iniciando polling...');
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) return;

        const res = await fetch(`${SERVER_URL}/whatsapp-qr-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          
          if (data.connected) {
            console.log('🎉 WhatsApp conectado!');
            setConnectedPhone(data.phoneNumber || 'WhatsApp');
            setStep('connected');
            setConnectionStatus('Conectado e ativo');
            toast.success('✅ WhatsApp conectado com sucesso!');
            clearInterval(interval);
            setPollingInterval(null);
          } else if (data.qr && data.qr !== qrCode) {
            console.log('🔄 QR Code atualizado');
            setQrCode(data.qr);
          }
        }
      } catch (error) {
        console.error('❌ Erro no polling:', error);
      }
    }, 3000);

    setPollingInterval(interval as any);
  };

  const handleSendTest = async () => {
    if (!testNumber || !testMessage) {
      toast.error('Preencha o número e a mensagem');
      return;
    }

    setIsLoading(true);
    toast.loading('Enviando mensagem...', { id: 'send' });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${SERVER_URL}/whatsapp-qr-send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: testNumber,
          message: testMessage
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Mensagem enviada com sucesso!', { id: 'send' });
        setTestNumber('');
      } else {
        toast.error(data.error || 'Erro ao enviar mensagem', { id: 'send' });
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar:', error);
      toast.error('Erro ao enviar mensagem', { id: 'send' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Deseja realmente desconectar o WhatsApp?')) return;

    toast.loading('Desconectando...', { id: 'disconnect' });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${SERVER_URL}/whatsapp-qr-disconnect`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        toast.success('WhatsApp desconectado!', { id: 'disconnect' });
        setStep('setup');
        setQrCode('');
        setConnectedPhone('');
        setConnectionStatus('');
        
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao desconectar', { id: 'disconnect' });
      }
    } catch (error) {
      console.error('❌ Erro ao desconectar:', error);
      toast.error('Erro ao desconectar', { id: 'disconnect' });
    }
  };

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Business
        </CardTitle>
        <CardDescription>
          {step === 'setup' && 'Conecte sua conta WhatsApp via QR Code'}
          {step === 'loading' && 'Gerando QR Code...'}
          {step === 'qr' && 'Escaneie o QR Code com seu WhatsApp'}
          {step === 'connected' && '✅ WhatsApp conectado e funcionando!'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* PASSO 1: SETUP */}
        {step === 'setup' && (
          <div className="space-y-4">
            <div className="bg-white border-2 border-green-300 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Como Funciona
              </h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600 min-w-[20px]">1.</span>
                  <span>Clique em "Gerar QR Code" abaixo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600 min-w-[20px]">2.</span>
                  <span>Abra o WhatsApp no seu telemóvel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600 min-w-[20px]">3.</span>
                  <span>Toque em Menu (⋮) → Dispositivos conectados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600 min-w-[20px]">4.</span>
                  <span>Toque em "Conectar um dispositivo"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600 min-w-[20px]">5.</span>
                  <span>Aponte a câmara para o QR Code que aparecerá aqui</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-600 min-w-[20px]">6.</span>
                  <span>Pronto! Poderá enviar mensagens automaticamente</span>
                </li>
              </ol>
            </div>

            <Button
              onClick={handleGenerateQR}
              className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Gerar QR Code
            </Button>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">💡 Importante:</p>
                  <p>A conexão é feita diretamente com o seu WhatsApp pessoal ou comercial. Todas as mensagens serão enviadas pela sua conta.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 2: LOADING */}
        {step === 'loading' && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 mx-auto text-green-600 animate-spin mb-4" />
            <p className="text-gray-700 font-semibold">A gerar QR Code...</p>
            <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
          </div>
        )}

        {/* PASSO 3: QR CODE */}
        {step === 'qr' && qrCode && (
          <div className="space-y-6">
            <div className="bg-white border-4 border-green-400 rounded-2xl p-8">
              <div className="flex justify-center">
                {qrCode.startsWith('data:image') ? (
                  <img 
                    src={qrCode} 
                    alt="QR Code WhatsApp" 
                    className="w-[280px] h-[280px]"
                  />
                ) : (
                  <div className="bg-white p-4 rounded-xl">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrCode)}`}
                      alt="QR Code WhatsApp"
                      className="w-[280px] h-[280px]"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-semibold text-green-900">
                    Aguardando leitura do QR Code...
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Abra o WhatsApp no telemóvel e escaneie este código
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3">
                📱 Passos para Escanear
              </h3>
              <ol className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">1.</span>
                  <span>Abra o WhatsApp no seu telemóvel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">2.</span>
                  <span>Menu (⋮) → Dispositivos conectados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">3.</span>
                  <span>Toque em "Conectar um dispositivo"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-[20px]">4.</span>
                  <span>Aponte a câmara para o QR Code acima</span>
                </li>
              </ol>
            </div>

            <Button
              onClick={handleGenerateQR}
              variant="outline"
              className="w-full"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Gerar Novo QR Code
            </Button>
          </div>
        )}

        {/* PASSO 4: CONECTADO */}
        {step === 'connected' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-20 h-20 mx-auto text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold text-green-900 mb-2">
                🎉 WhatsApp Conectado!
              </h3>
              <p className="text-green-700 mb-2">
                {connectedPhone}
              </p>
              <p className="text-sm text-green-600">
                {connectionStatus || 'Sua conta está ativa e pronta para usar!'}
              </p>

              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-900 font-semibold mb-2">
                  ✅ O que pode fazer agora:
                </p>
                <ul className="text-xs text-green-800 space-y-1 text-left">
                  <li>✓ Enviar mensagens automáticas de cobrança</li>
                  <li>✓ Configurar a Régua de Cobrança com WhatsApp</li>
                  <li>✓ Enviar notificações e lembretes aos clientes</li>
                  <li>✓ Testar o envio abaixo antes de ativar automações</li>
                </ul>
              </div>
            </div>

            {/* Teste de Envio */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Testar Envio de Mensagem
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="testNumber" className="text-sm font-semibold">
                    Número do destinatário
                  </Label>
                  <Input
                    id="testNumber"
                    type="text"
                    placeholder="351912345678 (código país + número, sem +)"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    💡 Formato: código do país + número (ex: 351912345678 para Portugal)
                  </p>
                </div>

                <div>
                  <Label htmlFor="testMessage" className="text-sm font-semibold">
                    Mensagem de teste
                  </Label>
                  <Input
                    id="testMessage"
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendTest}
                    disabled={isLoading || !testNumber}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A enviar...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Desconectar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Smartphone } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'react-toastify';
import { Zap } from 'lucide-react';

interface WhatsAppQRConnectProps {
  onConnected?: (phoneNumber: string) => void;
}

type ConnectionStatus = 'idle' | 'generating' | 'waiting_scan' | 'connected' | 'expired' | 'error';

export function WhatsAppQRConnect({ onConnected }: WhatsAppQRConnectProps) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  // Verificar status ao montar
  useEffect(() => {
    checkStatus();
  }, []);

  // Polling para verificar se QR Code foi escaneado
  useEffect(() => {
    if (status === 'waiting_scan' && !polling) {
      setPolling(true);
      const interval = setInterval(async () => {
        await checkStatus();
      }, 3000); // Verifica a cada 3 segundos

      return () => {
        clearInterval(interval);
        setPolling(false);
      };
    }
  }, [status]);

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/status`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      const data = await response.json();

      if (data.status === 'connected') {
        setStatus('connected');
        setPhoneNumber(data.phoneNumber);
        setQrCode(null);
        if (onConnected) {
          onConnected(data.phoneNumber);
        }
      } else if (data.status === 'waiting_scan') {
        setStatus('waiting_scan');
        setQrCode(data.qrCode);
      } else if (data.status === 'expired') {
        setStatus('expired');
        setQrCode(null);
      } else if (data.status === 'not_started') {
        setStatus('idle');
        setQrCode(null);
      }
    } catch (err: any) {
      console.error('Erro ao verificar status:', err);
    }
  };

  const generateQRCode = async () => {
    try {
      setStatus('generating');
      setError(null);
      setQrCode(null);

      const token = localStorage.getItem('access_token');
      
      console.log('');
      console.log('🔷 ========================================');
      console.log('🔷 [FRONTEND] INÍCIO - GERAR QR CODE');
      console.log('🔷 ========================================');
      console.log('🔍 Token:', token ? `Presente (${token.substring(0, 20)}...)` : '❌ AUSENTE');
      console.log('🔍 Project ID:', projectId);
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/generate`;
      console.log('🔍 URL completa:', url);
      console.log('🔍 Método: POST');
      console.log('🔍 Headers:', {
        'Authorization': token ? 'Bearer ***' : 'AUSENTE',
        'Content-Type': 'application/json',
      });
      
      console.log('');
      console.log('📡 Enviando requisição...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('');
      console.log('📥 Resposta recebida:');
      console.log('  - Status:', response.status);
      console.log('  - Status Text:', response.statusText);
      console.log('  - OK:', response.ok);
      console.log('  - Headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('');
      console.log('📄 Corpo da resposta (raw):', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { error: responseText };
        }
        
        console.error('');
        console.error('❌ [FRONTEND] ERRO DO SERVIDOR:');
        console.error('❌ Status:', response.status);
        console.error('❌ Dados:', errorData);
        console.log('🔷 ========================================');
        
        // Mensagem específica para Evolution API não configurada
        if (errorData.error?.includes('Evolution API') || errorData.details || errorData.instructions) {
          let errorMsg = errorData.error || 'Erro ao gerar QR Code';
          
          if (errorData.instructions) {
            errorMsg += '\n\nInstruções:\n' + errorData.instructions.join('\n');
          }
          
          if (errorData.links) {
            errorMsg += '\n\nLinks úteis:\n';
            errorMsg += `• Evolution Cloud: ${errorData.links.evolutionCloud}\n`;
            errorMsg += `• Documentação: ${errorData.links.docs}`;
          }
          
          if (errorData.evolutionUrl) {
            errorMsg += `\n\nURL atual: ${errorData.evolutionUrl}`;
          }
          
          throw new Error(errorMsg);
        }
        
        throw new Error(errorData.error || 'Erro ao gerar QR Code');
      }

      const data = JSON.parse(responseText);
      console.log('');
      console.log('✅ [FRONTEND] SUCESSO:');
      console.log('  - QR Code recebido:', data.qrCode ? `SIM (${data.qrCode.length} chars)` : 'NÃO');
      console.log('  - Instance:', data.instanceName || 'N/A');
      console.log('  - Message:', data.message);
      console.log('  - Dados completos:', data);
      console.log('🔷 ========================================');
      console.log('');
      
      setQrCode(data.qrCode);
      setStatus('waiting_scan');
      
      toast.success('QR Code gerado! Escaneie com WhatsApp');
      
    } catch (err: any) {
      console.error('');
      console.error('❌❌❌ [FRONTEND] EXCEPTION:');
      console.error('❌ Message:', err.message);
      console.error('❌ Stack:', err.stack);
      console.log('🔷 ========================================');
      console.log('');
      
      setError(err.message);
      setStatus('error');
      
      toast.error('Erro ao gerar QR Code');
    }
  };

  const disconnect = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/disconnect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      setStatus('idle');
      setQrCode(null);
      setPhoneNumber(null);
    } catch (err: any) {
      console.error('Erro ao desconectar:', err);
    }
  };

  // Função de simulação (apenas para demo)
  const simulateScan = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/simulate-scan`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await checkStatus();
      }
    } catch (err: any) {
      console.error('Erro ao simular scan:', err);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <Card className="max-w-lg w-full p-8 bg-gradient-to-br from-white to-emerald-50/30 border-2 border-emerald-200/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-emerald-900 mb-2">Conectar WhatsApp Business</h2>
          <p className="text-emerald-700/70">
            Conecte a sua conta WhatsApp para enviar mensagens automáticas aos seus clientes
          </p>
        </div>

        {/* Status Idle */}
        {status === 'idle' && (
          <div className="space-y-6">
            {/* Aviso Evolution API */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-blue-900 mb-1">Evolution API Necessária</h4>
                  <p className="text-blue-700 text-sm mb-2">
                    Para conectar o WhatsApp de verdade, você precisa ter uma instância da Evolution API rodando.
                  </p>
                  <a 
                    href="https://evolution-api.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    → Configurar Evolution API (veja EVOLUTION_API_SETUP.md)
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h3 className="text-cyan-900 mb-2">Como funciona:</h3>
              <ol className="text-cyan-800 space-y-2 list-decimal list-inside">
                <li>Clique em "Gerar QR Code"</li>
                <li>Abra o WhatsApp no seu telemóvel</li>
                <li>Toque em Mais opções → Dispositivos conectados</li>
                <li>Escaneie o código QR</li>
              </ol>
            </div>

            {/* Diagnóstico */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-amber-800 text-sm">
                <strong>Debug:</strong> Token: {localStorage.getItem('access_token') ? '✅ Presente' : '❌ Ausente'} | 
                ProjectId: {projectId || '❌ Ausente'}
              </p>
            </div>

            <Button
              onClick={generateQRCode}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              size="lg"
            >
              Gerar QR Code
            </Button>
          </div>
        )}

        {/* Status Generating */}
        {status === 'generating' && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-emerald-700">A gerar QR Code...</p>
          </div>
        )}

        {/* Status Waiting Scan */}
        {status === 'waiting_scan' && qrCode && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={qrCode}
                    alt="QR Code WhatsApp"
                    className="w-64 h-64 rounded-lg border-4 border-emerald-500"
                  />
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-emerald-900 mb-2">
                  Escaneie este código com o WhatsApp
                </p>
                <p className="text-emerald-600">
                  O código expira em 5 minutos
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={generateQRCode}
                variant="outline"
                className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Novo
              </Button>
              <Button
                onClick={simulateScan}
                variant="outline"
                className="flex-1 border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              >
                Simular Conexão (Demo)
              </Button>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setStatus('idle')}
                variant="ghost"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Status Connected */}
        {status === 'connected' && phoneNumber && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-emerald-900 mb-2">Conectado com sucesso!</h3>
              <p className="text-emerald-700">
                WhatsApp: <span className="font-mono">{phoneNumber}</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                Evolution API - Conexão Real
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800">
                ✅ A sua conta WhatsApp está conectada. Agora o Tá Pago pode enviar mensagens em seu nome automaticamente.
              </p>
            </div>

            {/* Teste de Mensagem */}
            <div className="bg-white border border-emerald-200 rounded-lg p-4">
              <h4 className="text-emerald-900 mb-3">Testar Envio de Mensagem</h4>
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder="Número com DDI (ex: +351912345678)"
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  id="test-phone"
                />
                <textarea
                  placeholder="Digite a mensagem de teste..."
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none"
                  id="test-message"
                  defaultValue="Olá! Esta é uma mensagem de teste do Tá Pago.pt 🚀"
                />
                <Button
                  onClick={async () => {
                    const phone = (document.getElementById('test-phone') as HTMLInputElement).value;
                    const msg = (document.getElementById('test-message') as HTMLTextAreaElement).value;
                    
                    if (!phone || !msg) {
                      toast.error('Preencha o número e a mensagem');
                      return;
                    }

                    try {
                      const token = localStorage.getItem('access_token');
                      const response = await fetch(
                        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/send-test`,
                        {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ phoneNumber: phone, message: msg }),
                        }
                      );

                      if (response.ok) {
                        toast.success('Mensagem enviada com sucesso! 🎉');
                      } else {
                        const error = await response.json();
                        toast.error(`Erro: ${error.error}`);
                      }
                    } catch (err: any) {
                      toast.error(`Erro ao enviar: ${err.message}`);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Enviar Mensagem de Teste
                </Button>
              </div>
            </div>

            <Button
              onClick={disconnect}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
            >
              Desconectar WhatsApp
            </Button>
          </div>
        )}

        {/* Status Expired */}
        {status === 'expired' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-amber-900 mb-2">QR Code Expirado</h3>
              <p className="text-amber-700">
                O código QR expirou. Gere um novo para continuar.
              </p>
            </div>

            <Button
              onClick={generateQRCode}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            >
              Gerar Novo QR Code
            </Button>
          </div>
        )}

        {/* Status Error */}
        {status === 'error' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-red-900 mb-2">Erro ao Conectar</h3>
              <div className="text-red-700 text-sm max-w-md mx-auto whitespace-pre-line bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                {error}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-blue-900 mb-2">📋 Como Resolver:</h4>
              <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                <li>Aceda ao painel Supabase</li>
                <li>Vá em Settings → Edge Functions → Secrets</li>
                <li>Adicione EVOLUTION_API_URL e EVOLUTION_API_KEY</li>
                <li>Exemplo: https://sua-instancia.evolution-api.com</li>
              </ol>
              <a 
                href="https://evolution-api.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm block mt-2"
              >
                → Criar instância Evolution API
              </a>
            </div>

            <Button
              onClick={generateQRCode}
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
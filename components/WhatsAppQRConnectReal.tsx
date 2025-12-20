import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Smartphone, AlertCircle, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface WhatsAppQRConnectRealProps {
  onConnected?: (phoneNumber: string) => void;
}

type ConnectionStatus = 'idle' | 'not_configured' | 'generating' | 'waiting_scan' | 'connected' | 'error';

export function WhatsAppQRConnectReal({ onConnected }: WhatsAppQRConnectRealProps) {
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

      if (response.status === 503) {
        const data = await response.json();
        if (data.status === 'not_configured') {
          setStatus('not_configured');
          return;
        }
      }

      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      const data = await response.json();
      
      if (data.connected && data.phone) {
        setStatus('connected');
        setPhoneNumber(data.phone);
        if (onConnected) {
          onConnected(data.phone);
        }
      } else if (data.status === 'qr_ready') {
        setStatus('waiting_scan');
      }
      
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const handleGenerateQR = async () => {
    setStatus('generating');
    setError(null);
    setQrCode(null);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      console.log('📱 Requisitando QR Code...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/generate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      console.log('📊 Resposta do servidor:', { status: response.status, data });

      if (!response.ok) {
        // Verificar se é erro de configuração
        if (response.status === 503) {
          setStatus('not_configured');
          console.log('⚙️ Servidor WhatsApp não configurado ainda');
          return;
        }
        
        throw new Error(data.error || data.details || 'Erro ao gerar QR Code');
      }

      // Já está conectado
      if (data.connected) {
        setStatus('connected');
        setPhoneNumber(data.phone);
        toast.success('WhatsApp já está conectado!', {
          description: `Número: ${data.phone}`
        });
        if (onConnected) {
          onConnected(data.phone);
        }
        return;
      }

      // QR Code gerado
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setStatus('waiting_scan');
        toast.success('QR Code gerado!', {
          description: 'Escaneie com seu WhatsApp'
        });
        return;
      }

      // QR Code ainda não está pronto
      if (response.status === 202) {
        toast.info('Aguarde...', {
          description: 'QR Code está a ser gerado'
        });
        // Tentar novamente em 2 segundos
        setTimeout(handleGenerateQR, 2000);
        return;
      }

    } catch (error: any) {
      console.error('❌ Erro ao gerar QR Code:', error);
      setStatus('error');
      setError(error.message);
      toast.error('Erro ao gerar QR Code', {
        description: error.message
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/disconnect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao desconectar');
      }

      setStatus('idle');
      setPhoneNumber(null);
      setQrCode(null);
      
      toast.success('WhatsApp desconectado');
      
    } catch (error: any) {
      console.error('Erro ao desconectar:', error);
      toast.error('Erro ao desconectar', {
        description: error.message
      });
    }
  };

  // Status: Servidor não configurado
  if (status === 'not_configured') {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Servidor WhatsApp Não Configurado
                </h3>
                <p className="text-amber-800 text-sm">
                  Para usar WhatsApp real, precisa configurar o servidor de mensagens.
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">📋 Configuração em 3 Passos:</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Deploy no Render (100% grátis)</p>
                    <a
                      href="https://render.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir Render.com
                    </a>
                    <p className="text-gray-600 text-xs mt-2">
                      Crie conta grátis → New Web Service → Conecte GitHub
                    </p>
                    <a
                      href="/DEPLOY_WHATSAPP_RENDER.md"
                      target="_blank"
                      className="inline-flex items-center gap-1 mt-2 text-emerald-700 hover:text-emerald-900 text-xs font-medium"
                    >
                      📖 Ver guia completo de deploy
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Configure no Supabase</p>
                    <div className="mt-2 bg-gray-50 rounded p-3 text-xs font-mono">
                      <p className="text-gray-700 mb-1">Settings → Edge Functions → Secrets</p>
                      <p className="text-emerald-700">WHATSAPP_SERVER_URL = https://sua-url.onrender.com</p>
                      <p className="text-emerald-700">WHATSAPP_SERVER_KEY = tapago-whatsapp-secret-key-2024</p>
                    </div>
                    <a
                      href={`https://supabase.com/dashboard/project/${projectId}/settings/functions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 text-emerald-700 hover:text-emerald-900 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir Configurações Supabase
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Recarregue esta página</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Aguarde 1-2 minutos após configurar as secrets, depois recarregue
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recarregar Página
              </Button>
              
              <Button
                onClick={() => window.open('/whatsapp-server/README.md', '_blank')}
                variant="outline"
                className="flex-1"
              >
                Ver Documentação
              </Button>
            </div>
          </div>
        </Card>

        {/* Dica */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-cyan-900 mb-1">💰 Custo: Praticamente Grátis!</h4>
              <p className="text-cyan-800 text-sm">
                Railway oferece $5 de crédito mensal grátis. O servidor usa ~$3-4/mês.
                Suficiente para milhares de mensagens!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Status conectado
  if (status === 'connected' && phoneNumber) {
    return (
      <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-cyan-50">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">WhatsApp Conectado</h3>
                <p className="text-emerald-700 text-sm">{phoneNumber}</p>
              </div>
            </div>
            
            <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
              Online
            </div>
          </div>

          <div className="bg-white/80 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Status</p>
                <p className="text-gray-900 font-medium">Ativo 24/7</p>
              </div>
              <div>
                <p className="text-gray-600">Servidor</p>
                <p className="text-gray-900 font-medium">Online</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              Desconectar
            </Button>
            
            <Button
              onClick={checkStatus}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Status aguardando scan
  if (status === 'waiting_scan' && qrCode) {
    return (
      <Card className="border-2 border-cyan-300">
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-emerald-900 mb-2">
              Escaneie o QR Code
            </h3>
            <p className="text-emerald-700 text-sm">
              Abra o WhatsApp no telemóvel e escaneie o código
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-xl border-4 border-emerald-200 shadow-lg">
              <img 
                src={qrCode} 
                alt="QR Code WhatsApp" 
                className="w-64 h-64"
              />
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <Smartphone className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-cyan-900">
                <p className="font-semibold mb-2">Como escanear:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abra o WhatsApp no telemóvel</li>
                  <li>Toque em Menu (⋮) → Dispositivos conectados</li>
                  <li>Toque em "Conectar um dispositivo"</li>
                  <li>Aponte a câmara para este código</li>
                </ol>
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setStatus('idle');
              setQrCode(null);
            }}
            variant="outline"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </Card>
    );
  }

  // Status inicial ou erro
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Erro</h4>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-2 border-emerald-300">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-emerald-900 mb-2">
              Conectar WhatsApp Business
            </h3>
            <p className="text-emerald-700 text-sm">
              Gere um QR Code para conectar sua conta WhatsApp
            </p>
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={status === 'generating'}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            size="lg"
          >
            {status === 'generating' ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                A gerar QR Code...
              </>
            ) : (
              <>
                <Smartphone className="w-5 h-5 mr-2" />
                Gerar QR Code Real
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
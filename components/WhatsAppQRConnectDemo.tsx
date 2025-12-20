import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, CheckCircle2, XCircle, RefreshCw, Smartphone, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WhatsAppQRConnectDemoProps {
  onConnected?: (phoneNumber: string) => void;
}

type ConnectionStatus = 'idle' | 'generating' | 'waiting_scan' | 'connected' | 'error';

export function WhatsAppQRConnectDemo({ onConnected }: WhatsAppQRConnectDemoProps) {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [showRealModeInfo, setShowRealModeInfo] = useState(false);

  // Verificar se já está conectado (localStorage)
  useEffect(() => {
    const savedPhone = localStorage.getItem('whatsapp_demo_phone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setStatus('connected');
    }
  }, []);

  const generateDemoQR = () => {
    setStatus('generating');
    setError(null);
    
    console.log('🎭 [MODO DEMO] Gerando QR Code simulado...');
    
    // Simular delay de geração
    setTimeout(() => {
      // QR Code demo - aponta para WhatsApp Web (não conecta de verdade)
      const demoQR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMCAyMGgxNnYxNkgyMHpNNTIgMjBoMTZ2MTZINTJ6TTg0IDIwaDE2djE2SDg0ek0xMTYgMjBoMTZ2MTZoLTE2ek0xNDggMjBoMTZ2MTZoLTE2ek0yMCA1MmgxNnYxNkgyMHpNODQgNTJoMTZ2MTZIODR6TTE0OCA1MmgxNnYxNmgtMTZ6TTIwIDg0aDE2djE2SDIwek01MiA4NGgxNnYxNkg1MnpNODQgODRoMTZ2MTZIODR6TTExNiA4NGgxNnYxNmgtMTZ6TTE0OCA4NGgxNnYxNmgtMTZ6TTIwIDExNmgxNnYxNkgyMHpNODQgMTE2aDE2djE2SDg0ek0xNDggMTE2aDE2djE2aC0xNnpNMjAgMTQ4aDE2djE2SDIwek01MiAxNDhoMTZ2MTZINTJ6TTg0IDE0OGgxNnYxNkg4NHpNMTE2IDE0OGgxNnYxNmgtMTZ6TTE0OCAxNDhoMTZ2MTZoLTE2eiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==';
      
      setQrCode(demoQR);
      setStatus('waiting_scan');
      console.log('✅ [MODO DEMO] QR Code gerado');
      
      toast.success('🎭 Modo Demo: QR Code simulado gerado!', {
        description: 'Clique em "Simular Conexão" para testar a interface'
      });

      // Auto-conectar após 5 segundos (demo)
      setTimeout(() => {
        if (demoMode) {
          simulateConnection();
        }
      }, 5000);
    }, 1500);
  };

  const simulateConnection = () => {
    console.log('🎭 [MODO DEMO] Simulando conexão...');
    
    const demoPhone = '+351 912 345 678';
    setPhoneNumber(demoPhone);
    setStatus('connected');
    
    // Salvar no localStorage
    localStorage.setItem('whatsapp_demo_phone', demoPhone);
    localStorage.setItem('whatsapp_demo_connected', 'true');
    
    toast.success('✅ WhatsApp Conectado (Demo)!', {
      description: `Número: ${demoPhone}`
    });
    
    console.log('✅ [MODO DEMO] Conexão simulada com sucesso');
    
    if (onConnected) {
      onConnected(demoPhone);
    }
  };

  const handleDisconnect = () => {
    console.log('🎭 [MODO DEMO] Desconectando...');
    
    setStatus('idle');
    setPhoneNumber(null);
    setQrCode(null);
    
    localStorage.removeItem('whatsapp_demo_phone');
    localStorage.removeItem('whatsapp_demo_connected');
    
    toast.info('WhatsApp desconectado (Demo)');
  };

  const [error, setError] = useState<string | null>(null);

  // Status conectado
  if (status === 'connected' && phoneNumber) {
    return (
      <div className="space-y-4">
        {/* Banner Modo Demo */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-1">🎭 Modo Demonstração Ativo</h4>
              <p className="text-purple-800 text-sm mb-2">
                Esta é uma conexão simulada para você testar a interface. Mensagens não serão enviadas de verdade.
              </p>
              <button
                onClick={() => setShowRealModeInfo(!showRealModeInfo)}
                className="text-purple-700 text-sm font-medium hover:text-purple-900 underline"
              >
                {showRealModeInfo ? 'Ocultar' : 'Como ativar modo real?'}
              </button>
              
              {showRealModeInfo && (
                <div className="mt-3 bg-white/50 rounded-lg p-3 text-sm text-purple-900 space-y-2">
                  <p className="font-semibold">Para conectar WhatsApp real:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Configure a Evolution API (Docker ou provedor hospedado)</li>
                    <li>Adicione as secrets no Supabase:
                      <ul className="ml-6 mt-1 text-xs">
                        <li>• <code className="bg-purple-100 px-1 rounded">EVOLUTION_API_URL</code></li>
                        <li>• <code className="bg-purple-100 px-1 rounded">EVOLUTION_API_KEY</code></li>
                      </ul>
                    </li>
                    <li>Desconecte o modo demo</li>
                    <li>Gere um novo QR Code</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status de Conexão */}
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
                  <p className="text-gray-900 font-medium">Ativo (Demo)</p>
                </div>
                <div>
                  <p className="text-gray-600">Mensagens Enviadas</p>
                  <p className="text-gray-900 font-medium">0 (Demo)</p>
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
                onClick={() => toast.info('🎭 Função disponível apenas no modo real')}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </Card>

        {/* Instruções */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-cyan-900 mb-1">Como Usar o Modo Demo</h4>
              <ul className="text-cyan-800 text-sm space-y-1">
                <li>✅ Você pode criar e configurar réguas de cobrança</li>
                <li>✅ Pode testar toda a interface do sistema</li>
                <li>✅ Pode pré-visualizar mensagens</li>
                <li>⚠️ Mensagens NÃO serão enviadas de verdade</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Status aguardando scan
  if (status === 'waiting_scan' && qrCode) {
    return (
      <div className="space-y-4">
        {/* Banner Modo Demo */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-semibold text-purple-900">🎭 Modo Demonstração</h4>
              <p className="text-purple-800 text-sm">
                QR Code simulado - conexão automática em alguns segundos
              </p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-cyan-300">
          <div className="p-6">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-emerald-900 mb-2">
                Escaneie o QR Code (Demo)
              </h3>
              <p className="text-emerald-700 text-sm">
                Modo demo: conectando automaticamente...
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="bg-white p-4 rounded-xl border-4 border-emerald-200 shadow-lg">
                  <img 
                    src={qrCode} 
                    alt="QR Code WhatsApp Demo" 
                    className="w-64 h-64"
                  />
                </div>
                
                {/* Badge Demo */}
                <div className="absolute -top-3 -right-3 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  DEMO
                </div>
                
                {/* Animação de scanning */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-1 bg-emerald-400/30 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Smartphone className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-cyan-900">
                  <p className="font-semibold mb-1">Modo Demo:</p>
                  <p>
                    Aguarde alguns segundos para conexão automática, ou clique no botão abaixo.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={simulateConnection}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Simular Conexão Agora
              </Button>
              
              <Button
                onClick={() => {
                  setStatus('idle');
                  setQrCode(null);
                }}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Status inicial ou erro
  return (
    <div className="space-y-4">
      {/* Banner Modo Demo */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-purple-900 mb-1">🎭 Modo Demonstração Disponível</h4>
            <p className="text-purple-800 text-sm mb-3">
              Como a Evolution API ainda não está configurada, você pode usar o <strong>Modo Demo</strong> para testar toda a interface do sistema!
            </p>
            
            <div className="bg-white/60 rounded-lg p-3 text-sm text-purple-900 space-y-2">
              <p className="font-semibold">✨ No modo demo você pode:</p>
              <ul className="space-y-1 ml-4">
                <li>✅ Conectar um WhatsApp simulado</li>
                <li>✅ Criar réguas de cobrança</li>
                <li>✅ Configurar mensagens automáticas</li>
                <li>✅ Testar toda a interface</li>
                <li>⚠️ Mensagens não serão enviadas de verdade</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

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
            onClick={generateDemoQR}
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
                <Sparkles className="w-5 h-5 mr-2" />
                Gerar QR Code (Modo Demo)
              </>
            )}
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowRealModeInfo(!showRealModeInfo)}
              className="text-emerald-700 text-sm hover:text-emerald-900 underline"
            >
              Como configurar WhatsApp real?
            </button>
            
            {showRealModeInfo && (
              <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-left text-sm text-emerald-900">
                <p className="font-semibold mb-2">Para usar WhatsApp real:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Configure Evolution API (Docker ou hospedado)</li>
                  <li>Adicione secrets no Supabase:
                    <ul className="ml-6 mt-1 text-xs">
                      <li>• <code className="bg-emerald-100 px-1 rounded">EVOLUTION_API_URL</code></li>
                      <li>• <code className="bg-emerald-100 px-1 rounded">EVOLUTION_API_KEY</code></li>
                    </ul>
                  </li>
                  <li>Recarregue a página</li>
                </ol>
                <a 
                  href="?test=whatsapp" 
                  className="inline-block mt-3 text-emerald-700 hover:text-emerald-900 font-medium"
                >
                  → Ver página de diagnóstico
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Dica */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-cyan-900 mb-1">💡 Dica</h4>
            <p className="text-cyan-800 text-sm">
              O modo demo é perfeito para você conhecer o sistema, configurar suas réguas de cobrança 
              e preparar tudo antes de conectar o WhatsApp real!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

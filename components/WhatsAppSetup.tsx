import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Loader2, RefreshCw, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';
import { WhatsAppConnectionGuide } from './WhatsAppConnectionGuide';

type ConnectionStatus = 'disconnected' | 'qr_ready' | 'connecting' | 'connected';

export function WhatsAppSetup() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [qrCode, setQrCode] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  // Polling para verificar se QR foi escaneado
  useEffect(() => {
    let interval: any = null;
    
    if (status === 'qr_ready' && qrCode) {
      interval = setInterval(async () => {
        await checkConnection();
      }, 2000); // Verifica a cada 2 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, qrCode]);

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
          setStatus('connected');
          setPhoneNumber(data.phoneNumber);
          setQrCode('');
        } else if (data.status === 'qr_ready' && data.qrCode) {
          setStatus('qr_ready');
          setQrCode(data.qrCode);
        } else {
          setStatus('disconnected');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/whatsapp-qr-start`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao gerar QR Code');
      }

      const data = await res.json();
      
      setQrCode(data.qrCode);
      setStatus('qr_ready');
      
      toast.success('QR Code gerado! Escaneie com seu WhatsApp');
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshQR = async () => {
    setQrCode('');
    setStatus('disconnected');
    await handleConnect();
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
        setStatus('disconnected');
        setQrCode('');
        setPhoneNumber('');
        toast.success('WhatsApp desconectado');
      }
    } catch (error: any) {
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  const handleSimulateScan = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/whatsapp-qr-simulate-scan`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setStatus('connected');
        setPhoneNumber(data.phoneNumber);
        setQrCode('');
        toast.success('✅ WhatsApp conectado! (Simulação)');
      }
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  // Tela inicial - Desconectado
  if (status === 'disconnected') {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Botão para mostrar guia */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowGuide(!showGuide)}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {showGuide ? 'Ocultar Guia de Conexão Real' : 'Como conectar o WhatsApp REALMENTE?'}
          </Button>
        </div>

        {/* Guia de Conexão */}
        {showGuide && <WhatsAppConnectionGuide />}

        <Card className="shadow-xl border-2 border-slate-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50">
            <CardTitle className="text-emerald-700 flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              Conectar WhatsApp Business
            </CardTitle>
            <CardDescription>
              Escaneie o QR Code com o WhatsApp do seu telemóvel
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {/* Aviso de Demonstração */}
            <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    🧪 Modo de Demonstração
                  </p>
                  <p className="text-sm text-blue-800">
                    O QR Code gerado é apenas para demonstração visual. 
                    Para testar o sistema, use o botão <strong>"Simular Scan"</strong> após gerar o QR.
                    Para conectar realmente o WhatsApp, <button 
                      onClick={() => setShowGuide(true)}
                      className="underline font-bold hover:text-blue-900"
                    >
                      veja o guia acima
                    </button>.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="bg-slate-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-16 h-16 text-slate-400" />
              </div>

              <div className="space-y-3">
                <h3 className="text-slate-700 font-semibold">
                  Como conectar:
                </h3>
                <ol className="text-left max-w-md mx-auto space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</span>
                    <span>Abra o WhatsApp no seu telemóvel</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</span>
                    <span>Toque em <strong>Definições</strong> &gt; <strong>Aparelhos ligados</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</span>
                    <span>Toque em <strong>Ligar um aparelho</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</span>
                    <span>Aponte a câmara para o QR Code que será gerado</span>
                  </li>
                </ol>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    A gerar QR Code...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-5 h-5 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // QR Code pronto
  if (status === 'qr_ready' && qrCode) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              Escaneie o QR Code
            </CardTitle>
            <CardDescription>
              Abra o WhatsApp e escaneie este código
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              {/* QR Code - Tamanho maior e melhor qualidade */}
              <div className="bg-white p-8 rounded-2xl border-4 border-blue-200 inline-block shadow-2xl">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="w-80 h-80 mx-auto"
                  style={{
                    imageRendering: 'crisp-edges',
                    imageRendering: '-moz-crisp-edges',
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                  crossOrigin="anonymous"
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-semibold">A aguardar scan...</span>
              </div>

              {/* Instruções Detalhadas */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-sm font-bold text-blue-900 mb-3">
                  📱 Como escanear no WhatsApp:
                </p>
                <ol className="text-sm text-blue-800 text-left space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Abra o <strong>WhatsApp</strong> no seu telemóvel</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Toque em <strong>⋮ Menu</strong> (Android) ou <strong>Definições</strong> (iOS)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Selecione <strong>Aparelhos ligados</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Toque em <strong>Ligar um aparelho</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">5.</span>
                    <span>Aponte a câmara para <strong>este QR Code</strong></span>
                  </li>
                </ol>
              </div>

              {/* Alerta importante */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Importante:
                    </p>
                    <p className="text-xs text-amber-800">
                      • Certifique-se de ter boa iluminação<br/>
                      • Mantenha o telemóvel estável<br/>
                      • O QR expira em 3 minutos<br/>
                      • Use a conta WhatsApp da empresa
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de atualizar */}
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleRefreshQR}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gerar novo QR
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatus('disconnected');
                    setQrCode('');
                  }}
                >
                  Cancelar
                </Button>
              </div>

              {/* Botão de teste (apenas desenvolvimento) */}
              <div className="border-t-2 border-dashed border-amber-200 pt-4 mt-2">
                <p className="text-xs text-amber-700 mb-2">🧪 Modo de Teste:</p>
                <Button
                  variant="outline"
                  onClick={handleSimulateScan}
                  size="sm"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Simular Scan do QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conectado
  if (status === 'connected') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-xl border-2 border-emerald-200">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              
              <h2 className="text-emerald-700 text-3xl mb-3">
                ✅ WhatsApp Conectado!
              </h2>
              
              <p className="text-lg text-slate-700 mb-2 font-semibold">{phoneNumber}</p>
              
              <div className="inline-block bg-emerald-100 px-6 py-3 rounded-full border-2 border-emerald-300 mb-8">
                <p className="text-sm text-emerald-800 font-semibold">
                  ✅ Pronto para enviar mensagens
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="text-blue-900 font-semibold mb-2">
                  Conexão estabelecida com sucesso!
                </p>
                <p className="text-sm text-blue-800">
                  O sistema está pronto para enviar mensagens de cobrança através do WhatsApp.
                </p>
              </div>

              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 px-8"
                onClick={handleDisconnect}
              >
                Desconectar WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de carregamento
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );
}
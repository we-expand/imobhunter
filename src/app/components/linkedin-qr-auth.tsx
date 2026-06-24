import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Linkedin, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Smartphone,
  QrCode,
  RefreshCw,
  LogOut,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import QRCode from 'qrcode';

const LINKEDIN_AUTH_API = `https://${projectId}.supabase.co/functions/v1/make-server-v2/linkedin-auth`;

interface LinkedInUser {
  sub: string;
  name: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  email: string;
  emailVerified?: boolean;
}

interface LinkedInAuthProps {
  onConnected?: (user: LinkedInUser) => void;
  onDisconnected?: () => void;
}

export function LinkedInQRAuth({ onConnected, onDisconnected }: LinkedInAuthProps) {
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [authUrl, setAuthUrl] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [connected, setConnected] = useState(false);
  const [user, setUser] = useState<LinkedInUser | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [checking, setChecking] = useState(false);

  // Verificar status ao carregar
  useEffect(() => {
    const savedSessionId = localStorage.getItem('linkedin_session_id');
    if (savedSessionId) {
      checkConnectionStatus(savedSessionId);
    }
  }, []);

  // Polling para verificar se usuário conectou
  useEffect(() => {
    if (sessionId && !connected) {
      const interval = setInterval(() => {
        checkConnectionStatus(sessionId);
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [sessionId, connected]);

  // Listener para mensagem do popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'LINKEDIN_CONNECTED') {
        const { sessionId: newSessionId, user: connectedUser } = event.data;
        handleConnectionSuccess(newSessionId, connectedUser);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /**
   * Gerar QR Code para autenticação
   */
  const generateQRCode = async () => {
    try {
      setLoading(true);
      console.log('🔗 Gerando QR Code para LinkedIn...');

      const response = await fetch(`${LINKEDIN_AUTH_API}/generate-qr`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao gerar QR Code');
      }

      const data = await response.json();

      if (data.success && data.authUrl) {
        setAuthUrl(data.authUrl);
        setSessionId(data.sessionId);
        localStorage.setItem('linkedin_session_id', data.sessionId);

        // Gerar QR Code
        const qrDataUrl = await QRCode.toDataURL(data.authUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#0077B5', // LinkedIn blue
            light: '#FFFFFF'
          }
        });

        setQrCodeUrl(qrDataUrl);

        toast.success('✅ QR Code gerado!', {
          description: 'Escaneie com seu celular para conectar'
        });
      } else {
        throw new Error('Resposta inválida do servidor');
      }

    } catch (error: any) {
      console.error('❌ Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificar status da conexão
   */
  const checkConnectionStatus = async (sid: string) => {
    try {
      setChecking(true);
      const response = await fetch(`${LINKEDIN_AUTH_API}/status/${sid}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar status');
      }

      const data = await response.json();

      if (data.connected && data.user) {
        handleConnectionSuccess(sid, data.user);
        setExpiresAt(data.expiresAt);
      } else if (data.expired) {
        // Token expirou
        toast.warning('⏰ Sessão expirada', {
          description: 'Gere um novo QR Code para reconectar'
        });
        handleDisconnect();
      }

    } catch (error: any) {
      console.error('❌ Erro ao verificar status:', error);
    } finally {
      setChecking(false);
    }
  };

  /**
   * Sucesso na conexão
   */
  const handleConnectionSuccess = (sid: string, connectedUser: LinkedInUser) => {
    setConnected(true);
    setUser(connectedUser);
    setSessionId(sid);
    localStorage.setItem('linkedin_session_id', sid);
    localStorage.setItem('linkedin_user', JSON.stringify(connectedUser));

    toast.success('🎉 LinkedIn conectado!', {
      description: `Bem-vindo, ${connectedUser.name}!`
    });

    if (onConnected) {
      onConnected(connectedUser);
    }
  };

  /**
   * Desconectar LinkedIn
   */
  const handleDisconnect = async () => {
    try {
      if (sessionId) {
        await fetch(`${LINKEDIN_AUTH_API}/disconnect/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
      }

      setConnected(false);
      setUser(null);
      setSessionId('');
      setQrCodeUrl('');
      setAuthUrl('');
      setExpiresAt('');
      
      localStorage.removeItem('linkedin_session_id');
      localStorage.removeItem('linkedin_user');

      toast.info('👋 LinkedIn desconectado');

      if (onDisconnected) {
        onDisconnected();
      }

    } catch (error: any) {
      console.error('❌ Erro ao desconectar:', error);
      toast.error('Erro ao desconectar');
    }
  };

  /**
   * Abrir em popup
   */
  const openInPopup = () => {
    if (!authUrl) return;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      authUrl,
      'linkedin-auth',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <Linkedin className="w-6 h-6 text-white" />
          </div>
          <span>Conectar LinkedIn</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!connected ? (
          <>
            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <QrCode className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Como funciona:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Clique em "Gerar QR Code"</li>
                    <li>Escaneie o código com seu celular</li>
                    <li>Faça login no LinkedIn</li>
                    <li>Autorize o acesso</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl ? (
              <div className="space-y-3">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="LinkedIn QR Code"
                    className="mx-auto rounded-lg shadow-lg"
                  />
                  
                  {checking && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Aguardando conexão...</span>
                    </div>
                  )}
                </div>

                {/* Botões alternativos */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={openInPopup}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Abrir em Popup
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={generateQRCode}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  QR Code expira em 10 minutos
                </p>
              </div>
            ) : (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={generateQRCode}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando QR Code...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <>
            {/* Conectado */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">LinkedIn Conectado!</p>
                  <p className="text-sm text-green-700">Todas as funcionalidades desbloqueadas</p>
                </div>
              </div>

              {/* Info do usuário */}
              {user && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <img 
                    src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.emailVerified && (
                      <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Expira em */}
              {expiresAt && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Sessão expira em: {new Date(expiresAt).toLocaleString('pt-PT')}
                </p>
              )}
            </div>

            {/* Botão de desconectar */}
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleDisconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Desconectar LinkedIn
            </Button>
          </>
        )}

        {/* Status da API */}
        <div className="text-xs text-center text-gray-500">
          <p>OAuth 2.0 oficial do LinkedIn</p>
          <p>✅ Seguro • 🔒 Criptografado • 🇪🇺 GDPR</p>
        </div>
      </CardContent>
    </Card>
  );
}
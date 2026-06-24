import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { accessProtection } from '../lib/access-protection';
import { Shield, Lock, AlertTriangle, CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';

interface AccessGateProps {
  onAccessGranted: () => void;
}

export function AccessGate({ onAccessGranted }: AccessGateProps) {
  const [token, setToken] = useState('');
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [autoChecking, setAutoChecking] = useState(true);

  // Verifica token da URL automaticamente
  useEffect(() => {
    const urlToken = accessProtection.getTokenFromURL();
    
    if (urlToken) {
      console.log('🔐 Token detectado na URL');
      validateAndProceed(urlToken);
    } else {
      setAutoChecking(false);
    }
  }, []);

  const validateAndProceed = async (tokenToValidate: string) => {
    setValidating(true);
    setError('');

    // Simula delay de validação
    await new Promise(resolve => setTimeout(resolve, 800));

    const validation = accessProtection.validateToken(tokenToValidate);

    if (validation.valid && validation.accessToken) {
      // Token válido - registra acesso
      accessProtection.registerAccess(tokenToValidate);
      
      // Limpa URL (remove token visível)
      accessProtection.cleanURL();
      
      console.log('✅ Acesso concedido:', validation.accessToken.clientName);
      
      // Concede acesso
      onAccessGranted();
    } else {
      setError(validation.reason || 'Token inválido');
      setValidating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Digite o token de acesso');
      return;
    }
    validateAndProceed(token.trim());
  };

  if (autoChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <p className="text-gray-600">Verificando acesso...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Acesso Protegido</CardTitle>
          <CardDescription className="text-base">
            Esta é uma área restrita. Insira seu token de acesso para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Acesso Negado</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token de Acesso</Label>
              <Input
                id="token"
                type="text"
                placeholder="Digite seu token..."
                value={token}
                onChange={(e) => setToken(e.target.value.toUpperCase())}
                disabled={validating}
                className="font-mono text-center tracking-wider"
                autoFocus
              />
              <p className="text-xs text-gray-600">
                O token foi enviado por email para você
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={validating || !token.trim()}
            >
              {validating ? (
                <>
                  <Shield className="w-4 h-4 mr-2 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Acessar Plataforma
                </>
              )}
            </Button>
          </form>

          <div className="border-t pt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Proteção de Privacidade
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Acesso limitado e temporário</li>
                    <li>• URL mascarada após validação</li>
                    <li>• Sessão criptografada e monitorada</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900">
                    Termos de Uso
                  </p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Não compartilhe seu token de acesso</li>
                    <li>• Screenshots são monitorados</li>
                    <li>• Conteúdo confidencial - NDA aplicável</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              🔒 Powered by ImobHunter Security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Watermark (overlay invisível mas presente)
export function SecurityWatermark() {
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    const token = accessProtection.getCurrentToken();
    setTokenData(token);

    // Detecta Print Screen (não previne, mas registra)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen, Cmd+Shift+3/4 (Mac), Windows+Shift+S
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) ||
        (e.metaKey && e.shiftKey && e.key === 's')
      ) {
        accessProtection.logScreenshotAttempt();
        console.warn('⚠️ Tentativa de screenshot registrada');
      }
    };

    // Detecta ferramentas de desenvolvedor abertas
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        console.warn('⚠️ DevTools detectado');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Previne context menu (botão direito)
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', preventContextMenu);

    // Previne seleção de texto sensível
    const preventSelection = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-sensitive]')) {
        e.preventDefault();
      }
    };
    document.addEventListener('selectstart', preventSelection);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelection);
    };
  }, []);

  if (!tokenData) return null;

  return (
    <>
      {/* Watermark invisível mas presente no DOM */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] select-none"
        style={{ 
          opacity: 0.02,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(0,0,0,0.01) 100px,
            rgba(0,0,0,0.01) 200px
          )`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform rotate-[-45deg] text-6xl font-bold text-gray-900 whitespace-nowrap opacity-10">
            {tokenData.email} • {new Date().toLocaleDateString('pt-PT')}
          </div>
        </div>
      </div>

      {/* Meta tags de proteção */}
      <div className="hidden" data-user-email={tokenData.email} data-access-time={new Date().toISOString()} />
    </>
  );
}

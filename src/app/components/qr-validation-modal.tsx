import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { GeminiNeuralBackground } from './gemini-neural-background';
import { authService } from '../lib/auth-service';
import { QrCode, Smartphone, CheckCircle, Shield, Camera, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import QRCode from 'qrcode';

interface QRValidationModalProps {
  user: any;
  onValidate: (user: any) => void;
  onCancel?: () => void;
}

export function QRValidationModal({ user, onValidate, onCancel }: QRValidationModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [currentDisplayCode, setCurrentDisplayCode] = useState(''); // Código de 6 dígitos visível
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDevCode, setShowDevCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Tempo restante até expiração
  const [qrAccepted, setQrAccepted] = useState(false); // Confirma que usuário leu o QR
  const [showManualEntry, setShowManualEntry] = useState(false); // Modo alternativo

  useEffect(() => {
    setupQRCode();
    
    // Timer para atualizar código a cada 30 segundos
    const interval = setInterval(() => {
      const seconds = Math.floor(Date.now() / 1000);
      const remaining = 30 - (seconds % 30);
      setTimeLeft(remaining);
      
      // Atualiza código quando chegar a 30 (novo período)
      if (remaining === 30) {
        setupQRCode();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const setupQRCode = async () => {
    // Gera secret único para o usuário
    let userSecret = user.twoFactorSecret;
    
    if (!userSecret) {
      userSecret = authService.generateTwoFactorSecret(user.email);
      setSecret(userSecret);
    } else {
      setSecret(userSecret);
    }

    setManualCode(userSecret);

    // Gera código TOTP atual (código de 6 dígitos)
    const currentCode = authService.generateCurrentTOTP(userSecret);
    setCurrentDisplayCode(currentCode); // Salva para exibir
    
    // QR Code no formato otpauth:// (padrão Google Authenticator)
    const issuer = 'LeadGen%20KW';
    const accountName = encodeURIComponent(user.email);
    const otpauthUrl = `otpauth://totp/${issuer}:${accountName}?secret=${userSecret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
    
    try {
      const dataUrl = await QRCode.toDataURL(otpauthUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  };

  const handleValidate = () => {
    // Remove espaços do código antes de validar
    const cleanCode = code.replace(/\s/g, '');
    
    console.log('🔍 DEBUG QR VALIDATION:');
    console.log('  - Código digitado:', code);
    console.log('  - Código limpo:', cleanCode);
    console.log('  - Secret:', secret);
    console.log('  - Código atual esperado:', authService.generateTOTP(secret));
    
    if (!cleanCode || cleanCode.length !== 6) {
      setError('Digite o código de 6 dígitos');
      return;
    }

    setIsValidating(true);
    setError('');

    setTimeout(() => {
      const isValid = authService.validateTOTP(secret, cleanCode);
      
      console.log('  - Validação:', isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO');

      if (isValid) {
        // Marca usuário como tendo 2FA ativado
        const users = JSON.parse(localStorage.getItem('app-users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        
        if (userIndex !== -1) {
          users[userIndex].twoFactorEnabled = true;
          users[userIndex].twoFactorSecret = secret;
          localStorage.setItem('app-users', JSON.stringify(users));
          
          // Atualiza current user
          const updatedUser = { ...user, twoFactorEnabled: true, twoFactorSecret: secret };
          localStorage.setItem('current-user', JSON.stringify(updatedUser));
        }

        toast.success('✅ Código validado com sucesso!');
        onValidate({ ...user, twoFactorEnabled: true, twoFactorSecret: secret });
      } else {
        const currentCode = authService.generateTOTP(secret);
        setError(`Código inválido. Código esperado: ${currentCode}`);
        toast.error('Código inválido. Tente novamente.');
        setCode('');
      }

      setIsValidating(false);
    }, 1000);
  };

  // Formata código com espaço: "123 456"
  const formatCode = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  };

  // Trata enter para validar
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleValidate();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(manualCode);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowDevCode = () => {
    const currentCode = authService.generateTOTP(secret);
    toast.info(`Código atual: ${currentCode}`, { 
      duration: 10000,
      description: 'Use este código para validar (válido por 30s)'
    });
    setShowDevCode(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <Card className="max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl mb-1">Validação de Segurança</h2>
          <p className="text-gray-600 text-xs">
            Configure a autenticação de 2 fatores
          </p>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-900 text-xs">
            <strong>📱 Como configurar:</strong><br/>
            1. Abra <strong>Google Authenticator</strong> ou <strong>Authy</strong> no celular<br/>
            2. Toque em "+" para adicionar conta<br/>
            3. Escolha "Escanear QR Code"<br/>
            4. Escaneie o código abaixo<br/>
            5. Digite o código de 6 dígitos gerado no app
          </AlertDescription>
        </Alert>

        {/* QR Code Visual - PRINCIPAL */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
            {!showManualEntry ? (
              <>
                <div className="bg-white p-4 rounded-lg shadow-inner flex items-center justify-center">
                  {qrCodeDataUrl ? (
                    <div className="text-center">
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code de Autenticação" 
                        className="mx-auto rounded-lg shadow-md"
                        style={{ width: '220px', height: '220px' }}
                      />
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Camera className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Escaneie com Google Authenticator</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center" style={{ width: '220px', height: '220px' }}>
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Botão para confirmar aceite do QR */}
                {qrCodeDataUrl && !qrAccepted && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setQrAccepted(true);
                        toast.success('✅ QR Code configurado! Agora digite o código gerado.');
                      }}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Escaneei o QR Code
                    </Button>
                  </div>
                )}
                
                {/* Timer de expiração */}
                {qrAccepted && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Código expira em {timeLeft}s</span>
                  </div>
                )}
                
                {/* Botão alternativo */}
                <div className="mt-4 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowManualEntry(true);
                      toast.info('📝 Modo manual ativado');
                    }}
                    className="text-xs"
                  >
                    Não consigo escanear o QR Code
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Modo Manual */}
                <div className="text-center">
                  <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-yellow-900 text-xs">
                      <strong>⚠️ Configuração Manual:</strong><br/>
                      1. Abra o Google Authenticator<br/>
                      2. Toque em \"+\" e escolha \"Inserir chave de configuração\"<br/>
                      3. Digite o código abaixo como chave<br/>
                      4. Nome da conta: {user.email}<br/>
                      5. Tipo de chave: Baseada em tempo
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-white p-6 rounded-lg shadow-inner">
                    <Label className="text-sm text-gray-600 mb-2 block">Chave Secreta:</Label>
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={manualCode}
                        readOnly
                        className="font-mono text-lg bg-gray-50 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => {
                        setQrAccepted(true);
                        toast.success('✅ Chave configurada! Agora digite o código gerado.');
                      }}
                      className="w-full gap-2 mb-3"
                      variant="outline"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Configurei a Chave Manualmente
                    </Button>
                  </div>
                  
                  {/* Timer de expiração */}
                  {qrAccepted && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Código expira em {timeLeft}s</span>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowManualEntry(false);
                        setQrAccepted(false);
                      }}
                      className="text-xs"
                    >
                      Voltar para QR Code
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Código Manual (alternativa) - REMOVIDO, já está integrado acima */}

        <div className="border-t pt-6 mb-4">
          <Label className="mb-2 block">Código de 6 dígitos</Label>
          <p className="text-xs text-gray-500 mb-4">
            Após escanear, digite o código exibido no celular e pressione ENTER
          </p>
          
          {/* Input moderno com espaçamento visual */}
          <div className="relative">
            <Input
              type="text"
              placeholder="000 000"
              value={formatCode(code)}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              className="text-center text-3xl tracking-[0.5em] font-mono h-16 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all rounded-xl shadow-inner"
              maxLength={7}
              autoFocus
            />
            
            {/* Indicador de progresso */}
            <div className="flex justify-center gap-2 mt-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    code.length > i 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <Button
            onClick={handleValidate}
            disabled={isValidating || code.length !== 6}
            className="w-full gap-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Validar e Continuar
              </>
            )}
          </Button>

          {/* Dev: Mostrar código atual */}
          <Button
            type="button"
            variant="outline"
            onClick={handleShowDevCode}
            className="w-full text-xs"
          >
            🔧 Dev: Ver Código Atual
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full"
            >
              Cancelar
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Sua conta ficará protegida com autenticação de 2 fatores
        </p>
      </Card>
    </div>
  );
}
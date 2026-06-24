import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { X, Mail, ArrowLeft, CheckCircle, Key } from 'lucide-react';
import { toast } from 'sonner';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ open, onClose }: ResetPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSendResetEmail = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    setIsLoading(true);

    // Gera código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Simula envio de email (em produção, usar o emailService)
    setTimeout(() => {
      setIsLoading(false);
      toast.success('📧 Email enviado!', {
        description: `Código de recuperação enviado para ${email}`
      });
      setStep('code');

      // DEMO: Mostra código no console
      console.log(`🔑 [RESET PASSWORD] Código: ${code}`);
      toast.info(`🔑 DEMO: Código é ${code}`, {
        description: 'Em produção, será enviado por email',
        duration: 10000
      });
    }, 1500);
  };

  const handleVerifyCode = () => {
    if (resetCode !== generatedCode) {
      toast.error('❌ Código inválido', {
        description: 'Verifique o código e tente novamente'
      });
      return;
    }

    setStep('success');
    toast.success('✅ Senha redefinida!', {
      description: 'Uma nova senha foi enviada por email'
    });

    // Em produção: Gerar nova senha e enviar por email
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Recuperar Senha
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Digite seu email para receber o código de recuperação'}
            {step === 'code' && 'Digite o código enviado para seu email'}
            {step === 'success' && 'Senha redefinida com sucesso!'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="seu-email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendResetEmail()}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-900">
                  📧 Enviaremos um código de 6 dígitos para seu email
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendResetEmail}
                  disabled={isLoading}
                  className="flex-1 gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Enviar Código
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Código */}
          {step === 'code' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Recuperação</label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <p className="text-green-900">
                  ✅ Email enviado para <strong>{email}</strong>
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Verifique sua caixa de entrada e spam
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('email')}
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={resetCode.length !== 6}
                  className="flex-1 gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verificar
                </Button>
              </div>

              <button
                onClick={handleSendResetEmail}
                className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Não recebeu? Reenviar código
              </button>
            </>
          )}

          {/* Step 3: Sucesso */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Senha Redefinida!
              </h3>
              <p className="text-gray-600 mb-4">
                Uma nova senha temporária foi enviada para seu email.
              </p>
              <p className="text-sm text-gray-500">
                Você será redirecionado em alguns segundos...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
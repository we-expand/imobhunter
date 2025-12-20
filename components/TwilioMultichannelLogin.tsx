import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MessageCircle, Mail, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

type Step = 'phone' | 'channel' | 'code' | 'success';
type Channel = 'sms' | 'whatsapp';

export function TwilioMultichannelLogin() {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+351');
  const [selectedChannel, setSelectedChannel] = useState<Channel>('whatsapp');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Digite um número válido');
      return;
    }

    setIsLoading(true);
    toast.loading('Enviando código...', { id: 'send' });

    try {
      const res = await fetch(`${SERVER_URL}/verify-send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          channel: selectedChannel
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: 'send' });
        setStep('code');
      } else {
        toast.error(data.error || 'Erro ao enviar código', { id: 'send' });
      }
    } catch (error: any) {
      toast.error('Erro ao enviar código', { id: 'send' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 4) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    toast.loading('Verificando código...', { id: 'verify' });

    try {
      const res = await fetch(`${SERVER_URL}/verify-check-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode
        })
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        toast.success('✅ Código verificado! Entrando...', { id: 'verify' });
        
        // Fazer login com o token gerado
        if (data.accessToken) {
          // Extrair token da URL do magic link
          const urlParams = new URLSearchParams(data.accessToken.split('#')[1] || data.accessToken.split('?')[1]);
          const accessToken = urlParams.get('access_token');
          const refreshToken = urlParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (!error) {
              setStep('success');
              setTimeout(() => {
                window.location.href = '/';
              }, 1500);
            } else {
              toast.error('Erro ao fazer login', { id: 'verify' });
            }
          }
        }
      } else {
        toast.error(data.message || 'Código incorreto', { id: 'verify' });
      }
    } catch (error: any) {
      toast.error('Erro ao verificar código', { id: 'verify' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 p-4">
      <Card className="w-full max-w-md border-2 border-emerald-200 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Tá Pago.pt
          </CardTitle>
          <CardDescription>
            {step === 'phone' && 'Digite seu número de telefone'}
            {step === 'channel' && 'Escolha como receber o código'}
            {step === 'code' && 'Digite o código recebido'}
            {step === 'success' && 'Login realizado com sucesso!'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* PASSO 1: NÚMERO DE TELEFONE */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Número de Telefone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+351912345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 h-12 text-lg"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1">
                  Inclua o código do país (ex: +351 para Portugal)
                </p>
              </div>

              <Button
                onClick={() => setStep('channel')}
                disabled={phoneNumber.length < 10}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* PASSO 2: ESCOLHER CANAL */}
          {step === 'channel' && (
            <div className="space-y-4">
              <div className="text-center text-sm text-slate-600 mb-4">
                Enviar código para: <strong>{phoneNumber}</strong>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep('phone')}
                  className="ml-2"
                >
                  Alterar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* WHATSAPP */}
                <button
                  onClick={() => setSelectedChannel('whatsapp')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedChannel === 'whatsapp'
                      ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${
                    selectedChannel === 'whatsapp' ? 'text-green-600' : 'text-slate-400'
                  }`} />
                  <p className={`font-semibold ${
                    selectedChannel === 'whatsapp' ? 'text-green-900' : 'text-slate-600'
                  }`}>
                    WhatsApp
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Mais rápido
                  </p>
                </button>

                {/* SMS */}
                <button
                  onClick={() => setSelectedChannel('sms')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedChannel === 'sms'
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <Smartphone className={`w-8 h-8 mx-auto mb-2 ${
                    selectedChannel === 'sms' ? 'text-blue-600' : 'text-slate-400'
                  }`} />
                  <p className={`font-semibold ${
                    selectedChannel === 'sms' ? 'text-blue-900' : 'text-slate-600'
                  }`}>
                    SMS
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Tradicional
                  </p>
                </button>
              </div>

              <Button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Código
                  </>
                )}
              </Button>
            </div>
          )}

          {/* PASSO 3: DIGITAR CÓDIGO */}
          {step === 'code' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 rounded-lg p-4 text-center">
                <p className="text-sm text-emerald-800">
                  Código enviado via <strong>{selectedChannel === 'sms' ? 'SMS' : 'WhatsApp'}</strong> para:
                </p>
                <p className="font-semibold text-emerald-900 mt-1">
                  {phoneNumber}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setStep('channel')}
                  className="mt-2 text-xs"
                >
                  Reenviar código
                </Button>
              </div>

              <div>
                <Label htmlFor="code" className="text-sm font-semibold">
                  Código de Verificação
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-2 h-14 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  autoFocus
                />
              </div>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length < 4}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Verificar Código
                  </>
                )}
              </Button>
            </div>
          )}

          {/* SUCESSO */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-20 h-20 mx-auto text-green-600 animate-bounce" />
              <h3 className="text-2xl font-semibold text-green-900">
                Bem-vindo!
              </h3>
              <p className="text-slate-600">
                Redirecionando para o dashboard...
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

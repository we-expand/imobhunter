import { useState, useEffect } from 'react';
import { Phone, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

export function SMSSetup() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/sms/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setIsConnected(true);
          setFormData({
            accountSid: data.accountSid || '',
            authToken: '********',
            phoneNumber: data.phoneNumber || ''
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar SMS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.accountSid || !formData.authToken || !formData.phoneNumber) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/sms/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao conectar SMS');
      }

      setIsConnected(true);
      toast.success('✅ SMS conectado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/sms/disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setIsConnected(false);
        setFormData({ accountSid: '', authToken: '', phoneNumber: '' });
        toast.success('SMS desconectado');
      }
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-cyan-700">
            <Phone className="w-5 h-5" />
            Configurar SMS (Twilio)
          </CardTitle>
          <CardDescription>
            Configure sua conta Twilio para enviar SMS
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {!isConnected ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account SID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🔑 Account SID
                </label>
                <input
                  type="text"
                  value={formData.accountSid}
                  onChange={(e) => setFormData({ ...formData, accountSid: e.target.value })}
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Encontre no painel da Twilio em Console Dashboard
                </p>
              </div>

              {/* Auth Token */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🔒 Auth Token
                </label>
                <input
                  type="password"
                  value={formData.authToken}
                  onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                  placeholder="••••••••••••••••••••••••••••••••"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Token de autenticação da sua conta Twilio
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  📱 Número Twilio
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+351912345678"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-cyan-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Seu número Twilio no formato internacional (+351...)
                </p>
              </div>

              {/* Info */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <p className="text-sm text-cyan-900 font-semibold mb-2">
                  📚 Como obter suas credenciais:
                </p>
                <ol className="text-sm text-cyan-800 space-y-2 list-decimal list-inside">
                  <li>Acesse <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="underline font-semibold">twilio.com/console</a></li>
                  <li>Copie o Account SID e Auth Token</li>
                  <li>Compre um número em Phone Numbers {'>'} Buy a Number</li>
                  <li>Cole as credenciais acima</li>
                </ol>
              </div>

              {/* Botão */}
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    A conectar...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Conectar SMS
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 mx-auto text-cyan-600 mb-6" />
              <p className="font-semibold text-cyan-700 text-2xl mb-3">
                ✅ SMS Conectado!
              </p>
              <p className="text-lg text-cyan-600 mb-2">{formData.phoneNumber}</p>
              <div className="inline-block bg-cyan-100 px-6 py-3 rounded-full border-2 border-cyan-300 mb-6">
                <p className="text-sm text-cyan-800 font-semibold">
                  📱 Twilio Ativo
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-emerald-900">
                  ✅ Pronto para enviar SMS de cobrança!
                </p>
              </div>

              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDisconnect}
              >
                Desconectar SMS
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

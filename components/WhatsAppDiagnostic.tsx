import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Phone,
  MessageSquare,
  Settings,
  Info
} from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function WhatsAppDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  const runDiagnostic = async () => {
    if (!testPhone || testPhone.length < 9) {
      toast.error('Insira um número válido');
      return;
    }

    setTesting(true);
    setDiagnosticResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Faça login primeiro');
        return;
      }

      console.log('🔍 Iniciando diagnóstico WhatsApp...');

      // Envia código de teste
      const res = await fetch(`${API_URL}/whatsapp/send-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber: testPhone })
      });

      const data = await res.json();
      
      console.log('📊 Resultado:', data);

      setDiagnosticResult({
        success: res.ok,
        statusCode: res.status,
        ...data
      });

      if (res.ok && data.success) {
        toast.success('Código enviado! Verifique seu telefone.');
      } else {
        toast.error(data.error || 'Erro ao enviar código');
      }

    } catch (error: any) {
      console.error('❌ Erro no diagnóstico:', error);
      setDiagnosticResult({
        success: false,
        error: error.message
      });
      toast.error('Erro ao executar diagnóstico');
    } finally {
      setTesting(false);
    }
  };

  const checkEnvironment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/whatsapp/check-config`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      const data = await res.json();
      
      setDiagnosticResult({
        configCheck: true,
        ...data
      });

      if (data.allConfigured) {
        toast.success('✅ Todas as configurações OK!');
      } else {
        toast.warning('⚠️ Algumas configurações estão faltando');
      }

    } catch (error) {
      toast.error('Erro ao verificar configurações');
    }
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Settings className="w-5 h-5" />
          Diagnóstico WhatsApp
        </CardTitle>
        <CardDescription>
          Ferramenta de diagnóstico para identificar problemas no envio
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Verificar Configuração */}
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            1. Verificar Variáveis de Ambiente
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Primeiro passo: verificar se as credenciais Twilio estão configuradas
          </p>
          <Button
            onClick={checkEnvironment}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Settings className="w-4 h-4 mr-2" />
            Verificar Configuração
          </Button>
        </div>

        {/* Teste de Envio */}
        <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            2. Testar Envio de Código
          </h3>
          <p className="text-sm text-purple-700 mb-3">
            Enviar código de teste para seu número
          </p>
          <div className="flex gap-2">
            <Input
              type="tel"
              placeholder="912345678 ou +351912345678"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="border-purple-300"
            />
            <Button
              onClick={runDiagnostic}
              disabled={testing}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Enviar Teste
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Resultado do Diagnóstico */}
        {diagnosticResult && (
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">Resultado do Diagnóstico:</h3>
            
            {/* Configuração */}
            {diagnosticResult.configCheck && (
              <div className="space-y-2">
                <ConfigItem 
                  label="TWILIO_ACCOUNT_SID" 
                  configured={diagnosticResult.hasTwilioAccountSid}
                />
                <ConfigItem 
                  label="TWILIO_AUTH_TOKEN" 
                  configured={diagnosticResult.hasTwilioAuthToken}
                />
                <ConfigItem 
                  label="TWILIO_PHONE_NUMBER (SMS)" 
                  configured={diagnosticResult.hasTwilioPhoneNumber}
                  value={diagnosticResult.twilioPhoneNumber}
                />
                <ConfigItem 
                  label="TWILIO_WHATSAPP_NUMBER" 
                  configured={diagnosticResult.hasTwilioWhatsAppNumber}
                  value={diagnosticResult.twilioWhatsAppNumber}
                />
              </div>
            )}

            {/* Status do Envio */}
            {diagnosticResult.success !== undefined && (
              <div className={`p-4 border-2 rounded-lg ${
                diagnosticResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {diagnosticResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    diagnosticResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {diagnosticResult.success ? 'Envio Realizado' : 'Falha no Envio'}
                  </span>
                </div>

                {/* Canais de Envio */}
                {diagnosticResult.channels && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-semibold text-slate-700">Canais utilizados:</p>
                    {diagnosticResult.sentViaSMS && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">SMS enviado</span>
                      </div>
                    )}
                    {diagnosticResult.sentViaWhatsApp && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">WhatsApp enviado</span>
                      </div>
                    )}
                    {!diagnosticResult.sentViaSMS && !diagnosticResult.sentViaWhatsApp && (
                      <div className="flex items-center gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-700">Nenhum canal funcionou</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Código Gerado */}
                {diagnosticResult.code && (
                  <div className="mt-3 p-2 bg-white rounded border border-slate-300">
                    <p className="text-xs text-slate-600">Código gerado (apenas em desenvolvimento):</p>
                    <p className="text-lg font-mono font-bold text-slate-900">{diagnosticResult.code}</p>
                  </div>
                )}

                {/* Erro */}
                {diagnosticResult.error && (
                  <div className="mt-2 text-sm text-red-700">
                    <p className="font-semibold">Erro:</p>
                    <p className="font-mono text-xs">{diagnosticResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Guia de Solução */}
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Problemas Comuns
          </h3>
          <div className="space-y-2 text-sm text-amber-800">
            <div>
              <p className="font-semibold">❌ Não recebe código no WhatsApp:</p>
              <ul className="list-disc list-inside pl-2 text-xs space-y-1 mt-1">
                <li>Variável TWILIO_WHATSAPP_NUMBER não configurada</li>
                <li>Número não ativou sandbox Twilio WhatsApp</li>
                <li>Formato: deve ser <code className="bg-amber-100 px-1 rounded">whatsapp:+14155238886</code></li>
              </ul>
            </div>
            
            <div className="mt-3">
              <p className="font-semibold">✅ Solução Rápida:</p>
              <ul className="list-disc list-inside pl-2 text-xs space-y-1 mt-1">
                <li>Use apenas SMS (já configurado)</li>
                <li>Configure WhatsApp sandbox em: <a href="https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn" target="_blank" className="underline">Twilio Console</a></li>
                <li>Envie "join [palavra]" para +1 415 523 8886 no WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfigItem({ label, configured, value }: { label: string; configured: boolean; value?: string }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded border ${
      configured ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        {configured ? (
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        ) : (
          <XCircle className="w-4 h-4 text-red-600" />
        )}
        <span className={`text-sm font-mono ${
          configured ? 'text-green-800' : 'text-red-800'
        }`}>
          {label}
        </span>
      </div>
      {value && (
        <span className="text-xs text-slate-600 font-mono">{value}</span>
      )}
    </div>
  );
}

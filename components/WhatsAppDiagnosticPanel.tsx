import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Search, Send, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { API_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

interface DiagnosticResult {
  step: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

export function WhatsAppDiagnosticPanel() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setIsRunning(true);

    try {
      // 1. Verificar autenticação
      addResult({
        step: '1. Autenticação',
        status: 'info',
        message: 'Verificando sessão do utilizador...'
      });

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        addResult({
          step: '1. Autenticação',
          status: 'error',
          message: 'Sessão expirada - faça login novamente'
        });
        return;
      }

      addResult({
        step: '1. Autenticação',
        status: 'success',
        message: 'Sessão válida',
        details: { userId: session.user?.id }
      });

      // 2. Verificar configuração do WhatsApp
      addResult({
        step: '2. Configuração WhatsApp',
        status: 'info',
        message: 'Verificando credenciais da API...'
      });

      const configRes = await fetch(`${API_URL}/whatsapp-config`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const configData = await configRes.json();
      console.log('📋 Config do WhatsApp:', configData);

      if (!configRes.ok || !configData.config) {
        addResult({
          step: '2. Configuração WhatsApp',
          status: 'error',
          message: 'WhatsApp não configurado',
          details: configData
        });
        return;
      }

      const config = configData.config;

      if (!config.connected) {
        addResult({
          step: '2. Configuração WhatsApp',
          status: 'error',
          message: 'WhatsApp não está conectado',
          details: config
        });
        return;
      }

      if (!config.accessToken || !config.phoneNumberId) {
        addResult({
          step: '2. Configuração WhatsApp',
          status: 'error',
          message: 'Credenciais incompletas',
          details: {
            hasAccessToken: !!config.accessToken,
            hasPhoneNumberId: !!config.phoneNumberId
          }
        });
        return;
      }

      addResult({
        step: '2. Configuração WhatsApp',
        status: 'success',
        message: 'Credenciais encontradas',
        details: {
          phoneNumberId: config.phoneNumberId,
          tokenLength: config.accessToken?.length || 0
        }
      });

      // 3. Validar número de telefone
      if (!phoneNumber || phoneNumber.trim().length === 0) {
        addResult({
          step: '3. Número de Telefone',
          status: 'error',
          message: 'Digite um número de telefone'
        });
        return;
      }

      const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
      
      addResult({
        step: '3. Número de Telefone',
        status: 'success',
        message: `Número formatado: +${cleanNumber}`,
        details: { original: phoneNumber, cleaned: cleanNumber }
      });

      // 4. Testar API do WhatsApp diretamente
      addResult({
        step: '4. Teste da API WhatsApp',
        status: 'info',
        message: 'Enviando requisição para WhatsApp Business API...'
      });

      const whatsappApiUrl = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;
      
      const testPayload = {
        messaging_product: 'whatsapp',
        to: cleanNumber,
        type: 'text',
        text: {
          body: `🔧 TESTE DE DIAGNÓSTICO - Tá Pago.pt\n\nHora: ${new Date().toLocaleString('pt-PT')}\n\nSe recebeu esta mensagem, a integração está a funcionar! ✅`
        }
      };

      console.log('📤 Enviando para WhatsApp API:', {
        url: whatsappApiUrl,
        payload: testPayload
      });

      const whatsappRes = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      const whatsappData = await whatsappRes.json();
      
      console.log('📨 Resposta da WhatsApp API:', {
        status: whatsappRes.status,
        statusText: whatsappRes.statusText,
        data: whatsappData
      });

      if (!whatsappRes.ok) {
        addResult({
          step: '4. Teste da API WhatsApp',
          status: 'error',
          message: `Erro da API: ${whatsappData.error?.message || 'Erro desconhecido'}`,
          details: whatsappData
        });

        // Verificar erros comuns
        if (whatsappData.error?.code === 190) {
          addResult({
            step: '💡 Diagnóstico',
            status: 'warning',
            message: 'Token de acesso inválido ou expirado. Reconfigure o WhatsApp Business API.'
          });
        } else if (whatsappData.error?.code === 100) {
          addResult({
            step: '💡 Diagnóstico',
            status: 'warning',
            message: 'Phone Number ID inválido. Verifique as credenciais.'
          });
        } else if (whatsappData.error?.error_subcode === 2388132) {
          addResult({
            step: '💡 Diagnóstico',
            status: 'warning',
            message: 'Número de destino não válido ou não está no WhatsApp.'
          });
        }

        return;
      }

      addResult({
        step: '4. Teste da API WhatsApp',
        status: 'success',
        message: 'Mensagem enviada com sucesso!',
        details: {
          messageId: whatsappData.messages?.[0]?.id,
          response: whatsappData
        }
      });

      addResult({
        step: '✅ RESULTADO FINAL',
        status: 'success',
        message: 'Mensagem enviada! Verifique o WhatsApp.'
      });

      toast.success('✅ Mensagem enviada com sucesso!');

    } catch (error: any) {
      console.error('❌ Erro no diagnóstico:', error);
      addResult({
        step: 'ERRO',
        status: 'error',
        message: `Erro: ${error.message}`,
        details: error
      });
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
          <Search className="w-5 h-5" />
          Diagnóstico WhatsApp - Investigação Completa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input e Botão de Teste */}
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="+351 912 345 678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isRunning}
            className="flex-1"
          />
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A testar...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Iniciar Diagnóstico
              </>
            )}
          </Button>
        </div>

        {/* Dica sobre formato do número */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Use o formato internacional completo: <code className="bg-amber-100 px-1 rounded">+351912345678</code>
            <br />
            <span className="text-xs">• Portugal: +351 + 9 dígitos (ex: +351912345678)</span>
            <br />
            <span className="text-xs">• Brasil: +55 + DDD + número (ex: +5511999887766)</span>
          </div>
        </div>

        {/* Resultados do Diagnóstico */}
        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{result.step}</p>
                    <p className="text-sm text-gray-700 mt-1">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                          Ver detalhes técnicos
                        </summary>
                        <pre className="text-xs mt-2 p-2 bg-white rounded border overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instruções */}
        {results.length === 0 && (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Como funciona:
            </h4>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Digite o número de telefone (com código do país)</li>
              <li>Clique em "Iniciar Diagnóstico"</li>
              <li>Aguarde enquanto verificamos tudo</li>
              <li>Veja os resultados detalhados abaixo</li>
            </ol>
            <p className="text-xs text-gray-500 mt-3">
              💡 Este diagnóstico verifica: autenticação, configuração do WhatsApp, 
              credenciais da API e testa o envio direto.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
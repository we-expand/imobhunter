import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Send, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

export function WhatsAppDebugTest() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const handleTest = async () => {
    setIsLoading(true);
    setLogs([]);
    setResult(null);

    try {
      addLog('🚀 Iniciando teste de envio de código...');
      
      // Pegar token
      addLog('🔑 Obtendo token de autenticação...');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        addLog('❌ ERRO: Sem token de autenticação');
        return;
      }

      addLog(`✅ Token obtido: ${token.substring(0, 20)}...`);
      addLog(`📱 Enviando código para: ${phoneNumber}`);

      // Fazer requisição
      const url = `${API_URL}/whatsapp-send-verification`;
      addLog(`🌐 URL: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });

      addLog(`📊 Status HTTP: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`❌ ERRO na resposta: ${errorText}`);
        setResult({ error: true, message: errorText });
        return;
      }

      const data = await response.json();
      addLog(`✅ Resposta recebida!`);
      addLog(`📦 Dados: ${JSON.stringify(data, null, 2)}`);

      setResult(data);

      // Análise do resultado
      if (data.code) {
        addLog(`🧪 MODO DESENVOLVIMENTO ATIVO!`);
        addLog(`🔢 CÓDIGO: ${data.code}`);
      }

      if (data.sentViaSMS) {
        addLog(`✅ SMS enviado com sucesso!`);
      } else {
        addLog(`⚠️ SMS não enviado`);
      }

      if (data.sentViaWhatsApp) {
        addLog(`✅ WhatsApp enviado com sucesso!`);
      } else {
        addLog(`⚠️ WhatsApp não enviado`);
      }

      if (data.channels) {
        addLog(`📡 Canais usados: ${data.channels.join(', ')}`);
      }

    } catch (error: any) {
      addLog(`❌ ERRO CRÍTICO: ${error.message}`);
      console.error('Erro completo:', error);
      setResult({ error: true, message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          🧪 Teste de Debug WhatsApp
        </CardTitle>
        <CardDescription>
          Teste o envio de código com logs detalhados
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Input */}
        <div className="flex gap-3">
          <Input
            type="tel"
            placeholder="912345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleTest}
            disabled={isLoading || !phoneNumber}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A testar...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Testar
              </>
            )}
          </Button>
        </div>

        {/* Resultado */}
        {result && (
          <div className={`rounded-lg p-4 border-2 ${
            result.error 
              ? 'bg-red-50 border-red-200' 
              : result.code 
              ? 'bg-purple-50 border-purple-300'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            {result.error ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900 mb-1">❌ Erro</p>
                  <p className="text-sm text-red-800">{result.message}</p>
                </div>
              </div>
            ) : result.code ? (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-purple-900 mb-2">🧪 Modo Desenvolvimento</p>
                  <div className="bg-purple-100 rounded-lg p-4 border border-purple-300">
                    <p className="text-xs text-purple-700 mb-1">CÓDIGO DE VERIFICAÇÃO:</p>
                    <p className="text-3xl font-black text-purple-900 tracking-wider">
                      {result.code}
                    </p>
                  </div>
                  <p className="text-sm text-purple-800 mt-3">
                    Use este código para verificar o WhatsApp
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 mb-2">✅ Código Enviado!</p>
                  <div className="flex gap-2">
                    {result.sentViaSMS && (
                      <Badge className="bg-blue-100 text-blue-800">
                        📱 SMS
                      </Badge>
                    )}
                    {result.sentViaWhatsApp && (
                      <Badge className="bg-green-100 text-green-800">
                        💬 WhatsApp
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-emerald-400 font-mono text-xs mb-2">📋 Logs de Debug:</p>
            <div className="space-y-1">
              {logs.map((log, i) => (
                <p key={i} className="text-slate-300 font-mono text-xs">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            ℹ️ Como usar:
          </p>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Digite seu número de telefone</li>
            <li>Clique em "Testar"</li>
            <li>Veja os logs detalhados abaixo</li>
            <li>Se aparecer "CÓDIGO:", copie e use para verificar</li>
            <li>Se aparecer "SMS enviado", verifique seu telefone</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

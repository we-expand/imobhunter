import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Smartphone, AlertCircle } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

export function TestWhatsApp() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testAPI = async () => {
    setLogs([]);
    setLoading(true);

    try {
      addLog('🔷 ========== TESTE WHATSAPP API ==========');
      
      // 1. Verificar token
      const token = localStorage.getItem('access_token');
      addLog(`1️⃣ Token: ${token ? '✅ Presente (' + token.substring(0, 20) + '...)' : '❌ AUSENTE'}`);
      
      // 2. Verificar Project ID
      addLog(`2️⃣ Project ID: ${projectId || '❌ AUSENTE'}`);
      
      // 3. Montar URL
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp/qr/generate`;
      addLog(`3️⃣ URL: ${url}`);
      
      // 4. Fazer requisição
      addLog('4️⃣ Enviando requisição POST...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      addLog(`5️⃣ Status: ${response.status} ${response.statusText}`);
      addLog(`6️⃣ OK: ${response.ok ? '✅ SIM' : '❌ NÃO'}`);
      
      const responseText = await response.text();
      addLog(`7️⃣ Resposta (${responseText.length} chars):`);
      addLog('------- INÍCIO RESPOSTA -------');
      addLog(responseText);
      addLog('------- FIM RESPOSTA -------');

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          if (data.qrCode) {
            addLog('✅ QR Code recebido com sucesso!');
            addLog(`QR Code tem ${data.qrCode.length} caracteres`);
          } else {
            addLog('⚠️ Resposta OK mas sem QR Code');
          }
        } catch (e) {
          addLog('⚠️ Erro ao fazer parse do JSON');
        }
      } else {
        addLog('❌ Erro na requisição');
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.instructions) {
            addLog('📋 Instruções:');
            errorData.instructions.forEach((inst: string, i: number) => {
              addLog(`  ${i + 1}. ${inst}`);
            });
          }
          if (errorData.evolutionUrl) {
            addLog(`🔗 Evolution URL atual: ${errorData.evolutionUrl}`);
          }
        } catch (e) {
          // Não é JSON
        }
      }

      addLog('🔷 ========== FIM TESTE ==========');
      
    } catch (error: any) {
      addLog('❌❌❌ EXCEPTION:');
      addLog(`Erro: ${error.message}`);
      addLog(`Stack: ${error.stack}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Banner Modo Demo Disponível */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-purple-900 mb-2">🎭 Modo Demo Disponível!</h2>
              <p className="text-purple-800 mb-3">
                Enquanto você configura a Evolution API real, pode usar o <strong>Modo Demonstração</strong> para testar toda a interface do sistema!
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Ir para Modo Demo
              </a>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-900">Teste WhatsApp API</h1>
              <p className="text-emerald-700">Diagnóstico completo da integração</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Página de Diagnóstico</h3>
                <p className="text-amber-800 text-sm">
                  Esta página testa a conexão com a API do WhatsApp e mostra logs detalhados.
                  Útil para identificar problemas de configuração.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={testAPI}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
            size="lg"
          >
            {loading ? 'Testando...' : 'Testar Conexão WhatsApp'}
          </Button>
        </Card>

        {/* Logs */}
        {logs.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Logs do Teste</h2>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">
                    {log}
                  </div>
                ))}
              </pre>
            </div>
            
            <Button
              onClick={() => {
                const logsText = logs.join('\n');
                navigator.clipboard.writeText(logsText);
                alert('Logs copiados para área de transferência!');
              }}
              variant="outline"
              className="mt-4"
            >
              Copiar Logs
            </Button>
          </Card>
        )}

        {/* Instruções */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold text-emerald-900 mb-4">Configuração da Evolution API</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-emerald-800 mb-2">📋 Passo a Passo:</h3>
              <ol className="list-decimal list-inside text-emerald-700 space-y-2">
                <li>
                  <strong>Criar conta na Evolution API:</strong>
                  <br />
                  <a 
                    href="https://evolution-api.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline ml-6"
                  >
                    → https://evolution-api.com
                  </a>
                </li>
                <li>
                  <strong>Copiar URL e API Key da instância</strong>
                </li>
                <li>
                  <strong>No Supabase:</strong>
                  <br />
                  <span className="ml-6 text-sm">
                    Settings → Edge Functions → Secrets
                  </span>
                </li>
                <li>
                  <strong>Adicionar secrets:</strong>
                  <ul className="ml-6 mt-1 text-sm space-y-1">
                    <li>• <code className="bg-gray-100 px-1 rounded">EVOLUTION_API_URL</code> = sua URL completa (https://...)</li>
                    <li>• <code className="bg-gray-100 px-1 rounded">EVOLUTION_API_KEY</code> = sua chave API</li>
                  </ul>
                </li>
                <li>
                  <strong>Reiniciar Edge Functions</strong> (ou aguardar alguns segundos)
                </li>
                <li>
                  <strong>Testar novamente</strong> clicando no botão acima
                </li>
              </ol>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-900 mb-2">💡 Alternativa: Docker Local</h4>
              <p className="text-cyan-800 text-sm mb-2">
                Para testes rápidos, você pode rodar a Evolution API localmente:
              </p>
              <pre className="bg-cyan-900 text-cyan-100 p-3 rounded text-xs overflow-x-auto">
{`docker run -d \\
  --name evolution-api \\
  -p 8080:8080 \\
  -e AUTHENTICATION_API_KEY=minha-chave-123 \\
  atendai/evolution-api:latest`}
              </pre>
              <p className="text-cyan-800 text-sm mt-2">
                Depois configure:<br />
                • <code className="bg-cyan-100 px-1 rounded">EVOLUTION_API_URL</code> = <code className="bg-cyan-100 px-1 rounded">http://localhost:8080</code><br />
                • <code className="bg-cyan-100 px-1 rounded">EVOLUTION_API_KEY</code> = <code className="bg-cyan-100 px-1 rounded">minha-chave-123</code>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
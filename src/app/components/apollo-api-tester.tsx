import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Terminal,
  Key,
  AlertCircle
} from 'lucide-react';

export function ApolloAPITester() {
  const [apiKey, setApiKey] = useState('WfxZd4DzoL1Fgp5advhp8Q');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const testDirectApolloAPI = async () => {
    setTesting(true);
    setResult(null);
    setLogs([]);
    
    addLog('🚀 Iniciando teste VIA PROXY Supabase...');
    addLog(`🔑 API Key: ${apiKey.substring(0, 8)}...`);

    try {
      const projectId = 'evdyqlrssgsktctjruuq';
      const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzM0NTAsImV4cCI6MjA1NzkwOTQ1MH0.tTXuhxa_JJZm-R-wc2YFE7X5vXX3_oA0VEu-F2IEglg';
      
      addLog('📡 Chamando PROXY Supabase (sem problema de CORS)');
      
      const payload = {
        api_key: apiKey,
        q_keywords: 'CEO',
        page: 1,
        per_page: 5
      };

      addLog(`📦 Payload: ${JSON.stringify(payload, null, 2)}`);

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/apollo/search`;
      addLog(`🌐 URL: ${url}`);

      const proxyResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      addLog(`📥 Status HTTP: ${proxyResponse.status}`);

      if (!proxyResponse.ok) {
        const errorText = await proxyResponse.text();
        addLog(`❌ ERRO: ${errorText}`);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        setResult({
          success: false,
          status: proxyResponse.status,
          error: errorData.error || errorText,
          recommendation: proxyResponse.status === 401 
            ? '⚠️ API Key INVÁLIDA! A Apollo rejeitou esta chave. Acesse https://app.apollo.io/#/settings/integrations e obtenha uma chave válida.'
            : proxyResponse.status === 429
            ? '⚠️ Limite de requisições atingido. Aguarde alguns minutos.'
            : proxyResponse.status === 500
            ? '⚠️ Erro no servidor Supabase. Verifique se as Edge Functions estão deployadas.'
            : `⚠️ Erro ${proxyResponse.status}. Veja os logs para detalhes.`
        });
      } else {
        const data = await proxyResponse.json();
        addLog(`✅ SUCESSO!`);
        addLog(`📊 Response: ${JSON.stringify(data).substring(0, 300)}...`);
        
        const peopleCount = data?.data?.people?.length || 0;
        
        setResult({
          success: true,
          status: proxyResponse.status,
          data: data,
          peopleCount: peopleCount,
          recommendation: peopleCount > 0
            ? `✅ API Key VÁLIDA! Encontrados ${peopleCount} resultados. A integração com Apollo.io está 100% FUNCIONAL!`
            : '⚠️ API Key válida, mas nenhum resultado encontrado para a busca "CEO".'
        });
      }

    } catch (error: any) {
      addLog(`❌ EXCEÇÃO: ${error.message}`);
      setResult({
        success: false,
        error: error.message,
        recommendation: '⚠️ Erro de rede. Verifique sua conexão com a internet e se as Edge Functions do Supabase estão online.'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="border border-white/5 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-6 h-6 text-yellow-500" />
            <span className="text-white">Apollo.io API Tester</span>
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
              DIAGNOSTIC
            </Badge>
          </CardTitle>
          <CardDescription>
            Teste DIRETO na API Apollo para validar credenciais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input API Key */}
          <div>
            <label className="text-sm text-zinc-400 mb-2 block font-medium">
              Apollo API Key
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API key aqui..."
                className="flex-1 bg-zinc-800 border-white/10 text-white font-mono text-sm"
              />
              <Button
                onClick={testDirectApolloAPI}
                disabled={testing || !apiKey}
                className="bg-yellow-600 hover:bg-yellow-500"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Testar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              💡 Acesse <a href="https://app.apollo.io/#/settings/integrations" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Apollo Settings → Integrations</a> para obter sua API key
            </p>
          </div>

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-3 mb-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.success ? 'Teste APROVADO' : 'Teste FALHOU'}
                  </h4>
                  <p className="text-sm text-zinc-300">
                    {result.recommendation}
                  </p>
                </div>
              </div>

              {result.success && result.peopleCount > 0 && (
                <div className="mt-3 p-3 bg-black/30 rounded border border-white/5">
                  <p className="text-xs text-zinc-400 mb-1">Exemplo de resultado:</p>
                  <pre className="text-xs text-emerald-400 font-mono overflow-x-auto">
                    {JSON.stringify(result.data?.people?.[0], null, 2).substring(0, 500)}...
                  </pre>
                </div>
              )}

              {!result.success && result.error && (
                <div className="mt-3 p-3 bg-black/30 rounded border border-red-500/20">
                  <p className="text-xs text-red-400 font-mono">
                    {result.error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Console de Logs */}
          <Card className="border border-white/5 bg-black/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <span className="text-white">Console</span>
                </CardTitle>
                <Button
                  onClick={() => setLogs([])}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-400 hover:text-white h-6"
                >
                  Limpar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded p-3 font-mono text-xs h-[300px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-8">
                    Clique em "Testar" para começar...
                  </div>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`
                          ${log.includes('❌') ? 'text-red-400' : ''}
                          ${log.includes('✅') ? 'text-emerald-400' : ''}
                          ${log.includes('🚀') || log.includes('🔍') ? 'text-blue-400' : ''}
                          ${log.includes('📡') || log.includes('📦') || log.includes('📥') ? 'text-purple-400' : ''}
                          ${log.includes('🔑') ? 'text-yellow-400' : ''}
                          ${!log.includes('❌') && !log.includes('✅') && !log.includes('🚀') && !log.includes('🔍') && !log.includes('📡') && !log.includes('📦') && !log.includes('📥') && !log.includes('🔑') ? 'text-zinc-400' : ''}
                        `}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="border border-indigo-500/20 bg-indigo-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-indigo-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                Como obter sua Apollo API Key
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400 space-y-2">
              <p><strong className="text-white">1.</strong> Acesse <a href="https://app.apollo.io/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">app.apollo.io</a> e faça login</p>
              <p><strong className="text-white">2.</strong> Vá em Settings → Integrations</p>
              <p><strong className="text-white">3.</strong> Procure por "API" e clique em "Create New Key"</p>
              <p><strong className="text-white">4.</strong> Copie a chave completa (deve ter ~24 caracteres)</p>
              <p><strong className="text-white">5.</strong> Cole aqui e clique em "Testar"</p>
              
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded">
                <p className="text-amber-400 text-xs">
                  ⚠️ <strong>IMPORTANTE:</strong> A chave deve começar com letras/números e NÃO deve conter espaços. 
                  Se o teste falhar com erro 401, a chave está incorreta.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
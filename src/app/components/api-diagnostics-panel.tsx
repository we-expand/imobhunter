import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Terminal,
  Zap,
  Globe,
  Server,
  Key
} from 'lucide-react';
import { ApolloKeyWizard } from './apollo-key-wizard';

interface ApiTest {
  name: string;
  endpoint: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  responseTime?: number;
  error?: string;
  data?: any;
}

export function ApiDiagnosticsPanel() {
  const [tests, setTests] = useState<ApiTest[]>([
    {
      name: 'Apollo API',
      endpoint: '/functions/v1/make-server-9e4b8b7c/api-proxy/apollo/search',
      status: 'idle'
    },
    {
      name: 'Proxycurl API',
      endpoint: '/functions/v1/make-server-9e4b8b7c/api-proxy/proxycurl/profile',
      status: 'idle'
    },
    {
      name: 'Edge Function Health',
      endpoint: '/functions/v1/make-server-9e4b8b7c/health',
      status: 'idle'
    }
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const [apolloKey, setApolloKey] = useState('WfxZd4DzoL1Fgp5advhp8Q');
  const [testingApolloKey, setTestingApolloKey] = useState(false);
  const [apolloKeyResult, setApolloKeyResult] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  const testApi = async (testIndex: number) => {
    const test = tests[testIndex];
    
    // Atualiza status para "testing"
    setTests(prev => prev.map((t, i) => 
      i === testIndex ? { ...t, status: 'testing' as const } : t
    ));

    addLog(`🚀 Testando ${test.name}...`);

    const startTime = performance.now();

    try {
      const projectId = 'evdyqlrssgsktctjruuq';
      const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzM0NTAsImV4cCI6MjA1NzkwOTQ1MH0.tTXuhxa_JJZm-R-wc2YFE7X5vXX3_oA0VEu-F2IEglg';

      let url = `https://${projectId}.supabase.co${test.endpoint}`;
      let body = {};

      // Configura payload específico para cada endpoint
      if (test.name === 'Apollo API') {
        body = {
          query: 'Cleber Couto Moyses',
          filters: {
            person_titles: ['Managing Partner', 'CEO', 'Founder']
          }
        };
      } else if (test.name === 'Proxycurl API') {
        body = {
          linkedinUrl: 'https://www.linkedin.com/in/williamhgates'
        };
      }

      const options: RequestInit = {
        method: test.name === 'Edge Function Health' ? 'GET' : 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        }
      };

      if (test.name !== 'Edge Function Health') {
        options.body = JSON.stringify(body);
      }

      addLog(`📡 URL: ${url}`);
      addLog(`📦 Payload: ${JSON.stringify(body, null, 2)}`);

      const response = await fetch(url, options);
      const responseTime = Math.round(performance.now() - startTime);

      addLog(`⏱️  Tempo de resposta: ${responseTime}ms`);
      addLog(`📊 Status HTTP: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`❌ Erro: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      addLog(`✅ Resposta recebida: ${JSON.stringify(data).substring(0, 200)}...`);

      // Atualiza com sucesso
      setTests(prev => prev.map((t, i) => 
        i === testIndex ? { 
          ...t, 
          status: 'success' as const, 
          responseTime,
          data
        } : t
      ));

      addLog(`✅ ${test.name} funcionando corretamente!`);

    } catch (error: any) {
      const responseTime = Math.round(performance.now() - startTime);
      
      addLog(`❌ ERRO em ${test.name}: ${error.message}`);
      
      // Atualiza com erro
      setTests(prev => prev.map((t, i) => 
        i === testIndex ? { 
          ...t, 
          status: 'error' as const, 
          responseTime,
          error: error.message
        } : t
      ));
    }
  };

  const testAllApis = async () => {
    addLog('🔄 Iniciando teste de TODAS as APIs...');
    for (let i = 0; i < tests.length; i++) {
      await testApi(i);
      // Pequeno delay entre testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    addLog('🏁 Teste completo finalizado!');
  };

  const getStatusIcon = (status: ApiTest['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing': return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getStatusBadge = (status: ApiTest['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">ONLINE</Badge>;
      case 'error': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">OFFLINE</Badge>;
      case 'testing': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">TESTING</Badge>;
      default: return <Badge className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20">IDLE</Badge>;
    }
  };

  const testApolloKey = async () => {
    setTestingApolloKey(true);
    setApolloKeyResult(null);
    addLog(`🔑 Testando chave Apollo: ${apolloKey.substring(0, 8)}...`);

    const startTime = performance.now();

    try {
      const projectId = 'evdyqlrssgsktctjruuq';
      const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMzM0NTAsImV4cCI6MjA1NzkwOTQ1MH0.tTXuhxa_JJZm-R-wc2YFE7X5vXX3_oA0VEu-F2IEglg';

      let url = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/apollo/search`;
      let body = {
        api_key: apolloKey, // ENVIA A CHAVE NO BODY!
        q_keywords: 'CEO',
        page: 1,
        per_page: 5
      };

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };

      addLog(`📡 URL: ${url}`);
      addLog(`📦 Payload com chave: ${JSON.stringify({...body, api_key: apolloKey.substring(0, 8) + '...'}, null, 2)}`);

      const response = await fetch(url, options);
      const responseTime = Math.round(performance.now() - startTime);

      addLog(`⏱️  Tempo de resposta: ${responseTime}ms`);
      addLog(`📊 Status HTTP: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`❌ ERRO HTTP ${response.status}: ${errorText}`);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        setApolloKeyResult({
          success: false,
          status: response.status,
          error: errorData.error || errorText,
          recommendation: response.status === 401 
            ? '⚠️ API Key INVÁLIDA! A Apollo rejeitou esta chave. Acesse https://app.apollo.io/#/settings/integrations e obtenha uma chave válida.'
            : response.status === 429
            ? '⚠️ Limite de requisições atingido. Aguarde alguns minutos.'
            : `⚠️ Erro ${response.status}. Veja os logs para detalhes.`
        });
        setTestingApolloKey(false);
        return;
      }

      const data = await response.json();
      addLog(`✅ Resposta recebida!`);
      
      const peopleCount = data?.data?.people?.length || 0;
      addLog(`📊 ${peopleCount} resultados encontrados`);

      setApolloKeyResult({
        success: true,
        status: response.status,
        data: data,
        peopleCount: peopleCount,
        recommendation: peopleCount > 0
          ? `✅ API Key VÁLIDA! Encontrados ${peopleCount} resultados. A integração com Apollo.io está 100% FUNCIONAL!`
          : '⚠️ API Key válida, mas nenhum resultado encontrado para a busca "CEO".'
      });
      setTestingApolloKey(false);

      addLog(`✅ Chave Apollo API funcionando corretamente!`);

    } catch (error: any) {
      const responseTime = Math.round(performance.now() - startTime);
      
      addLog(`❌ ERRO em chave Apollo API: ${error.message}`);
      
      setApolloKeyResult({
        success: false,
        error: error.message,
        recommendation: '⚠️ Erro de rede. Verifique sua conexão com a internet e se as Edge Functions do Supabase estão online.'
      });
      setTestingApolloKey(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* 🔥 WIZARD DE CHAVE APOLLO - DESTAQUE MÁXIMO */}
      <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 rounded-xl p-2">
        <ApolloKeyWizard />
      </div>

      {/* Header */}
      <Card className="border border-white/5 bg-zinc-900/90">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="w-6 h-6 text-indigo-500" />
                <span className="text-white">API Diagnostics Center</span>
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  v1.0
                </Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                Teste e monitore as APIs em tempo real com logs detalhados
              </CardDescription>
            </div>
            <Button
              onClick={testAllApis}
              className="gap-2 bg-indigo-600 hover:bg-indigo-500"
            >
              <Zap className="w-4 h-4" />
              Testar Todas
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* API Tests Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {tests.map((test, index) => (
          <Card key={index} className="border border-white/5 bg-zinc-900/90">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                {getStatusIcon(test.status)}
                {getStatusBadge(test.status)}
              </div>
              <CardTitle className="text-lg text-white">{test.name}</CardTitle>
              <CardDescription className="text-xs font-mono">
                {test.endpoint}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {test.responseTime && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Response Time</span>
                  <span className="text-white font-mono">{test.responseTime}ms</span>
                </div>
              )}
              
              {test.error && (
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 font-mono">
                  {test.error}
                </div>
              )}

              {test.data && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 font-mono max-h-20 overflow-auto">
                  {JSON.stringify(test.data, null, 2).substring(0, 200)}...
                </div>
              )}

              <Button
                onClick={() => testApi(index)}
                disabled={test.status === 'testing'}
                variant="outline"
                size="sm"
                className="w-full border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${test.status === 'testing' ? 'animate-spin' : ''}`} />
                Testar Novamente
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Console de Logs */}
      <Card className="border border-white/5 bg-zinc-900/90">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-500" />
              <span className="text-white">Console de Logs</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-mono">
                LIVE
              </Badge>
            </CardTitle>
            <Button
              onClick={() => setLogs([])}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              Limpar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-xs h-[400px] overflow-y-auto border border-white/5">
            {logs.length === 0 ? (
              <div className="text-zinc-600 text-center py-8">
                Nenhum log ainda. Clique em "Testar Todas" para começar.
              </div>
            ) : (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`
                      ${log.includes('❌') ? 'text-red-400' : ''}
                      ${log.includes('✅') ? 'text-emerald-400' : ''}
                      ${log.includes('🚀') || log.includes('🔄') ? 'text-blue-400' : ''}
                      ${log.includes('📡') || log.includes('📦') ? 'text-purple-400' : ''}
                      ${log.includes('⏱️') || log.includes('📊') ? 'text-yellow-400' : ''}
                      ${!log.includes('❌') && !log.includes('✅') && !log.includes('🚀') && !log.includes('🔄') && !log.includes('📡') && !log.includes('📦') && !log.includes('⏱️') && !log.includes('📊') ? 'text-zinc-400' : ''}
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
      <Card className="border border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-400">
            <Globe className="w-5 h-5" />
            Como Usar Este Painel
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400 space-y-2">
          <p>
            <strong className="text-white">1.</strong> Clique em "Testar Todas" para executar todos os testes automaticamente
          </p>
          <p>
            <strong className="text-white">2.</strong> Ou clique em "Testar Novamente" em cada card individual
          </p>
          <p>
            <strong className="text-white">3.</strong> Acompanhe os logs em tempo real no console abaixo
          </p>
          <p>
            <strong className="text-white">4.</strong> Status ONLINE = API funcionando | OFFLINE = API com problema
          </p>
          <p className="pt-2 text-xs text-amber-400 border-t border-amber-500/20 mt-4">
            ⚠️ Se todas as APIs estiverem OFFLINE, verifique se as Edge Functions estão deployadas corretamente no Supabase
          </p>
        </CardContent>
      </Card>

      {/* Teste de Chave Apollo */}
      <Card className="border border-amber-500/30 bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            ⚠️ Chave Apollo Atual: INVÁLIDA
          </CardTitle>
          <CardDescription className="text-amber-300">
            A chave <code className="bg-black/30 px-2 py-1 rounded text-xs">WfxZd4DzoL1Fgp5advhp8Q</code> também retornou erro 401. 
            <br />
            <span className="text-red-400 font-semibold">Você precisa obter uma chave válida da Apollo.io</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Instruções GRANDES e CLARAS */}
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-5 space-y-4">
            <h3 className="text-red-400 font-bold text-lg flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              PROBLEMA: Chave Apollo Inválida
            </h3>
            
            <div className="bg-black/30 p-4 rounded space-y-2 text-sm text-zinc-300">
              <p className="font-semibold text-white">Por que está acontecendo?</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>A chave Apollo foi revogada, expirou ou nunca foi válida</li>
                <li>O servidor Apollo.io está rejeitando a autenticação (HTTP 401)</li>
                <li>Você precisa gerar uma NOVA chave no painel da Apollo</li>
              </ul>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-3">
              <h4 className="text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Como Resolver AGORA:
              </h4>
              <ol className="text-sm text-zinc-300 space-y-3 list-decimal list-inside">
                <li className="pl-2">
                  <span className="font-semibold text-white">Acesse o painel da Apollo:</span>
                  <a 
                    href="https://app.apollo.io/#/settings/integrations" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mt-1 ml-6 text-indigo-400 hover:text-indigo-300 underline text-xs bg-black/30 p-2 rounded"
                  >
                    🔗 https://app.apollo.io/#/settings/integrations
                  </a>
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-white">Faça login</span> com suas credenciais Apollo
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-white">Procure por "API"</span> na página de integrações
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-white">Clique em "Create New Key"</span> ou "Generate API Key"
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-white">Copie a chave gerada</span> (deve ter ~20-30 caracteres)
                </li>
                <li className="pl-2">
                  <span className="font-semibold text-white">Cole a chave no campo abaixo</span> e clique em "Testar Chave Apollo"
                </li>
              </ol>
            </div>
          </div>

          {/* Input para nova chave - DESTAQUE MAIOR */}
          <div className="space-y-2 bg-indigo-500/10 border-2 border-indigo-500/30 rounded-lg p-4">
            <label className="text-base text-white font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              Cole sua NOVA chave Apollo API aqui:
            </label>
            <Input
              value={apolloKey}
              onChange={(e) => setApolloKey(e.target.value)}
              placeholder="Ex: WfxZd4DzoL1Fgp5advhp8Q (cole a chave completa)"
              className="font-mono text-base bg-black/50 border-indigo-400/30 text-white placeholder:text-zinc-600 h-12"
            />
            <div className="flex items-start gap-2 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-zinc-400">
                A chave deve conter apenas letras e números, sem espaços. Exemplo válido: <code className="bg-black/30 px-1 rounded">WfxZd4DzoL1Fgp5advhp8Q</code>
              </p>
            </div>
          </div>
          
          <Button
            onClick={testApolloKey}
            disabled={testingApolloKey || !apolloKey}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 text-base font-semibold"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${testingApolloKey ? 'animate-spin' : ''}`} />
            {testingApolloKey ? 'Testando Nova Chave...' : '🔍 Testar Chave Apollo'}
          </Button>

          {apolloKeyResult && (
            <div className={`p-4 rounded-lg border-2 ${
              apolloKeyResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {apolloKeyResult.success ? (
                  <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-3">
                  <p className={`text-base font-bold ${
                    apolloKeyResult.success ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {apolloKeyResult.recommendation}
                  </p>
                  
                  {apolloKeyResult.success && apolloKeyResult.peopleCount > 0 && (
                    <>
                      <div className="text-sm text-zinc-300 space-y-1 bg-black/30 p-3 rounded">
                        <div className="flex justify-between">
                          <span>Status HTTP:</span>
                          <span className="text-emerald-400 font-mono font-bold">{apolloKeyResult.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resultados encontrados:</span>
                          <span className="text-emerald-400 font-mono font-bold">{apolloKeyResult.peopleCount}</span>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <p className="text-emerald-400 font-bold mb-2">✅ PRÓXIMO PASSO IMPORTANTE:</p>
                        <p className="text-zinc-300 text-sm mb-3">
                          A chave <code className="bg-black/30 px-2 py-1 rounded text-emerald-400">{apolloKey}</code> está VÁLIDA!
                        </p>
                        <p className="text-white text-sm font-semibold bg-black/30 p-3 rounded">
                          📋 Copie esta chave e me envie no chat dizendo: "Atualizar chave Apollo para: {apolloKey}"
                        </p>
                      </div>
                    </>
                  )}

                  {!apolloKeyResult.success && (
                    <div className="space-y-2">
                      <div className="text-sm text-zinc-400 bg-black/30 p-3 rounded space-y-1">
                        {apolloKeyResult.status && (
                          <div className="flex justify-between">
                            <span>Status HTTP:</span>
                            <span className="text-red-400 font-mono font-bold">{apolloKeyResult.status}</span>
                          </div>
                        )}
                        {apolloKeyResult.error && (
                          <div className="mt-2 p-2 bg-red-500/10 rounded font-mono text-xs text-red-400 border border-red-500/20">
                            {apolloKeyResult.error}
                          </div>
                        )}
                      </div>
                      
                      {apolloKeyResult.status === 401 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded space-y-2">
                          <p className="text-amber-400 font-semibold text-sm">⚠️ A chave que você testou também está inválida!</p>
                          <p className="text-zinc-300 text-xs">
                            Certifique-se de que copiou a chave COMPLETA do painel da Apollo. 
                            Ela não deve conter espaços no início ou fim.
                          </p>
                          <a 
                            href="https://app.apollo.io/#/settings/integrations" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-sm text-indigo-400 hover:text-indigo-300 underline font-semibold"
                          >
                            → Gerar nova chave no painel Apollo.io
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  CheckCircle, XCircle, Loader2, AlertTriangle, 
  Copy, ExternalLink, RefreshCw, Terminal, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

export function ApolloDiagnosticTool() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [manualKey, setManualKey] = useState('');

  // Teste COMPLETO da configuração Apollo
  const runFullDiagnostic = async () => {
    setTesting(true);
    setResults(null);

    const diagnostic: any = {
      timestamp: new Date().toISOString(),
      steps: []
    };

    try {
      // PASSO 1: Verificar variáveis de ambiente
      diagnostic.steps.push({
        step: 1,
        name: 'Verificar Variáveis de Ambiente',
        status: 'running'
      });

      const testApiUrl = `${API_BASE_URL}${API_ROUTES.diagnostics}`;
      const testResponse = await fetch(testApiUrl, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });

      const testData = await testResponse.json();
      diagnostic.envCheck = testData;
      
      if (testData.apis?.apollo?.configured) {
        diagnostic.steps[0].status = 'success';
        diagnostic.steps[0].message = `✅ APOLLO_API_KEY encontrada (${testData.apis.apollo.keyLength} caracteres)`;
      } else {
        diagnostic.steps[0].status = 'error';
        diagnostic.steps[0].message = '❌ APOLLO_API_KEY não está configurada no Supabase';
      }

      // PASSO 2: Validar API Key
      diagnostic.steps.push({
        step: 2,
        name: 'Validar API Key com Apollo',
        status: 'running'
      });

      if (testData.apis?.apollo?.valid) {
        diagnostic.steps[1].status = 'success';
        diagnostic.steps[1].message = '✅ API Key válida e aceita pelo Apollo';
      } else if (testData.apis?.apollo?.configured) {
        diagnostic.steps[1].status = 'error';
        diagnostic.steps[1].message = `❌ API Key rejeitada pelo Apollo: ${testData.apis.apollo.error || 'Erro desconhecido'}`;
        diagnostic.apolloError = testData.apis.apollo.error;
      } else {
        diagnostic.steps[1].status = 'skip';
        diagnostic.steps[1].message = '⏭️ Pulado (key não configurada)';
      }

      // PASSO 3: Testar busca real
      diagnostic.steps.push({
        step: 3,
        name: 'Fazer Busca Real de Leads',
        status: 'running'
      });

      const searchUrl = `${API_BASE_URL}${API_ROUTES.searchLeads}`;
      const searchResponse = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filters: { jobTitles: ['CEO'] }
        })
      });

      const searchData = await searchResponse.json();
      diagnostic.searchResults = searchData;

      if (searchData.sources?.apollo > 0) {
        diagnostic.steps[2].status = 'success';
        diagnostic.steps[2].message = `✅ ${searchData.sources.apollo} leads REAIS retornados do Apollo!`;
        diagnostic.isWorking = true;
      } else if (searchData.sources?.demo > 0) {
        diagnostic.steps[2].status = 'error';
        diagnostic.steps[2].message = `❌ Retornou ${searchData.sources.demo} leads DEMO (dados fictícios)`;
        diagnostic.isWorking = false;
      } else {
        diagnostic.steps[2].status = 'error';
        diagnostic.steps[2].message = '❌ Nenhum resultado retornado';
        diagnostic.isWorking = false;
      }

      // PASSO 4: Analisar causa raiz
      diagnostic.steps.push({
        step: 4,
        name: 'Diagnóstico da Causa Raiz',
        status: 'running'
      });

      if (diagnostic.isWorking) {
        diagnostic.steps[3].status = 'success';
        diagnostic.steps[3].message = '✅ Sistema funcionando perfeitamente!';
        diagnostic.rootCause = 'Sistema operacional';
      } else if (!testData.apis?.apollo?.configured) {
        diagnostic.steps[3].status = 'error';
        diagnostic.steps[3].message = '🔑 CAUSA: API Key não está no Supabase';
        diagnostic.rootCause = 'missing_key';
        diagnostic.solution = 'Adicionar APOLLO_API_KEY nas variáveis de ambiente do Supabase';
      } else if (!testData.apis?.apollo?.valid) {
        diagnostic.steps[3].status = 'error';
        diagnostic.steps[3].message = '⚠️ CAUSA: API Key inválida ou expirada';
        diagnostic.rootCause = 'invalid_key';
        diagnostic.solution = 'Verificar se a key está correta ou gerar nova key no Apollo.io';
      } else {
        diagnostic.steps[3].status = 'error';
        diagnostic.steps[3].message = '❓ CAUSA: Desconhecida - verificar logs do servidor';
        diagnostic.rootCause = 'unknown';
        diagnostic.solution = 'Verificar logs das Edge Functions no Supabase';
      }

      setResults(diagnostic);

      // Toast com resultado
      if (diagnostic.isWorking) {
        toast.success('✅ Apollo funcionando perfeitamente!');
      } else {
        toast.error('❌ Apollo não está funcionando', {
          description: diagnostic.solution
        });
      }

    } catch (error: any) {
      diagnostic.error = error.message;
      diagnostic.steps.push({
        step: 5,
        name: 'Erro Fatal',
        status: 'error',
        message: `❌ ${error.message}`
      });
      setResults(diagnostic);
      toast.error('Erro ao executar diagnóstico', {
        description: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  // Testar key manualmente (sem salvar no Supabase)
  const testManualKey = async () => {
    if (!manualKey.trim()) {
      toast.error('Digite uma API key para testar');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          api_key: manualKey.trim(),
          page: 1,
          per_page: 1,
          person_titles: ['CEO']
        })
      });

      const responseText = await response.text();
      
      if (response.ok) {
        toast.success('✅ API Key VÁLIDA!', {
          description: 'Esta key funciona com o Apollo'
        });
        
        // Mostrar resultado
        const data = JSON.parse(responseText);
        setResults({
          manualTest: true,
          valid: true,
          message: `Key válida! Apollo retornou ${data.people?.length || 0} resultado(s)`,
          response: data
        });
      } else {
        toast.error('❌ API Key INVÁLIDA', {
          description: `Apollo retornou erro: ${response.status}`
        });
        
        setResults({
          manualTest: true,
          valid: false,
          message: `Key inválida! Status: ${response.status}`,
          error: responseText
        });
      }
    } catch (error: any) {
      toast.error('Erro ao testar key', {
        description: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Terminal className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">🔍 Diagnóstico Apollo Completo</h1>
        <p className="text-gray-600">
          Vamos descobrir POR QUE você está vendo dados DEMO
        </p>
      </div>

      {/* Diagnóstico Automático */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Diagnóstico Automático Completo
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Este teste verifica: variáveis de ambiente, validação da key, busca real, e causa raiz do problema
          </p>
          <Button
            onClick={runFullDiagnostic}
            disabled={testing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            size="lg"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Executando diagnóstico...
              </>
            ) : (
              <>
                <Terminal className="w-5 h-5 mr-2" />
                Executar Diagnóstico Completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Teste Manual de API Key */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Teste Manual de API Key
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Teste se sua API key funciona ANTES de configurar no Supabase
          </p>
          
          <div className="space-y-3">
            <div>
              <Label>Cole sua API Key Apollo aqui:</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  placeholder="R31HOQYiof3eK9B5uxqePA"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              onClick={testManualKey}
              disabled={testing || !manualKey.trim()}
              className="w-full"
              variant="outline"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Testar Esta Key
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados do Diagnóstico */}
      {results && !results.manualTest && (
        <div className="space-y-4">
          {/* Status Geral */}
          <Card className={results.isWorking ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500'}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {results.isWorking ? (
                  <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    {results.isWorking ? '✅ APOLLO FUNCIONANDO!' : '❌ APOLLO NÃO ESTÁ FUNCIONANDO'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {results.solution || 'Sistema operacional'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passos do Diagnóstico */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">📋 Passos Executados:</h3>
              <div className="space-y-3">
                {results.steps.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {step.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {step.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                      {step.status === 'running' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                      {step.status === 'skip' && <AlertTriangle className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">
                        Passo {step.step}: {step.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {step.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da API */}
          {results.envCheck?.apis?.apollo && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">🔑 Detalhes da API Key:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Configurada no Supabase:</span>
                    <Badge className={results.envCheck.apis.apollo.configured ? 'bg-green-500' : 'bg-red-500'}>
                      {results.envCheck.apis.apollo.configured ? 'SIM' : 'NÃO'}
                    </Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Comprimento da Key:</span>
                    <span className="font-mono">{results.envCheck.apis.apollo.keyLength} caracteres</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Preview:</span>
                    <span className="font-mono text-xs">{results.envCheck.apis.apollo.preview}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Válida (Apollo aceita):</span>
                    <Badge className={results.envCheck.apis.apollo.valid ? 'bg-green-500' : 'bg-red-500'}>
                      {results.envCheck.apis.apollo.valid ? 'SIM' : 'NÃO'}
                    </Badge>
                  </div>
                  {results.apolloError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded mt-2">
                      <div className="text-xs font-semibold text-red-700 mb-1">Erro do Apollo:</div>
                      <div className="text-xs text-red-600">{results.apolloError}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resultados da Busca */}
          {results.searchResults && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">🔍 Resultados da Busca:</h3>
                <div className="grid grid-cols-4 gap-4 text-center mb-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{results.searchResults.total || 0}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">{results.searchResults.sources?.apollo || 0}</div>
                    <div className="text-xs text-gray-600">Apollo (REAL)</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">{results.searchResults.sources?.pdl || 0}</div>
                    <div className="text-xs text-gray-600">PDL (REAL)</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">{results.searchResults.sources?.demo || 0}</div>
                    <div className="text-xs text-gray-600">DEMO (FAKE)</div>
                  </div>
                </div>

                {results.searchResults.results && results.searchResults.results.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold mb-2">Primeiro resultado:</div>
                    <div className="p-3 bg-gray-50 rounded text-sm">
                      <div><strong>Nome:</strong> {results.searchResults.results[0].name}</div>
                      <div><strong>Email:</strong> {results.searchResults.results[0].email}</div>
                      <div><strong>Cargo:</strong> {results.searchResults.results[0].title}</div>
                      <div><strong>Fonte:</strong> <Badge className={results.searchResults.results[0].source === 'demo' ? 'bg-orange-500' : 'bg-green-500'}>
                        {results.searchResults.results[0].source}
                      </Badge></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Solução Recomendada */}
          {!results.isWorking && (
            <Card className="border-orange-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-orange-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  🔧 Solução Recomendada:
                </h3>

                {results.rootCause === 'missing_key' && (
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>PROBLEMA:</strong> A variável APOLLO_API_KEY não está configurada no Supabase.
                    </p>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm font-semibold mb-2">✅ COMO RESOLVER:</p>
                      <ol className="text-sm space-y-2 list-decimal list-inside">
                        <li>Abrir Supabase Dashboard</li>
                        <li>Settings → Edge Functions → Secrets</li>
                        <li>Clicar "Add Secret"</li>
                        <li>Nome: <code className="bg-white px-2 py-1 rounded">APOLLO_API_KEY</code></li>
                        <li>Valor: <code className="bg-white px-2 py-1 rounded">R31HOQYiof3eK9B5uxqePA</code></li>
                        <li>Salvar e Reiniciar Edge Functions</li>
                      </ol>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/settings/functions`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Supabase Settings
                    </Button>
                  </div>
                )}

                {results.rootCause === 'invalid_key' && (
                  <div className="space-y-3">
                    <p className="text-sm">
                      <strong>PROBLEMA:</strong> A API key está configurada, mas o Apollo a rejeitou.
                    </p>
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm font-semibold mb-2">✅ POSSÍVEIS CAUSAS:</p>
                      <ul className="text-sm space-y-2 list-disc list-inside">
                        <li>Key expirou (teste de 14 dias acabou)</li>
                        <li>Key foi revogada no Apollo.io</li>
                        <li>Espaços extras ao colar a key</li>
                        <li>Key copiada incompleta</li>
                        <li>Limite de créditos atingido</li>
                      </ul>
                      <p className="text-sm font-semibold mt-4 mb-2">🔧 COMO RESOLVER:</p>
                      <ol className="text-sm space-y-2 list-decimal list-inside">
                        <li>Login em apollo.io</li>
                        <li>Settings → API & Integrations</li>
                        <li>Gerar NOVA API key</li>
                        <li>Substituir no Supabase (sem espaços!)</li>
                        <li>Reiniciar Edge Functions</li>
                      </ol>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => window.open('https://app.apollo.io/settings/integrations', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir Apollo Settings
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/logs/edge-functions`, '_blank')}
                      >
                        <Terminal className="w-4 h-4 mr-2" />
                        Ver Logs
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Resultado do Teste Manual */}
      {results && results.manualTest && (
        <Card className={results.valid ? 'ring-2 ring-green-500' : 'ring-2 ring-red-500'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {results.valid ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {results.valid ? '✅ API Key VÁLIDA!' : '❌ API Key INVÁLIDA'}
                </h3>
                <p className="text-sm text-gray-600">{results.message}</p>
              </div>
            </div>

            {results.valid && (
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm font-semibold text-green-900 mb-2">
                  🎉 Esta key funciona! Próximo passo:
                </p>
                <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                  <li>Copiar esta key</li>
                  <li>Adicionar no Supabase como APOLLO_API_KEY</li>
                  <li>Reiniciar Edge Functions</li>
                  <li>Testar novamente</li>
                </ol>
              </div>
            )}

            {!results.valid && (
              <div className="bg-red-50 p-4 rounded">
                <p className="text-sm font-semibold text-red-900 mb-2">
                  ❌ Esta key NÃO funciona. Tente:
                </p>
                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                  <li>Gerar nova key no Apollo.io</li>
                  <li>Verificar se copiou completa (sem espaços)</li>
                  <li>Confirmar que sua conta Apollo está ativa</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Links Úteis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">🔗 Links Úteis:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => window.open('https://app.apollo.io/settings/integrations', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apollo API Settings
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/settings/functions`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Supabase Secrets
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/logs/edge-functions`, '_blank')}
            >
              <Terminal className="w-4 h-4 mr-2" />
              Edge Functions Logs
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => copyToClipboard('R31HOQYiof3eK9B5uxqePA')}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

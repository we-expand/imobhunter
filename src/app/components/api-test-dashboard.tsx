import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2, Terminal, Key, Search, Database, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { TestAPIProxy } from './TestAPIProxy';

interface APIStatus {
  name: string;
  configured: boolean;
  preview?: string;
  length?: number;
}

interface SearchResult {
  source: string;
  results: number;
  data?: any;
  error?: string;
}

export function APITestDashboard() {
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<APIStatus[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [serverHealth, setServerHealth] = useState<'unknown' | 'healthy' | 'error'>('unknown');

  // Voltar para a Landing Page
  const goBack = () => {
    window.location.reload();
  };

  // Testar saúde do servidor
  const testServerHealth = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/health`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        setServerHealth('healthy');
        toast.success('✅ Servidor está funcionando!');
        return true;
      } else {
        setServerHealth('error');
        toast.error('❌ Servidor retornou erro');
        return false;
      }
    } catch (error) {
      setServerHealth('error');
      toast.error('❌ Não foi possível conectar ao servidor');
      return false;
    }
  };

  // Verificar status das API keys
  const checkAPIKeys = async () => {
    setLoading(true);
    toast.loading('🔍 Verificando API keys...', { id: 'check-apis' });

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/debug/env-vars`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      const apis: APIStatus[] = [
        {
          name: 'Apollo.io',
          configured: data.apollo?.configured || false,
          preview: data.apollo?.preview,
          length: data.apollo?.length
        },
        {
          name: 'Proxycurl (LinkedIn)',
          configured: data.proxycurl?.configured || (data.proxycurl_api_key?.configured) || false,
          preview: data.proxycurl?.preview || data.proxycurl_api_key?.preview,
          length: data.proxycurl?.length || data.proxycurl_api_key?.length
        },
        {
          name: 'Hunter.io',
          configured: data.hunter?.configured || false,
          preview: data.hunter?.preview,
          length: data.hunter?.length
        },
        {
          name: 'PDL (People Data Labs)',
          configured: data.pdl?.configured || false,
          preview: data.pdl?.preview,
          length: data.pdl?.length
        },
        {
          name: 'RocketReach',
          configured: data.rocketreach?.configured || false,
          preview: data.rocketreach?.preview,
          length: data.rocketreach?.length
        }
      ];

      setApiStatus(apis);
      toast.dismiss('check-apis');

      const configuredCount = apis.filter(a => a.configured).length;
      if (configuredCount === apis.length) {
        toast.success(`✅ Todas as ${apis.length} APIs estão configuradas!`);
      } else {
        toast.warning(`⚠️ ${configuredCount}/${apis.length} APIs configuradas`);
      }
    } catch (error) {
      toast.dismiss('check-apis');
      toast.error('❌ Erro ao verificar APIs: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Testar busca real com todas as APIs
  const testRealSearch = async () => {
    setLoading(true);
    setSearchResults([]);
    toast.loading('🔍 Testando busca real...', { id: 'test-search' });

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/advanced-search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            searchType: 'people',
            filters: {
              query: 'real estate agent',
              location: 'Porto, Portugal',
              maxResults: 3
            }
          })
        }
      );

      const data = await response.json();
      
      toast.dismiss('test-search');

      if (data.success) {
        const results: SearchResult[] = [];

        if (data.results.apollo) {
          results.push({
            source: 'Apollo.io',
            results: data.results.apollo.length || 0,
            data: data.results.apollo
          });
        }

        if (data.results.linkedin) {
          results.push({
            source: 'LinkedIn (Proxycurl)',
            results: data.results.linkedin.length || 0,
            data: data.results.linkedin
          });
        }

        if (data.results.merged) {
          results.push({
            source: 'IA Merged (Best Results)',
            results: data.results.merged.length || 0,
            data: data.results.merged
          });
        }

        setSearchResults(results);
        toast.success(`✅ Busca concluída! ${data.results.merged?.length || 0} leads encontrados`);
      } else {
        toast.error('❌ Erro na busca: ' + (data.error || 'Erro desconhecido'));
        
        if (data.message && data.message.includes('API key')) {
          toast.error('⚠️ APIs não configuradas. Configure no Supabase Dashboard.', {
            duration: 5000
          });
        }
      }
    } catch (error) {
      toast.dismiss('test-search');
      toast.error('❌ Erro ao testar busca: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Testar tudo de uma vez
  const runFullDiagnostic = async () => {
    await testServerHealth();
    await new Promise(resolve => setTimeout(resolve, 500));
    await checkAPIKeys();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testRealSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            🧪 Painel de Diagnóstico de APIs
          </h1>
          <p className="text-gray-300">
            Teste e valide todas as integrações do ImobHunter
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={testServerHealth}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
              Testar Servidor
            </Button>

            <Button
              onClick={checkAPIKeys}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
              Verificar API Keys
            </Button>

            <Button
              onClick={testRealSearch}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Testar Busca Real
            </Button>

            <Button
              onClick={runFullDiagnostic}
              disabled={loading}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Terminal className="w-4 h-4 mr-2" />}
              Diagnóstico Completo
            </Button>
          </div>
        </Card>

        {/* Server Health Status */}
        {serverHealth !== 'unknown' && (
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {serverHealth === 'healthy' ? (
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">Status do Servidor</h3>
                  <p className="text-gray-300">
                    {serverHealth === 'healthy' ? 'Servidor funcionando normalmente' : 'Servidor com problemas'}
                  </p>
                </div>
              </div>
              <Badge className={serverHealth === 'healthy' ? 'bg-green-500' : 'bg-red-500'}>
                {serverHealth === 'healthy' ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </Card>
        )}

        {/* API Keys Status */}
        {apiStatus.length > 0 && (
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Status das API Keys</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {apiStatus.map((api, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{api.name}</span>
                    {api.configured ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div>
                      Status: {api.configured ? (
                        <Badge className="bg-green-500 ml-2">Configurada</Badge>
                      ) : (
                        <Badge className="bg-red-500 ml-2">Não Configurada</Badge>
                      )}
                    </div>
                    {api.preview && (
                      <div className="font-mono text-xs">
                        Key: {api.preview} ({api.length} chars)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Resultados da Busca</h3>
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{result.source}</span>
                      {result.results > 0 && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <Badge className={result.results > 0 ? 'bg-green-500' : 'bg-gray-500'}>
                      {result.results} resultados
                    </Badge>
                  </div>
                  
                  {result.data && result.results > 0 && (
                    <div className="mt-3 p-3 bg-black/20 rounded border border-white/5">
                      <pre className="text-xs text-gray-300 overflow-auto max-h-48">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.error && (
                    <div className="mt-3 p-3 bg-red-500/20 rounded border border-red-500/30">
                      <p className="text-sm text-red-300">{result.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 🧪 TESTE DE PROXY CORS */}
        <Card className="p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-xl border-purple-500/30">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2">🔥 Teste de CORS e API Proxy</h3>
            <p className="text-purple-200 text-sm">
              Este teste verifica se o servidor Supabase está respondendo corretamente ao CORS preflight
              e se os proxies de Apollo e Proxycurl estão funcionando.
            </p>
          </div>
          <TestAPIProxy />
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">📋 Instruções</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>1.</strong> Clique em "Diagnóstico Completo" para testar tudo de uma vez
            </p>
            <p>
              <strong>2.</strong> Se alguma API aparecer como "Não Configurada":
            </p>
            <ul className="list-disc list-inside ml-6 space-y-1 text-sm">
              <li>Acesse: <code className="px-2 py-1 bg-black/30 rounded text-yellow-300">
                https://supabase.com/dashboard/project/{projectId}/settings/functions
              </code></li>
              <li>Adicione a API key correspondente nas "Secrets"</li>
              <li>Aguarde ~30 segundos e teste novamente</li>
            </ul>
            <p>
              <strong>3.</strong> APIs disponíveis:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-1 text-sm">
              <li><strong>Apollo.io:</strong> Busca de contatos B2B</li>
              <li><strong>PDL (People Data Labs):</strong> Dados do LinkedIn + enriquecimento profissional</li>
              <li><strong>RocketReach:</strong> Contatos diretos de executivos</li>
              <li><strong>Hunter.io:</strong> Validação de emails</li>
              <li><strong className="text-yellow-400">⚠️ Proxycurl:</strong> <span className="text-red-400">Descontinuado - use PDL</span></li>
            </ul>
          </div>
        </Card>

        {/* Back Button */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
          <Button
            onClick={goBack}
            className="bg-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a Landing Page
          </Button>
        </Card>
      </div>
    </div>
  );
}
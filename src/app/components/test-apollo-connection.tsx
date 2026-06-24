import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CheckCircle, XCircle, Loader2, Play, RefreshCw,
  AlertCircle, ExternalLink, Key, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

export function TestApolloConnection() {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const runTest = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      // 1. Testar status das APIs
      console.log('🧪 Testando status das APIs...');
      const statusUrl = `${API_BASE_URL}${API_ROUTES.diagnostics}`;
      const statusResponse = await fetch(statusUrl, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const statusData = await statusResponse.json();
      console.log('📊 Status das APIs:', statusData);

      // 2. Testar busca real
      console.log('🔍 Testando busca de leads...');
      const searchUrl = `${API_BASE_URL}${API_ROUTES.searchLeads}`;
      const searchResponse = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filters: {
            jobTitles: ['CEO'],
            locations: ['Lisboa']
          }
        })
      });

      const searchData = await searchResponse.json();
      console.log('🎯 Resultados da busca:', searchData);

      // Compilar resultados
      const results = {
        apiStatus: statusData.apis || {},
        searchResults: searchData,
        isRealData: searchData.sources?.apollo > 0 || searchData.sources?.pdl > 0 || searchData.sources?.hunter > 0,
        isDemoData: searchData.sources?.demo > 0,
        timestamp: new Date().toISOString()
      };

      setTestResults(results);

      // Toast com resultado
      if (results.isRealData) {
        toast.success('✅ Apollo funcionando! Dados REAIS recebidos!', {
          description: `${searchData.total} leads encontrados de fontes reais`
        });
      } else if (results.isDemoData) {
        toast.error('⚠️ Modo DEMO ativo - Configure Apollo API Key', {
          description: 'Sistema retornou dados fictícios (mock)'
        });
      }

    } catch (error: any) {
      console.error('❌ Erro no teste:', error);
      toast.error('Erro ao testar conexão', {
        description: error.message
      });
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusBadge = (apiName: string) => {
    if (!testResults?.apiStatus) return null;
    const status = testResults.apiStatus[apiName];
    
    if (!status) return <Badge variant="outline">N/A</Badge>;
    
    if (status.valid) {
      return <Badge className="bg-green-500">✅ Válida</Badge>;
    } else if (status.configured && !status.valid) {
      return <Badge className="bg-red-500">❌ Inválida</Badge>;
    } else {
      return <Badge className="bg-orange-500">⚠️ Não configurada</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🧪 Teste de Conexão Apollo</h2>
        <p className="text-sm text-gray-600">
          Verifique se o Apollo.io está configurado e retornando dados REAIS
        </p>
      </div>

      {/* Test Button */}
      <Card>
        <CardContent className="p-6">
          <Button
            onClick={runTest}
            disabled={testing}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Iniciar Teste Completo
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Este teste verifica: Status das APIs + Busca real de leads
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {testResults && (
        <div className="space-y-4">
          {/* Summary */}
          <Card className={`${testResults.isRealData ? 'ring-2 ring-green-500' : 'ring-2 ring-orange-500'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                {testResults.isRealData ? (
                  <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-orange-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    {testResults.isRealData ? '✅ FUNCIONANDO!' : '⚠️ MODO DEMO ATIVO'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {testResults.isRealData 
                      ? 'Apollo está retornando dados REAIS. Tudo configurado corretamente!'
                      : 'Sistema está usando dados fictícios (mock). Configure Apollo API Key.'}
                  </p>
                </div>
              </div>

              {/* Search Summary */}
              {testResults.searchResults && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {testResults.searchResults.total || 0}
                      </div>
                      <div className="text-xs text-gray-500">Leads Encontrados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.searchResults.sources?.apollo || 0}
                      </div>
                      <div className="text-xs text-gray-500">Apollo.io</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {testResults.searchResults.sources?.pdl || 0}
                      </div>
                      <div className="text-xs text-gray-500">PDL</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {testResults.searchResults.sources?.demo || 0}
                      </div>
                      <div className="text-xs text-gray-500">Demo (Fake)</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Status Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Status das API Keys
              </h3>
              <div className="space-y-3">
                {['apollo', 'pdl', 'hunter', 'proxycurl', 'clearbit', 'rocketreach', 'lusha'].map(api => (
                  <div key={api} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium capitalize">{api}</span>
                      {testResults.apiStatus[api]?.configured && (
                        <span className="text-xs text-gray-500">
                          Key length: {testResults.apiStatus[api]?.keyLength}
                        </span>
                      )}
                    </div>
                    {getStatusBadge(api)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Results */}
          {testResults.searchResults?.results && testResults.searchResults.results.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Primeiros 3 Resultados da Busca
                </h3>
                <div className="space-y-3">
                  {testResults.searchResults.results.slice(0, 3).map((lead: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold">{lead.name || 'N/A'}</div>
                          <div className="text-sm text-gray-600">{lead.title || 'N/A'} @ {lead.company || 'N/A'}</div>
                        </div>
                        <Badge className={lead.source === 'demo' ? 'bg-orange-500' : 'bg-green-500'}>
                          {lead.source || 'unknown'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        {lead.email && <div>📧 {lead.email}</div>}
                        {lead.phone && <div>📱 {lead.phone}</div>}
                        {lead.linkedinUrl && (
                          <div className="flex items-center gap-1">
                            💼 <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              LinkedIn
                            </a>
                          </div>
                        )}
                        {lead.matchScore && <div>🎯 Match: {lead.matchScore}%</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Details */}
          {testResults.error && (
            <Card className="border-red-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Erro no Teste
                </h3>
                <pre className="text-xs bg-red-50 p-3 rounded overflow-x-auto">
                  {testResults.error}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {testResults.isDemoData && (
            <Card className="border-orange-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-orange-600 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Próximos Passos
                </h3>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Verifique se APOLLO_API_KEY está configurada no Supabase</li>
                  <li>Confirme que a key está correta (sem espaços extras)</li>
                  <li>Reinicie as Edge Functions no Supabase</li>
                  <li>Aguarde 2-3 minutos e teste novamente</li>
                  <li>Se persistir, gere nova API key no Apollo.io</li>
                </ol>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => window.open('https://app.apollo.io/settings/integrations', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Apollo.io Settings
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Test Again */}
          <div className="flex justify-center">
            <Button
              onClick={runTest}
              variant="outline"
              disabled={testing}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Testar Novamente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

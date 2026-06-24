/**
 * 🧪 TESTE RÁPIDO DA API DE LEADS
 * Mostra exatamente o que a API está retornando
 */

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';
import { publicAnonKey } from '../utils/supabase/info';

export function TestAPILeads() {
  const [testing, setTesting] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testLeadsAPI = async () => {
    setTesting(true);
    setResponse(null);
    setError(null);

    console.log('🧪 ═══════════════════════════════════════════════');
    console.log('🧪 TESTE DA API DE LEADS');
    console.log('🧪 ═══════════════════════════════════════════════');
    console.log('📡 URL:', `${API_BASE_URL}${API_ROUTES.searchLeads}`);
    console.log('🔑 Token:', publicAnonKey.substring(0, 20) + '...');
    console.log('');

    const payload = {
      city: 'Lisboa',
      currentTitle: 'CEO',
      hasEmail: true,
      limit: 10
    };

    console.log('📤 PAYLOAD:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');

    try {
      const startTime = Date.now();

      const res = await fetch(`${API_BASE_URL}${API_ROUTES.searchLeads}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('⏱️ Tempo de resposta:', duration + 'ms');
      console.log('📊 Status HTTP:', res.status);
      console.log('');

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ ERRO NA RESPOSTA:');
        console.error(errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      console.log('✅ RESPOSTA RECEBIDA:');
      console.log('');
      console.log('📊 Estrutura da resposta:');
      console.log('   - success:', data.success);
      console.log('   - results:', data.results?.length || 0, 'leads');
      console.log('   - sources:', data.sources?.join(', ') || 'N/A');
      console.log('   - message:', data.message || 'N/A');
      console.log('   - timestamp:', data.timestamp || 'N/A');
      console.log('');

      if (data.results && data.results.length > 0) {
        console.log('📋 PRIMEIRO LEAD (exemplo):');
        console.log(JSON.stringify(data.results[0], null, 2));
        console.log('');
      }

      // 🔥 VERIFICAR SE SÃO DADOS DEMO OU REAIS
      if (data.sources?.includes('demo')) {
        console.error('⚠️ ═══════════════════════════════════════════════');
        console.error('⚠️ ATENÇÃO: DADOS DE DEMONSTRAÇÃO!');
        console.error('⚠️ ═══════════════════════════════════════════════');
        console.error('💡 A API está retornando dados DEMO.');
        console.error('💡 Motivo possível:', data.message);
        console.error('');
        console.error('🔧 PARA OBTER DADOS REAIS:');
        console.error('   1. Configure as API keys no Supabase:');
        console.error('      - APOLLO_API_KEY');
        console.error('      - HUNTER_API_KEY');
        console.error('      - PDL_API_KEY');
        console.error('      - etc.');
        console.error('   2. Teste o endpoint /diagnostics para ver status das keys');
        console.error('⚠️ ═══════════════════════════════════════════════');
        console.error('');

        toast.warning('⚠️ Dados de demonstração', {
          description: 'Configure as API keys no Supabase para obter dados reais',
          duration: 8000,
        });
      } else {
        console.log('✅ ═══════════════════════════════════════════════');
        console.log('✅ DADOS REAIS RECEBIDOS!');
        console.log('✅ Fontes:', data.sources?.join(', '));
        console.log('✅ ═══════════════════════════════════════════════');
        console.log('');

        toast.success('✅ Dados reais recebidos!', {
          description: `${data.results?.length} leads de: ${data.sources?.join(', ')}`,
          duration: 5000,
        });
      }

      setResponse({
        ...data,
        _meta: {
          status: res.status,
          duration: duration + 'ms',
          timestamp: new Date().toISOString(),
        }
      });

    } catch (err) {
      console.error('❌ ═══════════════════════════════════════════════');
      console.error('❌ ERRO AO TESTAR API:');
      console.error(err);
      console.error('❌ ═══════════════════════════════════════════════');
      console.error('');

      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      
      toast.error('❌ Erro ao testar API', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            🧪 Teste da API de Leads
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Teste rápido para ver se a API está retornando dados reais ou demo
          </p>
        </div>

        <Button 
          onClick={testLeadsAPI} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            '▶️ Testar API de Leads'
          )}
        </Button>

        {/* Resultado */}
        {response && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {response.sources?.includes('demo') ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-yellow-600">Dados DEMO</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-green-600">Dados REAIS</span>
                </>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status HTTP:</span>
                <Badge variant={response._meta.status === 200 ? 'default' : 'destructive'}>
                  {response._meta.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tempo de resposta:</span>
                <span className="font-mono">{response._meta.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Leads retornados:</span>
                <span className="font-bold">{response.results?.length || 0}</span>
              </div>

              {response.sources && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fontes:</span>
                  <div className="flex gap-1">
                    {response.sources.map((source: string) => (
                      <Badge 
                        key={source}
                        variant={source === 'demo' ? 'outline' : 'default'}
                      >
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {response.message && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Mensagem:</span>
                  <p className="text-sm mt-1 text-gray-700">{response.message}</p>
                </div>
              )}
            </div>

            {/* Mostrar primeiro lead como exemplo */}
            {response.results && response.results.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-bold mb-2">📋 Exemplo de Lead:</p>
                <pre className="text-xs overflow-x-auto bg-white p-2 rounded">
                  {JSON.stringify(response.results[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="flex items-start gap-2 p-4 bg-red-50 rounded-lg">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-bold text-red-600">Erro</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Dica */}
        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="font-bold text-blue-900 mb-1">💡 Dica:</p>
          <p className="text-blue-800">
            Abra o Console do navegador (F12) para ver logs detalhados da requisição.
          </p>
        </div>
      </div>
    </Card>
  );
}

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Terminal } from 'lucide-react';
import { realAPIService } from '../lib/real-api-service';

export function APIDiagnosticPanel() {
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<'success' | 'error' | 'warning' | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testAPIs = async () => {
    setTesting(true);
    setLogs([]);
    setResult(null);

    try {
      addLog('🚀 Iniciando teste das APIs...');
      
      const config = realAPIService.getConfig();
      addLog(`📋 Apollo Key: ${config.apolloApiKey ? config.apolloApiKey.substring(0, 10) + '...' : 'NÃO CONFIGURADA'}`);
      addLog(`📋 Proxycurl Key: ${config.proxycurlApiKey ? config.proxycurlApiKey.substring(0, 10) + '...' : 'NÃO CONFIGURADA'}`);

      if (!config.apolloApiKey && !config.proxycurlApiKey) {
        addLog('❌ ERRO: Nenhuma API key configurada!');
        setResult('error');
        setTesting(false);
        return;
      }

      // TESTE 1: Apollo.io
      if (config.apolloApiKey) {
        addLog('');
        addLog('🔍 TESTANDO APOLLO.IO...');
        
        try {
          const apolloQuery = {
            api_key: config.apolloApiKey,
            page: 1,
            per_page: 5,
            person_titles: ['CEO']
          };

          addLog('📤 Enviando requisição para Apollo...');
          addLog(`📤 URL: https://api.apollo.io/v1/mixed_people/search`);
          
          const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
            body: JSON.stringify(apolloQuery),
          });

          addLog(`📥 Status: ${response.status} ${response.statusText}`);

          if (!response.ok) {
            const errorText = await response.text();
            addLog(`❌ ERRO Apollo: ${response.status}`);
            addLog(`❌ Resposta: ${errorText.substring(0, 200)}`);
            
            if (response.status === 0 || response.status === undefined) {
              addLog('🚨 ERRO DE CORS DETECTADO!');
              addLog('💡 Apollo.io bloqueia chamadas do navegador por segurança');
              addLog('💡 Solução: Precisa usar um backend/proxy (Supabase Edge Functions)');
              setResult('warning');
            } else if (response.status === 401) {
              addLog('🔑 API Key inválida ou expirada');
              setResult('error');
            } else if (response.status === 429) {
              addLog('⏱️ Limite de requisições atingido (rate limit)');
              setResult('warning');
            } else {
              setResult('error');
            }
          } else {
            const data = await response.json();
            addLog(`✅ Apollo respondeu com sucesso!`);
            addLog(`✅ Pessoas encontradas: ${data.people?.length || 0}`);
            
            if (data.people && data.people.length > 0) {
              addLog(`✅ Exemplo: ${data.people[0].name} - ${data.people[0].title}`);
              setResult('success');
            } else {
              addLog('⚠️ Apollo não retornou resultados para essa busca');
              setResult('warning');
            }
          }
        } catch (error: any) {
          addLog(`❌ EXCEÇÃO Apollo: ${error.message}`);
          
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            addLog('🚨 ERRO DE CORS/NETWORK DETECTADO!');
            addLog('💡 Apollo.io bloqueia chamadas diretas do navegador');
            addLog('💡 A API só aceita chamadas de servidores backend');
            addLog('💡 Solução: Implementar proxy via Supabase Edge Functions');
            setResult('warning');
          } else {
            addLog(`❌ Erro desconhecido: ${error.toString()}`);
            setResult('error');
          }
        }
      }

      // TESTE 2: Proxycurl
      if (config.proxycurlApiKey) {
        addLog('');
        addLog('🔍 TESTANDO PROXYCURL (LinkedIn)...');
        
        try {
          const params = new URLSearchParams({
            country: 'US',
            current_job_title: 'CEO',
            page_size: '5',
          });

          addLog('📤 Enviando requisição para Proxycurl...');
          addLog(`📤 URL: https://nubela.co/proxycurl/api/search/person`);
          
          const response = await fetch(
            `https://nubela.co/proxycurl/api/search/person?${params}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${config.proxycurlApiKey}`,
              },
            }
          );

          addLog(`📥 Status: ${response.status} ${response.statusText}`);

          if (!response.ok) {
            const errorText = await response.text();
            addLog(`❌ ERRO Proxycurl: ${response.status}`);
            addLog(`❌ Resposta: ${errorText.substring(0, 200)}`);
            
            if (response.status === 0 || response.status === undefined) {
              addLog('🚨 ERRO DE CORS DETECTADO!');
              addLog('💡 Proxycurl bloqueia chamadas do navegador por segurança');
              setResult('warning');
            } else if (response.status === 401) {
              addLog('🔑 API Key inválida ou expirada');
              setResult('error');
            } else if (response.status === 402) {
              addLog('💳 Sem créditos disponíveis');
              setResult('warning');
            } else if (response.status === 429) {
              addLog('⏱️ Limite de requisições atingido (rate limit)');
              setResult('warning');
            }
          } else {
            const data = await response.json();
            addLog(`✅ Proxycurl respondeu com sucesso!`);
            addLog(`✅ Perfis encontrados: ${data.results?.length || 0}`);
            
            if (data.results && data.results.length > 0) {
              setResult('success');
            } else {
              addLog('⚠️ Proxycurl não retornou resultados');
              setResult('warning');
            }
          }
        } catch (error: any) {
          addLog(`❌ EXCEÇÃO Proxycurl: ${error.message}`);
          
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            addLog('🚨 ERRO DE CORS/NETWORK DETECTADO!');
            addLog('💡 Proxycurl bloqueia chamadas diretas do navegador');
            addLog('💡 Solução: Implementar proxy via Supabase Edge Functions');
            setResult('warning');
          } else {
            setResult('error');
          }
        }
      }

      addLog('');
      addLog('📊 DIAGNÓSTICO COMPLETO!');

    } catch (error) {
      addLog(`❌ Erro geral: ${error}`);
      setResult('error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            Diagnóstico de APIs
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Teste suas APIs Apollo e Proxycurl em tempo real
          </p>
        </div>
        
        <Button
          onClick={testAPIs}
          disabled={testing}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            'Testar Agora'
          )}
        </Button>
      </div>

      {logs.length > 0 && (
        <div className="mt-4 space-y-3">
          {/* Status Badge */}
          {result && (
            <div className={`p-3 rounded-lg border ${
              result === 'success' 
                ? 'bg-green-500/10 border-green-500/30' 
                : result === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                {result === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                {result === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {result === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                <span className={`font-semibold ${
                  result === 'success' ? 'text-green-300' : 
                  result === 'warning' ? 'text-amber-300' : 'text-red-300'
                }`}>
                  {result === 'success' && 'APIs funcionando!'}
                  {result === 'warning' && 'Problema de CORS detectado'}
                  {result === 'error' && 'Erro nas APIs'}
                </span>
              </div>
            </div>
          )}

          {/* Console de Logs */}
          <div className="bg-black/40 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`py-0.5 ${
                  log.includes('✅') ? 'text-green-400' :
                  log.includes('❌') ? 'text-red-400' :
                  log.includes('⚠️') || log.includes('🚨') ? 'text-amber-400' :
                  log.includes('💡') ? 'text-blue-400' :
                  log.includes('📤') || log.includes('📥') ? 'text-purple-400' :
                  'text-zinc-300'
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Ação Recomendada */}
          {result === 'warning' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg">
              <h4 className="font-bold text-white mb-2">🔧 Solução Necessária</h4>
              <p className="text-sm text-zinc-300 mb-3">
                As APIs Apollo e Proxycurl <strong>bloqueiam chamadas diretas do navegador</strong> por questões de segurança (CORS policy).
                Para usar dados reais, você precisa de um backend intermediário.
              </p>
              <div className="space-y-2 text-sm text-zinc-400">
                <p><strong className="text-white">Opção 1 (Recomendada):</strong> Implementar Supabase Edge Functions como proxy</p>
                <p><strong className="text-white">Opção 2:</strong> Criar servidor Node.js/Python próprio</p>
                <p><strong className="text-white">Opção 3 (Temporário):</strong> Usar dados mockados para demonstração</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
